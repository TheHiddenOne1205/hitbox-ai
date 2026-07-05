#!/usr/bin/env node
/**
 * setup-db.mjs
 * Provisions InsForge DB tables, RLS policies, and storage bucket
 * via the @insforge/mcp CLI using the correct JSON-RPC 2.0 stdio protocol.
 *
 * Run: node scripts/setup-db.mjs
 */

import { spawn } from "child_process";

const API_KEY = "ik_ac331315f2bad0c72ba9bb10d4f68559";
const BASE_URL = "https://r3krqy29.ap-southeast.insforge.app";

/**
 * Send a single MCP tool call through a fresh stdio process.
 * Handles the full MCP handshake: initialize → initialized → tools/call
 */
function callMCPTool(toolName, params) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "npx",
      ["-y", "@insforge/mcp@latest", "--api_key", API_KEY, "--api_base_url", BASE_URL],
      { stdio: ["pipe", "pipe", "pipe"] }
    );

    let buffer = "";
    let toolCallId = 2;
    let initialized = false;
    let resolved = false;

    proc.stdout.on("data", (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep incomplete last line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        let msg;
        try {
          msg = JSON.parse(trimmed);
        } catch {
          continue;
        }

        // After initialize response, send the 'initialized' notification
        if (msg.id === 1 && msg.result && !initialized) {
          initialized = true;
          const notification = JSON.stringify({
            jsonrpc: "2.0",
            method: "notifications/initialized",
            params: {},
          });
          proc.stdin.write(notification + "\n");

          // Now send the actual tool call
          const toolCall = JSON.stringify({
            jsonrpc: "2.0",
            id: toolCallId,
            method: "tools/call",
            params: { name: toolName, arguments: params },
          });
          proc.stdin.write(toolCall + "\n");
        }

        // Tool call response
        if (msg.id === toolCallId && !resolved) {
          resolved = true;
          proc.stdin.end();
          if (msg.error) {
            reject(new Error(JSON.stringify(msg.error)));
          } else {
            resolve(msg.result);
          }
        }
      }
    });

    proc.stderr.on("data", () => {}); // suppress stderr noise

    proc.on("close", (code) => {
      if (!resolved) {
        reject(new Error(`Process exited with code ${code} before response. Buffer: ${buffer.slice(0, 300)}`));
      }
    });

    // Step 1: Send initialize
    const initMsg = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: { roots: { listChanged: false }, sampling: {} },
        clientInfo: { name: "hitbox-setup", version: "1.0.0" },
      },
    });
    proc.stdin.write(initMsg + "\n");
  });
}

async function runSQL(label, sql) {
  process.stdout.write(`▶ ${label}... `);
  try {
    const result = await callMCPTool("run-raw-sql", { query: sql });
    const text = result?.content?.[0]?.text ?? JSON.stringify(result);
    // A successful DDL typically returns empty or a status message
    console.log(`✓`);
    if (text && text.length > 2) process.stdout.write(`  → ${text.slice(0, 120)}\n`);
    return true;
  } catch (e) {
    const msg = e.message ?? String(e);
    // "already exists" from IF NOT EXISTS is still success
    if (msg.includes("already exists")) {
      console.log(`✓ (already exists)`);
      return true;
    }
    console.log(`✗ FAILED`);
    console.log(`  ${msg.slice(0, 400)}`);
    return false;
  }
}

async function createBucket(name) {
  process.stdout.write(`▶ Create storage bucket '${name}' (private)... `);
  try {
    const result = await callMCPTool("create-bucket", { bucketName: name, isPublic: false });
    const text = result?.content?.[0]?.text ?? JSON.stringify(result);
    console.log(`✓`);
    if (text && text.length > 2) process.stdout.write(`  → ${text.slice(0, 120)}\n`);
    return true;
  } catch (e) {
    const msg = e.message ?? String(e);
    if (msg.toLowerCase().includes("already exist")) {
      console.log(`✓ (already exists)`);
      return true;
    }
    console.log(`✗ FAILED`);
    console.log(`  ${msg.slice(0, 400)}`);
    return false;
  }
}

// ─── SQL Steps ───────────────────────────────────────────────────────────────

const steps = [
  {
    label: "Create projects table",
    sql: `CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  genre text NOT NULL DEFAULT '',
  art_style text NOT NULL DEFAULT '',
  platform text NOT NULL DEFAULT '',
  target_audience text NOT NULL DEFAULT '',
  keywords text[] NOT NULL DEFAULT '{}',
  gdd_data jsonb NOT NULL DEFAULT '{}',
  pitch_deck_url text,
  is_complete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);`,
  },
  {
    label: "Create agent_runs table",
    sql: `CREATE TABLE IF NOT EXISTS agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  mechanic_searched text NOT NULL,
  genre_baseline text NOT NULL,
  insights_found integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);`,
  },
  {
    label: "Create mechanics table",
    sql: `CREATE TABLE IF NOT EXISTS mechanics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('search', 'manual')),
  source_url text NOT NULL DEFAULT '',
  mechanic_name text NOT NULL,
  target_genre text NOT NULL DEFAULT '',
  qualitative_meta text NOT NULL DEFAULT '',
  community_upvotes integer NOT NULL DEFAULT 0,
  core_player_gripe text[] NOT NULL DEFAULT '{}',
  core_player_desires text[] NOT NULL DEFAULT '{}',
  cited_competitors text[] NOT NULL DEFAULT '{}',
  viability_score integer NOT NULL DEFAULT 0 CHECK (viability_score >= 0 AND viability_score <= 100),
  sentiment_reason text NOT NULL DEFAULT '',
  structural_pitfalls text[] NOT NULL DEFAULT '{}',
  aligned_features text[] NOT NULL DEFAULT '{}',
  competitor_research jsonb,
  found_at timestamptz NOT NULL DEFAULT now()
);`,
  },
  {
    label: "Create agent_logs table",
    sql: `CREATE TABLE IF NOT EXISTS agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  message text NOT NULL,
  level text NOT NULL CHECK (level IN ('info', 'success', 'warning', 'error')),
  mechanic_id uuid REFERENCES mechanics(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);`,
  },
  {
    label: "Enable RLS on all tables",
    sql: `ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mechanics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;`,
  },
  {
    label: "RLS — projects",
    sql: `DROP POLICY IF EXISTS "projects_select" ON projects;
DROP POLICY IF EXISTS "projects_insert" ON projects;
DROP POLICY IF EXISTS "projects_update" ON projects;
DROP POLICY IF EXISTS "projects_delete" ON projects;
CREATE POLICY "projects_select" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "projects_insert" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "projects_delete" ON projects FOR DELETE USING (auth.uid() = user_id);`,
  },
  {
    label: "RLS — agent_runs",
    sql: `DROP POLICY IF EXISTS "agent_runs_select" ON agent_runs;
DROP POLICY IF EXISTS "agent_runs_insert" ON agent_runs;
DROP POLICY IF EXISTS "agent_runs_update" ON agent_runs;
DROP POLICY IF EXISTS "agent_runs_delete" ON agent_runs;
CREATE POLICY "agent_runs_select" ON agent_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "agent_runs_insert" ON agent_runs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "agent_runs_update" ON agent_runs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "agent_runs_delete" ON agent_runs FOR DELETE USING (auth.uid() = user_id);`,
  },
  {
    label: "RLS — mechanics",
    sql: `DROP POLICY IF EXISTS "mechanics_select" ON mechanics;
DROP POLICY IF EXISTS "mechanics_insert" ON mechanics;
DROP POLICY IF EXISTS "mechanics_update" ON mechanics;
DROP POLICY IF EXISTS "mechanics_delete" ON mechanics;
CREATE POLICY "mechanics_select" ON mechanics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "mechanics_insert" ON mechanics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mechanics_update" ON mechanics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "mechanics_delete" ON mechanics FOR DELETE USING (auth.uid() = user_id);`,
  },
  {
    label: "RLS — agent_logs",
    sql: `DROP POLICY IF EXISTS "agent_logs_select" ON agent_logs;
DROP POLICY IF EXISTS "agent_logs_insert" ON agent_logs;
DROP POLICY IF EXISTS "agent_logs_update" ON agent_logs;
DROP POLICY IF EXISTS "agent_logs_delete" ON agent_logs;
CREATE POLICY "agent_logs_select" ON agent_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "agent_logs_insert" ON agent_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "agent_logs_update" ON agent_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "agent_logs_delete" ON agent_logs FOR DELETE USING (auth.uid() = user_id);`,
  },
];

// ─── Run ─────────────────────────────────────────────────────────────────────

console.log("🚀 Hitbox AI — Database Schema Setup");
console.log("=====================================\n");

let allPassed = true;
for (const step of steps) {
  const ok = await runSQL(step.label, step.sql);
  if (!ok) {
    allPassed = false;
    // Don't cascade - try subsequent steps anyway (RLS can't work without tables)
  }
}

const bucketOk = await createBucket("drafts");
if (!bucketOk) allPassed = false;

console.log("");
if (allPassed) {
  console.log("✅ All tables, RLS policies, and storage bucket are provisioned.");
} else {
  console.log("⚠️  Some steps failed — review output above.");
  process.exit(1);
}
