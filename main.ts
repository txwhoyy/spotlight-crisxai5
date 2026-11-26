// Spotlight @crisxai5 — make.fun entry program.
//
// The whole job of this entry is to hand the grader one file: POST.json,
// which names the public X post that carries the spotlight. The post itself
// lives on X (posted by @spidolhitam11 with the graphic attached); this
// program simply copies POST.json from the repository into the output
// directory, exactly as it was written, after a light sanity check.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// --- Locate the inputs -----------------------------------------------------

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
const postFile = join(botDir, "POST.json");

// --- Read and validate POST.json -------------------------------------------

const raw = readFileSync(postFile, "utf8");

let post: unknown;
try {
  post = JSON.parse(raw);
} catch {
  throw new Error(`POST.json is not valid JSON: ${postFile}`);
}

if (
  typeof post !== "object" ||
  post === null ||
  typeof (post as { url?: unknown }).url !== "string" ||
  (post as { url: string }).url.length === 0
) {
  throw new Error('POST.json must be an object with a non-empty string "url"');
}

// --- Copy it to the output directory ----------------------------------------

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "POST.json"), raw, "utf8");

// Success is silent: the grader reads the copied file, not our stdout.
