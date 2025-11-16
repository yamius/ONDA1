import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface HumeEmotionScore {
  name: string;
  score: number;
}

interface HumeProsodyPrediction {
  emotions: HumeEmotionScore[];
}

interface HumeApiResponse {
  results?: {
    predictions?: Array<{
      models?: {
        prosody?: {
          grouped_predictions?: Array<{
            predictions?: HumeProsodyPrediction[];
          }>;
        };
      };
    }>;
  }[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const HUME_API_KEY = Deno.env.get("HUME_API_KEY");
    
    if (!HUME_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: "Hume AI API key not configured",
          useMock: true 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let audioBlob: Blob;
    let fileName = "recording.webm";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("audio");

      if (!file || !(file instanceof Blob)) {
        throw new Error("No audio file provided");
      }

      audioBlob = file;

      if (file instanceof File && file.name) {
        fileName = file.name;
      }
    } else {
      audioBlob = await req.blob();
    }

    console.log("Processing audio file:", fileName, "Size:", audioBlob.size, "Type:", audioBlob.type);

    const form = new FormData();
    form.append("file", audioBlob, fileName);
    form.append("json", JSON.stringify({ models: { prosody: {} } }));

    console.log("Sending request to Hume AI...");

    const humeResponse = await fetch("https://api.hume.ai/v0/batch/jobs", {
      method: "POST",
      headers: {
        "X-Hume-Api-Key": HUME_API_KEY,
      },
      body: form,
    });

    if (!humeResponse.ok) {
      const errorText = await humeResponse.text();
      console.error("Hume API error response:", humeResponse.status, errorText);
      throw new Error(`Hume API error: ${humeResponse.status} - ${errorText}`);
    }

    const jobData = await humeResponse.json();
    console.log("Job created:", jobData.job_id);
    const jobId = jobData.job_id;

    let jobComplete = false;
    let attempts = 0;
    const maxAttempts = 60;
    let results: HumeApiResponse | null = null;

    while (!jobComplete && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const statusResponse = await fetch(
        `https://api.hume.ai/v0/batch/jobs/${jobId}/predictions`,
        {
          headers: {
            "X-Hume-Api-Key": HUME_API_KEY,
          },
        }
      );

      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}, status: ${statusResponse.status}`);

      if (statusResponse.ok) {
        results = await statusResponse.json();
        jobComplete = true;
        console.log("Job complete, processing results...");
      } else if (statusResponse.status === 404) {
        console.log("Job still processing...");
      } else {
        const errorText = await statusResponse.text();
        console.error("Error fetching job status:", statusResponse.status, errorText);
      }

      attempts++;
    }

    if (!results || !results.results || results.results.length === 0) {
      throw new Error("No results from Hume AI");
    }

    const predictions = results.results[0]?.predictions?.[0]?.models?.prosody?.grouped_predictions?.[0]?.predictions?.[0];
    
    if (!predictions || !predictions.emotions) {
      throw new Error("Invalid response structure from Hume AI");
    }

    const emotions = predictions.emotions
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const primaryEmotion = emotions[0];
    const averageScore = emotions.slice(0, 5).reduce((sum, e) => sum + e.score, 0) / 5;
    const energyEmotions = ["Excitement", "Joy", "Triumph", "Amusement", "Surprise (positive)"];
    const calmEmotions = ["Calmness", "Contentment", "Relief", "Satisfaction", "Contemplation"];
    
    const energyScore = emotions
      .filter(e => energyEmotions.some(en => e.name.toLowerCase().includes(en.toLowerCase())))
      .reduce((sum, e) => sum + e.score, 0) / energyEmotions.length;

    const emotionMapping: { [key: string]: string } = {
      "calmness": "emotional_check.calmness",
      "contentment": "emotional_check.calmness",
      "joy": "emotional_check.joy",
      "amusement": "emotional_check.joy",
      "excitement": "emotional_check.joy",
      "anxiety": "emotional_check.anxiety",
      "distress": "emotional_check.anxiety",
      "fear": "emotional_check.anxiety",
      "tiredness": "emotional_check.fatigue",
      "boredom": "emotional_check.fatigue",
      "determination": "emotional_check.inspiration",
      "interest": "emotional_check.inspiration",
      "concentration": "emotional_check.contemplation",
      "contemplation": "emotional_check.contemplation",
    };

    const mappedEmotion = Object.keys(emotionMapping).find(key => 
      primaryEmotion.name.toLowerCase().includes(key)
    );

    const emotionKey = mappedEmotion 
      ? emotionMapping[mappedEmotion] 
      : "emotional_check.contemplation";

    const recommendationKey = emotionKey.replace(
      "emotional_check.",
      "emotional_check.rec_"
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
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing emotion analysis:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        useMock: true
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});