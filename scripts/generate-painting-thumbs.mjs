#!/usr/bin/env node
/**
 * Builds web thumbnails from full-size originals in public/assets/life/paintings/.
 * Originals stay in paintings/; thumbs go to paintings/thumbs/ (max 640px long edge).
 *
 * macOS: uses `sips`. Re-run after adding or replacing originals:
 *   node scripts/generate-painting-thumbs.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "public/assets/life/paintings");
const thumbDir = path.join(srcDir, "thumbs");
const maxEdge = 640;
const imageExt = /\.(jpe?g|png|webp)$/i;

if (!existsSync(srcDir)) {
  console.error("Missing:", srcDir);
  process.exit(1);
}

mkdirSync(thumbDir, { recursive: true });

const files = readdirSync(srcDir).filter((name) => imageExt.test(name) && !name.startsWith("."));

if (files.length === 0) {
  console.log("No images found in", srcDir);
  process.exit(0);
}

let ok = 0;
for (const name of files) {
  const input = path.join(srcDir, name);
  const output = path.join(thumbDir, name);
  try {
    execFileSync("sips", ["-Z", String(maxEdge), input, "--out", output], { stdio: "pipe" });
    const kb = Math.round(statSync(output).size / 1024);
    console.log(`  ${name} → thumbs/${name} (${kb} KB)`);
    ok += 1;
  } catch (err) {
    console.warn(`  skip ${name}:`, err.message || err);
  }
}

console.log(`\nDone: ${ok}/${files.length} thumbnails in public/assets/life/paintings/thumbs/`);
