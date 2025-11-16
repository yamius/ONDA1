import { createClient } from '@supabase/supabase-js';
import * as tus from 'tus-js-client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials from env
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'audio-practices';

// Extract project ID from URL (e.g., "qwtdppugdcguyeaumymc" from https://qwtdppugdcguyeaumymc.supabase.co)
const projectId = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectId) {
  console.error('❌ Could not extract project ID from Supabase URL');
  process.exit(1);
}

const AUDIO_DIRS = [
  path.join(__dirname, '../public/practices p1'),
  path.join(__dirname, '../public/adaptive-practices'),
];

interface UploadStats {
  total: number;
  uploaded: number;
  skipped: number;
  failed: number;
}

/**
 * Upload a file using TUS resumable upload protocol
 * Recommended for files > 6MB
 */
function uploadWithTUS(
  filePath: string,
  remotePath: string,
  onProgress?: (bytesUploaded: number, bytesTotal: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.readFileSync(filePath);
    const fileStats = fs.statSync(filePath);

    const upload = new tus.Upload(file, {
      // Use direct storage hostname for better performance
      endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
      
      retryDelays: [0, 3000, 5000, 10000, 20000], // Retry with backoff
      
      headers: {
        authorization: `Bearer ${supabaseServiceKey}`,
        'x-upsert': 'true', // Overwrite if exists
      },
      
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true, // Allow re-uploading same file
      
      metadata: {
        bucketName: BUCKET_NAME,
        objectName: remotePath,
        contentType: 'audio/mpeg',
        cacheControl: '3600',
      },
      
      chunkSize: 6 * 1024 * 1024, // 6MB chunks (required by Supabase)
      
      onError: function (error) {
        reject(error);
      },
      
      onProgress: function (bytesUploaded, bytesTotal) {
        if (onProgress) {
          onProgress(bytesUploaded, bytesTotal);
        }
      },
      
      onSuccess: function () {
        resolve();
      }
    });

    // Check for previous uploads and resume if exists
    upload.findPreviousUploads().then(function (previousUploads) {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    }).catch(reject);
  });
}

/**
 * Upload a file using standard Supabase upload
 * Works for files < 6MB
 */
async function uploadStandard(
  filePath: string,
  remotePath: string
): Promise<void> {
  const fileBuffer = fs.readFileSync(filePath);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(remotePath, fileBuffer, {
      contentType: 'audio/mpeg',
      upsert: true, // Overwrite if exists
    });

  if (error) {
    throw error;
  }
}

/**
 * Upload a single audio file
 * Automatically chooses TUS for large files (>6MB)
 */
async function uploadFile(
  filePath: string,
  remotePath: string
): Promise<void> {
  const stats = fs.statSync(filePath);
  const fileSizeMB = stats.size / (1024 * 1024);
  const useTUS = fileSizeMB > 6;

  const sizeLabel = fileSizeMB.toFixed(2) + ' MB';
  const method = useTUS ? 'TUS' : 'Standard';

  console.log(`  📤 Uploading ${remotePath} (${sizeLabel}) via ${method}...`);

  try {
    if (useTUS) {
      let lastProgress = 0;
      await uploadWithTUS(filePath, remotePath, (uploaded, total) => {
        const progress = Math.round((uploaded / total) * 100);
        if (progress - lastProgress >= 10) { // Log every 10%
          console.log(`     ${progress}%`);
          lastProgress = progress;
        }
      });
    } else {
      await uploadStandard(filePath, remotePath);
    }
    console.log(`  ✅ Uploaded: ${remotePath}`);
  } catch (error) {
    console.error(`  ❌ Failed: ${remotePath}`, error);
    throw error;
  }
}

function getAllAudioFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getAllAudioFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.mp3')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function ensureBucketExists() {
  console.log(`\n🪣 Checking if bucket "${BUCKET_NAME}" exists...`);
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('❌ Error listing buckets:', listError);
    throw listError;
  }

  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`📦 Creating bucket "${BUCKET_NAME}" with 50MB limit...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 52428800, // 50MB per file (free tier max)
    });

    if (createError) {
      console.error('❌ Error creating bucket:', createError);
      throw createError;
    }
    console.log('✅ Bucket created successfully');
  } else {
    console.log('✅ Bucket already exists');
  }
}

async function main() {
  console.log('🎵 ONDA Audio Upload to Supabase (TUS Resumable)');
  console.log('='.repeat(60));
  console.log(`📍 Project ID: ${projectId}`);
  console.log(`📦 Bucket: ${BUCKET_NAME}`);
  console.log(`🔧 Using TUS for files > 6MB\n`);

  await ensureBucketExists();

  const stats: UploadStats = {
    total: 0,
    uploaded: 0,
    skipped: 0,
    failed: 0,
  };

  // Collect all audio files
  const allFiles: string[] = [];
  for (const dir of AUDIO_DIRS) {
    allFiles.push(...getAllAudioFiles(dir));
  }

  stats.total = allFiles.length;
  console.log(`\n📊 Found ${stats.total} audio files\n`);

  if (stats.total === 0) {
    console.log('⚠️  No audio files found. Exiting.');
    return;
  }

  // Upload each file
  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    
    // Determine which base directory this file belongs to
    let baseDir = '';
    let relativePath = '';
    
    for (const dir of AUDIO_DIRS) {
      if (filePath.startsWith(dir)) {
        baseDir = dir;
        relativePath = path.relative(dir, filePath);
        break;
      }
    }

    if (!baseDir) {
      console.warn(`⚠️  Skipping file (unknown base directory): ${filePath}`);
      stats.skipped++;
      continue;
    }

    // Normalize path separators for storage
    const remotePath = relativePath.split(path.sep).join('/');

    console.log(`\n[${i + 1}/${stats.total}] Processing: ${remotePath}`);

    try {
      await uploadFile(filePath, remotePath);
      stats.uploaded++;
    } catch (error) {
      console.error(`❌ Upload failed:`, error);
      stats.failed++;
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Upload Summary:');
  console.log(`   Total files: ${stats.total}`);
  console.log(`   ✅ Uploaded: ${stats.uploaded}`);
  console.log(`   ⏭️  Skipped:  ${stats.skipped}`);
  console.log(`   ❌ Failed:   ${stats.failed}`);
  console.log('='.repeat(60));

  if (stats.failed > 0) {
    console.log('\n⚠️  Some files failed to upload. Check the logs above.');
    process.exit(1);
  } else {
    console.log('\n✅ All files uploaded successfully!');
  }
}

main().catch(console.error);
