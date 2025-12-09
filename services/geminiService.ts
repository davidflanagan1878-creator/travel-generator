import { GoogleGenAI, Type } from "@google/genai";
import { OfferPackage, TravelPreferences } from "../types";

// Initialize Gemini Client
// IMPORTANT: The API key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates personalized hotel offers based on user preferences.
 */
export const generateOffers = async (prefs: TravelPreferences): Promise<OfferPackage[]> => {
  const modelId = "gemini-2.5-flash"; // Fast and efficient for structured JSON

  const prompt = `
    You are a world-class Hotel Revenue Manager and Creative Director for a luxury travel brand.
    Create 3 distinct, high-converting hotel offer packages for a trip to "${prefs.destination}".
    
    Guest Profile:
    - Travelers: ${prefs.travelers}
    - Duration: ${prefs.duration}
    - Occasion: ${prefs.occasion}
    - Budget Level: ${prefs.budget}
    - Interests: ${prefs.interests.join(", ")}

    Packages to generate:
    1. The "Smart Choice" (Great value, fits budget)
    2. The "Perfect Match" (Aligned perfectly with interests/occasion)
    3. The "Unforgettable Splurge" (Upsell with premium amenities)

    Be creative with titles and descriptions. Use persuasive marketing copy.
    Return strictly JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              tagline: { type: Type.STRING, description: "A catchy 5-10 word hook" },
              description: { type: Type.STRING, description: "2-3 sentences persuasive copy" },
              price: { type: Type.STRING, description: "Total price estimate (e.g. $1,200)" },
              currency: { type: Type.STRING, description: "Currency symbol, e.g. $" },
              perks: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of 3-5 inclusions (e.g. Breakfast, Spa Credit)"
              },
              roomType: { type: Type.STRING },
              cancellationPolicy: { type: Type.STRING },
              matchScore: { type: Type.INTEGER, description: "Relevance score 70-100" },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "title", "tagline", "description", "price", "currency", "perks", "roomType", "matchScore", "tags"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as OfferPackage[];
    }
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Error generating offers:", error);
    throw error;
  }
};

/**
 * Generates a visualization for a specific offer or destination.
 */
export const generateVisualization = async (destination: string, context: string): Promise<string> => {
  const modelId = "gemini-2.5-flash-image"; // Balanced for generation

  const prompt = `
    A hyper-realistic, award-winning architectural photography shot of a luxury hotel in ${destination}.
    Context: ${context}.
    Lighting: Golden hour, warm, inviting.
    Style: High-end travel magazine, 8k resolution, cinematic lighting.
    No text overlay.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    // Check for inline data (image)
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    // Fallback placeholder if generation fails to avoid breaking UI
    return `https://picsum.photos/800/600?blur=2`; 
  }
};
