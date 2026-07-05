import { discoverRealCommunityThreads } from "../agent/aggregator.js";

async function main() {
  console.log("Testing aggregator directly...");
  try {
    const res = await discoverRealCommunityThreads("deckbuilding", "Strategy");
    console.log("Result:", JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("Crashed with error:", e);
  }
}

main();
