import { PDFParse } from "pdf-parse";
import { gemini } from "@/lib/gemini";

/**
 * Extracts raw text content from PDF/TXT/Markdown buffers.
 */
export async function extractTextFromBuffer(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    let parser: PDFParse | null = null;
    try {
      parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      return textResult.text || "";
    } catch (err) {
      console.error("[Extractor] PDF parsing failed:", err);
      throw new Error("Failed to parse PDF document structure. Make sure it is not corrupt.");
    } finally {
      if (parser) {
        try {
          await parser.destroy();
        } catch (destroyErr) {
          console.error("[Extractor] Failed to destroy parser:", destroyErr);
        }
      }
    }
  }
  
  // Default to UTF-8 text parsing for text/plain, text/markdown, etc.
  return buffer.toString("utf-8");
}

/**
 * Uses Gemini 2.5 Flash to synthesize structured game design metadata from raw document text.
 */
export async function extractProjectFromText(text: string) {
  const prompt = `You are a senior game designer and systems analyst. Analyze the following game design document text and extract the key metadata parameters to auto-fill a project configuration form.

Return the result strictly as a JSON object matching this structure:
{
  "title": "A compelling title or name for the game based on the text (if not specified, create a suitable creative title)",
  "genre": "The core genre context, e.g., 'Roguelike Deckbuilder', 'Sci-fi Metroidvania', 'Turn-based Strategy'",
  "artStyle": "Visual style direction, e.g., 'Pixel art', '3D Low-poly', 'Stylized 2.5D', 'Realistic'",
  "platform": ["PC", "Consoles", "Mobile", "VR"], // Select all platforms that apply or are mentioned
  "targetAudience": "The target player segment (e.g. 'Hardcore roguelike enthusiasts', 'Casual puzzle fans', 'Midcore strategy players')",
  "keywords": ["tag1", "tag2", "tag3"], // Context search tags/keywords (at least 3-5 tags)
  "playerLoop": "A concise paragraph detailing the player's minute-to-minute or core loop",
  "coreMechanics": ["mechanic1", "mechanic2"], // Key gameplay mechanics (e.g. 'Perma-death', 'Deck building', 'Grid movement')
  "monetization": "Monetization strategy description (e.g., 'Premium with DLC', 'Free-to-play with cosmetic microtransactions')"
}

Here is the document text:
---
${text}
---

Rules:
- Fill in missing parameters with high-quality, creative defaults aligned with the document's content if they are not explicitly specified.
- Do not include any formatting, markdown markers, or explanation outside the JSON block. Return ONLY valid JSON.`;

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          genre: { type: "string" },
          artStyle: { type: "string" },
          platform: {
            type: "array",
            items: { type: "string" }
          },
          targetAudience: { type: "string" },
          keywords: {
            type: "array",
            items: { type: "string" }
          },
          playerLoop: { type: "string" },
          coreMechanics: {
            type: "array",
            items: { type: "string" }
          },
          monetization: { type: "string" }
        },
        required: [
          "title",
          "genre",
          "artStyle",
          "platform",
          "targetAudience",
          "keywords",
          "playerLoop",
          "coreMechanics",
          "monetization"
        ]
      },
      temperature: 0.3,
      maxOutputTokens: 1200,
    },
  });

  const textResponse = response.text;
  if (!textResponse) {
    throw new Error("Empty response returned from the Gemini API");
  }

  // Clean raw text response by stripping any markdown code block wrappers
  let cleanText = textResponse.trim();
  const markdownMatch = cleanText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (markdownMatch) {
    cleanText = markdownMatch[1].trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("[Extractor] Failed to parse Gemini response as JSON. Raw output:", textResponse);
    throw new Error("AI response was not in a valid JSON format.");
  }
}
