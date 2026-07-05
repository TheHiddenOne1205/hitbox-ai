import { gemini } from "@/lib/gemini";
import { Project } from "@/types";
import { DiscoveredInsight } from "./types";

interface RawValidationOutput {
  relevance: boolean;
  viability_score: number;
  sentiment_reason: string;
  core_player_gripe: string[];
  core_player_desires: string[];
  cited_competitors: string[];
  structural_pitfalls: string[];
  aligned_features: string[];
}

/**
 * Validates a batch of community discussion snippets against the active project profile/GDD parameters using Gemini 3.1 Flash Lite.
 * Evaluates sentiment, viability, gripes, desires, competitors, pitfalls, and easy additions.
 */
export async function validateCommunitySnippets(
  snippets: { title: string; forum_hub_origin: "Reddit" | "Steam Community"; structural_text: string; reference_url: string; community_score: number; published_date?: string }[],
  project: Project,
  mechanicName: string,
  targetGenre: string
): Promise<DiscoveredInsight[]> {
  if (snippets.length === 0) {
    return [];
  }

  const prompt = `You are a senior systems game designer and market analyst. Validate a list of community discussion snippets fetched for the mechanic "${mechanicName}" in the genre "${targetGenre}".
Evaluate them against the project profile parameters of our game:
- Title: ${project.title}
- Genre: ${project.genre}
- Target Audience: ${project.target_audience}
- Platform: ${project.platform}
- Core Player Loop: ${project.gdd_data?.playerLoop || "Not specified"}
- Core Mechanics: ${(project.gdd_data?.coreMechanics || []).join(", ") || "Not specified"}

Here is the list of discussion snippets to evaluate:
${JSON.stringify(snippets.map((s, idx) => ({ id: idx, title: s.title, text: s.structural_text })), null, 2)}

For EACH snippet, determine if it is relevant to the gameplay mechanic "${mechanicName}" and the genre context. If relevant, analyze the snippet and produce:
1. relevance: true if the snippet is about this mechanic/genre and offers real player feedback/opinion, false otherwise.
2. viability_score: a score from 0 to 100 on how viable this mechanic is based on player reception in the snippet (e.g. high score means players love it, low score means lots of complaints/frustrations).
3. sentiment_reason: a concise paragraph summarizing player sentiment, balance issues, or player feedback.
4. core_player_gripe: list of explicit player complaints or pain points.
5. core_player_desires: list of player desires, features they wish existed, or suggestions.
6. cited_competitors: other game titles mentioned or implied.
7. structural_pitfalls: design or balance pitfalls to avoid.
8. aligned_features: easy design features or improvements to add.

Return the results strictly as a JSON object containing an array of evaluations matching the index id of the inputs:
{
  "evaluations": [
    {
      "id": 0,
      "relevance": true,
      "viability_score": 85,
      "sentiment_reason": "...",
      "core_player_gripe": ["..."],
      "core_player_desires": ["..."],
      "cited_competitors": ["..."],
      "structural_pitfalls": ["..."],
      "aligned_features": ["..."]
    }
  ]
}

Rules:
- Ground your analysis strictly on what players are voicing in the snippets. No generic advice.
- Return ONLY valid JSON format.`;

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            evaluations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  relevance: { type: "boolean" },
                  viability_score: { type: "integer" },
                  sentiment_reason: { type: "string" },
                  core_player_gripe: {
                    type: "array",
                    items: { type: "string" }
                  },
                  core_player_desires: {
                    type: "array",
                    items: { type: "string" }
                  },
                  cited_competitors: {
                    type: "array",
                    items: { type: "string" }
                  },
                  structural_pitfalls: {
                    type: "array",
                    items: { type: "string" }
                  },
                  aligned_features: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: [
                  "id",
                  "relevance",
                  "viability_score",
                  "sentiment_reason",
                  "core_player_gripe",
                  "core_player_desires",
                  "cited_competitors",
                  "structural_pitfalls",
                  "aligned_features"
                ]
              }
            }
          },
          required: ["evaluations"]
        },
        temperature: 0.2,
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Empty response from Gemini API");
    }

    let cleanText = textResponse.trim();
    const markdownMatch = cleanText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (markdownMatch) {
      cleanText = markdownMatch[1].trim();
    }

    const parsed = JSON.parse(cleanText) as { evaluations: (RawValidationOutput & { id: number })[] };
    const evaluations = parsed.evaluations || [];

    const validatedInsights: DiscoveredInsight[] = [];

    for (const evalResult of evaluations) {
      if (evalResult.relevance) {
        const snippet = snippets[evalResult.id];
        if (snippet) {
          validatedInsights.push({
            title: snippet.title,
            source_url: snippet.reference_url,
            qualitative_meta: snippet.structural_text,
            forum_hub_origin: snippet.forum_hub_origin,
            community_upvotes: snippet.community_score,
            viability_score: evalResult.viability_score,
            sentiment_reason: evalResult.sentiment_reason,
            core_player_gripe: evalResult.core_player_gripe,
            core_player_desires: evalResult.core_player_desires,
            cited_competitors: evalResult.cited_competitors,
            structural_pitfalls: evalResult.structural_pitfalls,
            aligned_features: evalResult.aligned_features,
            published_date: snippet.published_date
          });
        }
      }
    }

    return validatedInsights;
  } catch (error) {
    console.error("[Validator] Gemini processing failed:", error);
    throw error;
  }
}
