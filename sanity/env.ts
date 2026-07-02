// Next.js inlines NEXT_PUBLIC_* vars for the main site build; the standalone
// Sanity Studio build (via the `sanity` CLI, which uses Vite) only inlines
// SANITY_STUDIO_* vars. Both are set in .env.local so either build works.

export const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  "2024-01-01";

export const dataset = assertValue(
  process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: SANITY_STUDIO_DATASET / NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: SANITY_STUDIO_PROJECT_ID / NEXT_PUBLIC_SANITY_PROJECT_ID"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
