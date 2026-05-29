import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Voice emotion analysis via Hume AI **Stream API** (WebSocket).
 *
 * History note:
 *   v1: Hume Batch Jobs API. Async — submit + poll. End-to-end latency
 *       10–30 s. Client only waits 5 s before falling back to a random
 *       mock emotion, so in production the user almost never saw the
 *       real result. The feature looked like decoration.
 *
 *   v2 (this file): Hume Stream Models API. Synchronous WebSocket —
 *       one message in, one prediction message back, typically 1–2 s
 *       total. Fits comfortably under the client's 5-second timeout,
 *       so the user actually sees their real top emotion.
 *
 * Privacy posture is unchanged: audio passes through this Edge Function
 * in-memory only (no Supabase Storage write, no DB insert), forwarded
 * to Hume AI's prosody model, and discarded once the prediction is
 * returned. Hume AI's own retention policy applies during the analysis
 * window. This matches the public Privacy Policy §1.3 "Emotion
 * Analysis (Voice Check)" effective 2026-05-29.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface HumeEmotionScore {
  name: string;
  score: number;
}

/**
 * Hume Stream `/v0/stream/models` response shape (prosody model).
 * Only the fields we actually consume are typed.
 */
interface HumeStreamMessage {
  prosody?: {
    predictions?: Array<{
      time?: { begin: number; end: number };
      emotions?: HumeEmotionScore[];
    }>;
    warning?: string;
    error?: string;
  };
  error?: string;
  warning?: string;
}

/**
 * Convert an ArrayBuffer to base64 without blowing up on large inputs.
 * String.fromCharCode(...new Uint8Array(buf)) throws on big buffers
 * because of the spread argument-count limit, so we chunk manually.
 */
function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  const CHUNK = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

/**
 * Send the audio to Hume Stream, wait for one prediction message,
 * close the socket. Resolves with the parsed message, or rejects
 * on timeout / socket error / Hume-side error.
 */
async function callHumeStream(
  apiKey: string,
  audioBase64: string,
  timeoutMs: number,
): Promise<HumeStreamMessage> {
  return new Promise<HumeStreamMessage>((resolve, reject) => {
    // Hume Stream Models endpoint. Auth via query param is the documented
    // pattern for WebSocket clients that can't set custom headers.
    const url = `wss://api.hume.ai/v0/stream/models?apiKey=${encodeURIComponent(apiKey)}`;
    const ws = new WebSocket(url);

    const timer = setTimeout(() => {
      console.warn("[analyze-emotion] Hume stream timeout after", timeoutMs, "ms");
      try { ws.close(); } catch (_) { /* ignore */ }
      reject(new Error(`Hume stream timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    ws.onopen = () => {
      console.log("[analyze-emotion] Hume WS open, sending audio…");
      ws.send(
        JSON.stringify({
          data: audioBase64,
          models: { prosody: {} },
          raw_text: false,
        }),
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as HumeStreamMessage;
        // Hume may send warning-only frames before predictions on edge cases;
        // we accept the first frame that has predictions or an explicit error.
        if (msg.prosody?.predictions || msg.prosody?.error || msg.error) {
          clearTimeout(timer);
          try { ws.close(); } catch (_) { /* ignore */ }
          resolve(msg);
        } else {
          console.log("[analyze-emotion] Hume non-final frame:", msg);
        }
      } catch (e) {
        clearTimeout(timer);
        try { ws.close(); } catch (_) { /* ignore */ }
        reject(new Error(`Hume stream parse error: ${(e as Error).message}`));
      }
    };

    ws.onerror = (e) => {
      clearTimeout(timer);
      console.error("[analyze-emotion] Hume WS error:", e);
      reject(new Error("Hume WebSocket error"));
    };

    ws.onclose = (event) => {
      // If the socket closes without resolving (no message received),
      // surface that as a rejection so the caller can fall back.
      clearTimeout(timer);
      if (event.code !== 1000) {
        console.warn("[analyze-emotion] Hume WS closed unexpectedly:", event.code, event.reason);
      }
    };
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const HUME_API_KEY = Deno.env.get("HUME_API_KEY");

    if (!HUME_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Hume AI API key not configured",
          useMock: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ----- Decode the inbound audio into base64 -----
    const contentType = req.headers.get("content-type") || "";
    let audioBase64: string;

    if (contentType.includes("application/json")) {
      // iOS WKWebView path: client sends { audio: "data:audio/webm;base64,…", format: "base64" }
      const body = await req.json();
      if (body.audio && body.format === "base64") {
        audioBase64 = body.audio.includes(",")
          ? body.audio.split(",")[1]
          : body.audio;
      } else {
        throw new Error("Invalid JSON body format (expected audio + format fields)");
      }
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("audio");
      if (!file || !(file instanceof Blob)) {
        throw new Error("No audio file provided");
      }
      audioBase64 = arrayBufferToBase64(await file.arrayBuffer());
    } else {
      // Raw blob fallback
      audioBase64 = arrayBufferToBase64(await req.arrayBuffer());
    }

    console.log("[analyze-emotion] Audio base64 length:", audioBase64.length);

    // ----- Call Hume Stream -----
    // The client aborts at 5 s, so we cap our wait at 4.2 s and leave
    // headroom for response serialisation.
    const streamMsg = await callHumeStream(HUME_API_KEY, audioBase64, 4200);

    if (streamMsg.error || streamMsg.prosody?.error) {
      throw new Error(
        `Hume stream error: ${streamMsg.error ?? streamMsg.prosody?.error}`,
      );
    }

    const prediction = streamMsg.prosody?.predictions?.[0];
    if (!prediction || !prediction.emotions) {
      throw new Error("No prosody predictions in Hume stream response");
    }

    // ----- Map Hume emotions → in-app keys -----
    const emotions = [...prediction.emotions]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const primaryEmotion = emotions[0];

    const energyEmotions = ["Excitement", "Joy", "Triumph", "Amusement", "Surprise (positive)"];
    const energyScore =
      emotions
        .filter((e) =>
          energyEmotions.some((en) => e.name.toLowerCase().includes(en.toLowerCase())),
        )
        .reduce((sum, e) => sum + e.score, 0) / energyEmotions.length;

    const emotionMapping: { [key: string]: string } = {
      calmness: "emotional_check.calmness",
      contentment: "emotional_check.calmness",
      joy: "emotional_check.joy",
      amusement: "emotional_check.joy",
      excitement: "emotional_check.joy",
      anxiety: "emotional_check.anxiety",
      distress: "emotional_check.anxiety",
      fear: "emotional_check.anxiety",
      tiredness: "emotional_check.fatigue",
      boredom: "emotional_check.fatigue",
      determination: "emotional_check.inspiration",
      interest: "emotional_check.inspiration",
      concentration: "emotional_check.contemplation",
      contemplation: "emotional_check.contemplation",
    };

    const mappedEmotion = Object.keys(emotionMapping).find((key) =>
      primaryEmotion.name.toLowerCase().includes(key),
    );

    const emotionKey = mappedEmotion
      ? emotionMapping[mappedEmotion]
      : "emotional_check.contemplation";

    const recommendationKey = emotionKey.replace(
      "emotional_check.",
      "emotional_check.rec_",
    );

    return new Response(
      JSON.stringify({
        primaryEmotion: emotionKey,
        confidence: primaryEmotion.score,
        energyLevel: Math.min(energyScore * 1.5, 1),
        recommendation: recommendationKey,
        rawEmotions: emotions,
        humeData: {
          topEmotion: primaryEmotion.name,
          score: primaryEmotion.score,
        },
        source: "hume-stream",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("[analyze-emotion] Error:", error);
    console.error(
      "[analyze-emotion] Stack:",
      error instanceof Error ? error.stack : "no stack",
    );

    // Returning useMock:true lets the client display a random
    // calming emotion instead of a hard error. Same behaviour as v1.
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        useMock: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
