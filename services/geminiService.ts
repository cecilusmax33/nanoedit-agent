import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Sends a prompt and an optional image to Gemini for editing/generation.
 * Supports switching between Flash (speed) and Pro (quality).
 */
export const generateImageEdit = async (
  prompt: string,
  base64Image?: string,
  mimeType: string = 'image/png',
  model: string = 'gemini-2.5-flash-image'
): Promise<{ text?: string; imageUrl?: string }> => {
  const ai = getAiClient();
  
  const parts: any[] = [];

  // Add the image if provided (this is the image to be edited)
  if (base64Image) {
    // Strip prefix if present (e.g. data:image/png;base64,)
    const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");
    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType,
      },
    });
  }

  // Add the text prompt
  parts.push({
    text: prompt,
  });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
    });

    let resultText = "";
    let resultImageUrl = undefined;

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          resultText += part.text;
        }
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          // Assume PNG for generated output unless specified otherwise
          resultImageUrl = `data:image/png;base64,${base64Data}`;
        }
      }
    }

    return { text: resultText, imageUrl: resultImageUrl };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};