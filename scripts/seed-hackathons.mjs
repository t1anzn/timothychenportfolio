// Adds the hackathons that were first hardcoded on the site to Sanity. Safe to re-run
// (deterministic IDs, createOrReplace).
//
// Usage: node --env-file=.env.local scripts/seed-hackathons.mjs
// Requires SANITY_WRITE_TOKEN in .env.local.

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const entries = [
  { title: "HackSprint '25" },
  { title: "MeetStream.ai Voice Agents", placement: "3rd" },
  { title: "Perplexity London" },
  { title: "NVIDIA Hack for Impact" },
  { title: "Grok Bot Community Engineering", placement: "Top 5" },
];

// Created a second apart so the list keeps this order.
const start = Date.now() - entries.length * 1000;
for (const [i, entry] of entries.entries()) {
  await client.createOrReplace({
    _id: `hackathon-${i + 1}`,
    _type: "hackathon",
    _createdAt: new Date(start + i * 1000).toISOString(),
    ...entry,
  });
}
console.log(`Seeded ${entries.length} hackathons.`);
