import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'audio-practices';
const CACHE_NAME = 'onda-audio-cache-v1';
const DB_NAME = 'onda-audio-db';
const STORE_NAME = 'audio-blobs';

interface AudioCacheStatus {
  loading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
  cached: boolean;
}

interface IndexedDBSchema {
  path: string;
  blob: Blob;
  timestamp: number;
}

// IndexedDB helpers
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'path' });
      }
    };
  });
}

async function getFromIndexedDB(path: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(path);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const data = request.result as IndexedDBSchema | undefined;
        resolve(data?.blob || null);
      };
    });
  } catch (error) {
    console.error('[AudioCache] IndexedDB get error:', error);
    return null;
  }
}

async function saveToIndexedDB(path: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const data: IndexedDBSchema = {
        path,
        blob,
        timestamp: Date.now(),
      };
      const request = store.put(data);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error('[AudioCache] IndexedDB save error:', error);
  }
}

// Cache API helpers
async function getFromCacheAPI(path: string): Promise<Response | null> {
  if (!('caches' in window)) return null;
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(path);
    return response || null;
  } catch (error) {
    console.error('[AudioCache] Cache API get error:', error);
    return null;
  }
}

async function saveToCacheAPI(path: string, response: Response): Promise<void> {
  if (!('caches' in window)) return;
  
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(path, response.clone());
  } catch (error) {
    console.error('[AudioCache] Cache API save error:', error);
  }
}

/**
 * Hook for progressive audio loading from Supabase Storage with dual-layer caching
 * 
 * @param audioPath - Relative path to audio file (e.g., "practices p1/intro.mp3")
 * @returns Status object with loading state, progress, error, and blob URL
 * 
 * @example
 * const { url, loading, progress, error } = useAudioCache('practices p1/track1.mp3');
 * 
 * if (loading) return <Progress value={progress} />;
 * if (error) return <div>Error: {error}</div>;
 * return <audio src={url} />;
 */
export function useAudioCache(audioPath: string | null): AudioCacheStatus {
  const [status, setStatus] = useState<AudioCacheStatus>({
    loading: false,
    progress: 0,
    error: null,
    url: null,
    cached: false,
  });

  const loadAudio = useCallback(async (path: string, signal: AbortSignal, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    setStatus(prev => ({ ...prev, loading: true, progress: 0, error: null }));

    try {
      // Step 1: Check IndexedDB cache
      const cachedBlob = await getFromIndexedDB(path);
      if (cachedBlob && !signal.aborted) {
        const objectURL = URL.createObjectURL(cachedBlob);
        setStatus({
          loading: false,
          progress: 100,
          error: null,
          url: objectURL,
          cached: true,
        });
        console.log('[AudioCache] Loaded from IndexedDB:', path);
        return objectURL;
      }

      // Step 2: Check Cache API
      const cachedResponse = await getFromCacheAPI(path);
      if (cachedResponse && !signal.aborted) {
        const blob = await cachedResponse.blob();
        const objectURL = URL.createObjectURL(blob);
        
        // Also save to IndexedDB for faster future access
        await saveToIndexedDB(path, blob);
        
        setStatus({
          loading: false,
          progress: 100,
          error: null,
          url: objectURL,
          cached: true,
        });
        console.log('[AudioCache] Loaded from Cache API:', path);
        return objectURL;
      }

      if (signal.aborted) {
        throw new Error('Aborted');
      }

      // Step 3: Download from Supabase Storage
      console.log('[AudioCache] Downloading from Supabase:', path);
      
      const { data, error: urlError } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

      if (urlError || !data) {
        throw new Error(urlError?.message || 'Failed to get public URL');
      }

      console.log('[AudioCache] Public URL generated:', data.publicUrl);

      setStatus(prev => ({ ...prev, progress: 10 }));

      // Fetch with progress tracking and abort signal
      const response = await fetch(data.publicUrl, { signal });
      
      console.log('[AudioCache] Fetch response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('Content-Length') || 0);
      
      if (!reader) {
        throw new Error('ReadableStream not supported');
      }

      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true) {
        if (signal.aborted) {
          await reader.cancel();
          throw new Error('Aborted');
        }

        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        const progress = contentLength 
          ? Math.round((receivedLength / contentLength) * 90) + 10 
          : 50;
        
        setStatus(prev => ({ ...prev, progress }));
      }

      // Combine chunks into blob
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const objectURL = URL.createObjectURL(blob);

      // Save to both caches
      await Promise.all([
        saveToIndexedDB(path, blob),
        saveToCacheAPI(path, new Response(blob)),
      ]);

      setStatus({
        loading: false,
        progress: 100,
        error: null,
        url: objectURL,
        cached: false,
      });

      console.log('[AudioCache] Downloaded and cached:', path);
      return objectURL;

    } catch (error) {
      if (signal.aborted) {
        console.log('[AudioCache] Load aborted:', path);
        return null;
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      
      // Retry logic for network errors
      if (retryCount < MAX_RETRIES && !message.includes('Aborted')) {
        console.warn(`[AudioCache] Retry ${retryCount + 1}/${MAX_RETRIES}:`, path);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        return loadAudio(path, signal, retryCount + 1);
      }

      console.error('[AudioCache] Error loading audio:', message);
      setStatus({
        loading: false,
        progress: 0,
        error: message,
        url: null,
        cached: false,
      });
      return null;
    }
  }, []);

  useEffect(() => {
    if (!audioPath) {
      setStatus({
        loading: false,
        progress: 0,
        error: null,
        url: null,
        cached: false,
      });
      return;
    }

    const abortController = new AbortController();
    let currentURL: string | null = null;

    loadAudio(audioPath, abortController.signal).then(url => {
      currentURL = url;
    });

    // Cleanup: abort fetch and revoke blob URL
    return () => {
      abortController.abort();
      if (currentURL) {
        URL.revokeObjectURL(currentURL);
      }
    };
  }, [audioPath, loadAudio]);

  return status;
}

/**
 * Preload audio files in background
 * 
 * @example
 * const preloader = useAudioPreloader();
 * preloader.preload(['track1.mp3', 'track2.mp3']);
 */
export function useAudioPreloader() {
  const [queue, setQueue] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);

  const preload = useCallback((paths: string[]) => {
    setQueue(prev => [...prev, ...paths]);
  }, []);

  const { url, loading } = useAudioCache(current);

  useEffect(() => {
    if (!loading && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
    }
  }, [loading, queue]);

  return { preload, current, remaining: queue.length };
}

/**
 * Clear all cached audio
 */
export async function clearAudioCache(): Promise<void> {
  try {
    // Clear IndexedDB
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve(undefined);
      request.onerror = () => reject(request.error);
    });

    // Clear Cache API
    if ('caches' in window) {
      await caches.delete(CACHE_NAME);
    }

    console.log('[AudioCache] All caches cleared');
  } catch (error) {
    console.error('[AudioCache] Error clearing cache:', error);
  }
}
