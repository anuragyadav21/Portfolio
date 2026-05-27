#!/usr/bin/env node
/**
 * Compress full-size life gallery JPEGs for web deploy (in place).
 * Thumbnails: npm run life:thumbs
 *
 * macOS: uses `sips`. Max long edge 1600px, JPEG quality ~82.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "public/assets/life/paintings");
const maxEdge = 1600;
const jpegQuality = 82;
const imageExt = /\.(jpe?g)$/i;

if (!existsSync(srcDir)) {
  console.error("Missing:", srcDir);
  process.exit(1);
}

const files = readdirSync(srcDir).filter((name) => imageExt.test(name) && !name.startsWith("."));

if (files.length === 0) {
  console.log("No JPEG originals in", srcDir);
  process.exit(0);
}

let before = 0;
let after = 0;

for (const name of files) {
  const input = path.join(srcDir, name);
  const tmp = path.join(srcDir, `.compress-${name}`);
  const prev = statSync(input).size;
  before += prev;

  try {
    execFileSync(
      "sips",
      [
        "-Z",
        String(maxEdge),
        "-s",
        "format",
        "jpeg",
        "-s",
        "formatOptions",
        String(jpegQuality),
        input,
        "--out",
        tmp,
      ],
      { stdio: "pipe" },
    );
    unlinkSync(input);
    execFileSync("mv", [tmp, input], { stdio: "pipe" });
    const next = statSync(input).size;
    after += next;
    const pct = prev ? Math.round((1 - next / prev) * 100) : 0;
    console.log(`  ${name}: ${Math.round(prev / 1024)} KB → ${Math.round(next / 1024)} KB (−${pct}%)`);
  } catch (err) {
    if (existsSync(tmp)) unlinkSync(tmp);
    console.warn(`  skip ${name}:`, err.message || err);
    after += prev;
  }
}

console.log(
  `\nTotal: ${Math.round(before / 1024 / 1024)} MB → ${Math.round(after / 1024 / 1024)} MB. Re-run: npm run life:thumbs`,
);
