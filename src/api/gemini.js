const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Gets the Gemini API key from environment variables or local storage fallback.
 */
export const getGeminiApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem("reelify_gemini_key") || "";
};

/**
 * Uses Gemini to detect if the query references a specific movie/TV show and extracts its title.
 */
export const extractMovieTitle = async (question, apiKey) => {
  if (!apiKey) return { hasMovie: false, title: null };

  const prompt = `Analyze this user question about movies/TV shows: "${question}"
Respond strictly in JSON format matching this schema:
{
  "hasMovie": boolean, // true if they ask about a specific movie, TV series, or franchise by name
  "extractedTitle": string // the name of the movie/series/franchise if found, otherwise null. Extract only the actual name (e.g. for "Who directed Inception?", return "Inception")
}
Do not include any other text, markdown formatting, or code blocks. Just return the raw JSON object.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    // Clean up potential markdown formatting (like ```json ... ```)
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanedText);
    return {
      hasMovie: !!result.hasMovie,
      title: result.extractedTitle || null
    };
  } catch (err) {
    console.error("Failed to extract movie title using Gemini", err);
    return { hasMovie: false, title: null };
  }
};

/**
 * Generates the final chatbot response using retrieved TMDB movie details if available.
 */
export const generateChatResponse = async (question, movieData, apiKey) => {
  if (!apiKey) {
    return "Error: Gemini API Key is missing. Please add it to your .env file or input it in settings.";
  }

  let prompt = "";
  if (movieData) {
    prompt = `You are Reelify AI, a friendly, witty, and highly knowledgeable movie expert chatbot.
Use the following TMDB movie/TV show data to answer the user's question. Be helpful, concise, and engaging.
If the movie data is not sufficient or you need to supply more information, feel free to use your own knowledge.

TMDB Data:
${JSON.stringify(movieData, null, 2)}

User Question: "${question}"`;
  } else {
    prompt = `You are Reelify AI, a friendly, witty, and highly knowledgeable movie expert chatbot.
Answer the user's question about movies, TV series, actors, or general queries. Be helpful, concise, and engaging.

User Question: "${question}"`;
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from AI.";
    return text;
  } catch (err) {
    console.error("Failed to generate response using Gemini", err);
    return `Error: ${err.message || "Something went wrong while talking to Gemini."}`;
  }
};
