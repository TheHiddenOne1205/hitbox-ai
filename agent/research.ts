import { Stagehand } from "@browserbasehq/stagehand";
import Browserbase from "@browserbasehq/sdk";
import { gemini } from "@/lib/gemini";
import { z } from "zod";
import { CompetitorResearchDossier, Project } from "@/types";

/**
 * Searches SearXNG to resolve a competitor's game title to a Store/App URL (Steam prioritized).
 */
async function resolveCompetitorUrl(competitorName: string): Promise<string | null> {
  const serperApiKey = process.env.SERPER_API_KEY;
  const primaryQuery = `site:store.steampowered.com/app "${competitorName}"`;
  const fallbackQuery = `"${competitorName}" video game`;

  if (serperApiKey) {
    console.log(`[Research Agent] Resolving competitor URL for "${competitorName}" via Serper.dev`);
    const runSerperSearch = async (q: string) => {
      try {
        const response = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-KEY": serperApiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ q })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.organic && data.organic.length > 0) {
            return data.organic[0].link || null;
          }
        }
      } catch (err) {
        console.error(`[Research Agent] Serper.dev fetch failed for query "${q}":`, err);
      }
      return null;
    };

    let resolved = await runSerperSearch(primaryQuery);
    if (!resolved) {
      resolved = await runSerperSearch(fallbackQuery);
    }
    if (resolved) {
      console.log(`[Research Agent] Resolved competitor URL: ${resolved}`);
      return resolved;
    }
  }

  // Fallback: SearXNG
  const baseUrl = process.env.NEXT_PUBLIC_SEARXNG_BASE_URL || process.env.SEARXNG_BASE_URL || "http://localhost:8888";
  
  console.log(`[Research Agent] Resolving competitor URL for "${competitorName}" with query: ${primaryQuery} (SearXNG fallback)`);
  
  try {
    const url = `${baseUrl}/search?q=${encodeURIComponent(primaryQuery)}&format=json&categories=general`;
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const targetUrl = data.results[0].url;
        console.log(`[Research Agent] Resolved primary competitor URL: ${targetUrl}`);
        return targetUrl;
      }
    }
  } catch (err) {
    console.error(`[Research Agent] Primary URL resolution failed for "${competitorName}":`, err);
  }

  console.log(`[Research Agent] Trying fallback URL resolution for "${competitorName}" with query: ${fallbackQuery} (SearXNG fallback)`);
  try {
    const url = `${baseUrl}/search?q=${encodeURIComponent(fallbackQuery)}&format=json&categories=general`;
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const targetUrl = data.results[0].url;
        console.log(`[Research Agent] Resolved fallback competitor URL: ${targetUrl}`);
        return targetUrl;
      }
    }
  } catch (err) {
    console.error(`[Research Agent] Fallback URL resolution failed for "${competitorName}":`, err);
  }

  return null;
}

interface ScrapedData {
  featureOverview?: string;
  systemBalance?: string;
  communityScale?: string[];
  balanceFlaws?: string[];
  playerDesires?: string[];
  systemNuances?: string[];
  sourceUrl?: string;
}

/**
 * Executes a live scraping session on Browserbase using Stagehand.
 */
async function scrapeCompetitorPage(url: string): Promise<ScrapedData> {
  console.log(`[Research Agent] Initiating Stagehand Browserbase session for: ${url}`);
  
  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    timeout: 120, // 2 minutes
  });

  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    apiKey: process.env.BROWSERBASE_API_KEY!,
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    browserbaseSessionID: session.id,
    model: {
      modelName: "google/gemini-3.1-flash-lite",
      apiKey: process.env.GEMINI_API_KEY!,
    }
  });

  try {
    await stagehand.init();
    const page = stagehand.context.activePage();
    if (!page) {
      throw new Error("Failed to get active page from Stagehand context");
    }
    await page.goto(url);
    await page.waitForLoadState("networkidle");

    // Extract homepage structural data
    console.log(`[Research Agent] Extracting homepage metadata...`);
    const homepageMetrics = await stagehand.extract(
      "Analyze this competitor game's central page. Extract what core structural features distinguish their gameplay loop, balance markers, and sub-link references worth navigating.",
      z.object({
        featureOverview: z.string().describe("Summary of game loop execution parameters"),
        systemBalance: z.string().describe("How mechanics interact inside their build loop"),
        communityScale: z.array(z.string()).describe("Signals tracking player volume, patch counts, or scale metrics"),
        subLinks: z.array(z.object({
          url: z.string(),
          type: z.enum(["reviews", "discussions", "patchnotes", "about", "other"])
        })).describe("Sub-links worth visiting to track player balance sentiments")
      })
    );

    console.log(`[Research Agent] Homepage extraction completed. Features: ${homepageMetrics.featureOverview ? "yes" : "no"}. Found ${homepageMetrics.subLinks?.length || 0} sub-links.`);

    let balanceFlaws: string[] = [];
    let playerDesires: string[] = [];
    let systemNuances: string[] = [];

    // Navigate to at most 1 discussion or review page
    const subLink = homepageMetrics.subLinks?.find(
      (link: { url: string; type: string }) => link.type === "discussions" || link.type === "reviews"
    );

    if (subLink?.url) {
      const fullUrl = subLink.url.startsWith("http") ? subLink.url : new URL(subLink.url, url).toString();
      console.log(`[Research Agent] Navigating to sub-page: ${fullUrl}`);
      
      try {
        await page.goto(fullUrl);
        await page.waitForLoadState("networkidle");
        
        console.log(`[Research Agent] Extracting sub-page sentiment details...`);
        const subPageMetrics = await stagehand.extract(
          "Extract explicit structural complaints, technical feature failures, gameplay balance trends, and design loop constraints voiced by active player networks.",
          z.object({
            balanceFlaws: z.array(z.string()),
            playerDesires: z.array(z.string()),
            systemNuances: z.array(z.string())
          })
        );

        balanceFlaws = subPageMetrics.balanceFlaws || [];
        playerDesires = subPageMetrics.playerDesires || [];
        systemNuances = subPageMetrics.systemNuances || [];
      } catch (err) {
        console.warn(`[Research Agent] Failed to crawl subpage ${fullUrl}:`, err);
      }
    }

    return {
      featureOverview: homepageMetrics.featureOverview,
      systemBalance: homepageMetrics.systemBalance,
      communityScale: homepageMetrics.communityScale,
      balanceFlaws,
      playerDesires,
      systemNuances,
      sourceUrl: url,
    };
  } finally {
    console.log(`[Research Agent] Cleaning up Stagehand session...`);
    await stagehand.close();
  }
}

/**
 * Uses Gemini 3.1 Flash Lite to synthesize design briefs from scraped competitor data and user project metadata.
 */
async function synthesizeDossier(
  scrapedData: ScrapedData,
  mechanicName: string,
  targetGenre: string,
  project: Project,
  competitorName: string
): Promise<CompetitorResearchDossier> {
  const systemPrompt = `You are a senior systems game designer evaluating a specific mechanic implementation concept against an existing project blueprint profile.
You are given data scraping vectors collected across a primary competitor title, the active design draft configurations, and user sentiment parameters. Generate a precise developer briefing object.

Rules:
- Ground all analytical claims strictly inside the provided web research nodes (scraped metrics). If the scraped metrics are empty, construct a general analysis based on standard knowledge of the competitor game "${competitorName}", the mechanic "${mechanicName}", and the genre "${targetGenre}".
- Frame candidate gaps as actionable design choices or balance adjustments specific to the target profile.
- Return ONLY valid JSON matching the specified schema format. Do not wrap in markdown or any other tags.`;

  const inputPrompt = `
Competitor Game: ${competitorName}
Target Mechanic: ${mechanicName}
Target Genre: ${targetGenre}

Our Project Profile:
- Title: ${project.title}
- Genre: ${project.genre}
- Target Audience: ${project.target_audience}
- Platform: ${project.platform}
- Core Player Loop: ${project.gdd_data?.playerLoop || "Not specified"}
- Core Mechanics: ${(project.gdd_data?.coreMechanics || []).join(", ") || "Not specified"}

Scraped Competitor Metrics (if any):
${JSON.stringify(scrapedData, null, 2)}

Produce a JSON response matching this schema:
{
  "competitorOverview": "Brief descriptive paragraph of how this competitor implements this mechanic and its overall reception",
  "featureBreakdown": ["List of core feature implementation details or mechanics of the competitor"],
  "communityCulture": ["Key culture notes, playstyles, or community behaviors associated with this competitor's implementation"],
  "whyExecutionFailed": "Description of where this competitor's execution fell short, was unbalanced, or caused frustration",
  "actionableDesignAdjustments": ["List of direct adjustments or modifications we should make in our implementation to exploit this gap"],
  "balancePitfalls": ["Unbalanced parameters or design traps we must avoid based on the competitor's implementation"],
  "strategicQuestions": ["Key open design questions our team must answer before coding this mechanic"],
  "sources": ["List of URLs scraped or referenced during research"]
}
`;

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + inputPrompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            competitorOverview: { type: "string" },
            featureBreakdown: { type: "array", items: { type: "string" } },
            communityCulture: { type: "array", items: { type: "string" } },
            whyExecutionFailed: { type: "string" },
            actionableDesignAdjustments: { type: "array", items: { type: "string" } },
            balancePitfalls: { type: "array", items: { type: "string" } },
            strategicQuestions: { type: "array", items: { type: "string" } },
            sources: { type: "array", items: { type: "string" } },
          },
          required: [
            "competitorOverview",
            "featureBreakdown",
            "communityCulture",
            "whyExecutionFailed",
            "actionableDesignAdjustments",
            "balancePitfalls",
            "strategicQuestions",
            "sources"
          ]
        },
        temperature: 0.3,
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    
    // Ensure sources lists the scraped URL
    if (scrapedData.sourceUrl && !result.sources.includes(scrapedData.sourceUrl)) {
      result.sources.unshift(scrapedData.sourceUrl);
    }
    
    return result;
  } catch (err) {
    console.error("[Research Agent] Synthesis failed:", err);
    // Return a safe fallback dossier
    return {
      competitorOverview: `Failed to compile full scrapings for ${competitorName}'s implementation of ${mechanicName}. Falling back to default design synthesis.`,
      featureBreakdown: [`Uses ${mechanicName} in ${targetGenre} contexts.`],
      communityCulture: ["Standard genre demographics."],
      whyExecutionFailed: "Insufficient scraping vectors collected to draw design flaw boundaries.",
      actionableDesignAdjustments: ["Perform additional manual evaluation steps on this mechanic."],
      balancePitfalls: ["Ensure core stats remain balanced against default genre rules."],
      strategicQuestions: ["What are our primary goals with this implementation?"],
      sources: scrapedData.sourceUrl ? [scrapedData.sourceUrl] : []
    };
  }
}

/**
 * Orchestrates the full competitor research loop.
 */
export async function runCompetitorResearch(
  competitorName: string,
  mechanicName: string,
  targetGenre: string,
  project: Project
): Promise<CompetitorResearchDossier> {
  let url: string | null = null;
  let scrapedData: ScrapedData = {};

  if (competitorName && competitorName.trim() !== "") {
    try {
      url = await resolveCompetitorUrl(competitorName);
    } catch (err) {
      console.error("[Research Agent] URL resolution failed:", err);
    }

    if (url) {
      try {
        scrapedData = await scrapeCompetitorPage(url);
      } catch (err) {
        console.error(`[Research Agent] Browser automation scraping failed for URL "${url}":`, err);
        // Fail gracefully and use URL as source
        scrapedData.sourceUrl = url;
      }
    } else {
      console.log(`[Research Agent] No competitor URL could be resolved for "${competitorName}". Proceeding to direct synthesis.`);
    }
  } else {
    console.log(`[Research Agent] No competitor cited. Proceeding directly to synthesis.`);
  }

  // Synthesize research using Gemini
  return await synthesizeDossier(scrapedData, mechanicName, targetGenre, project, competitorName);
}
