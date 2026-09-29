/**
 * Post-build: obfuscate ONLY the invitation's own client code.
 *
 * next.config.ts (webpack production build) places every client module from
 * src/ into a single chunk named "ic". This script finds that chunk in
 * .next/static/chunks and applies light obfuscation to it. React, Next.js and
 * framer-motion chunks are left untouched so their performance is unchanged.
 *
 * Options are chosen for low runtime/size cost: string-array concealment and
 * identifier mangling only — no control-flow flattening, dead-code injection,
 * debug protection or self-defending code. Seeded, so builds are reproducible.
 */
import fs from "node:fs/promises";
import path from "node:path";
import JavaScriptObfuscator from "javascript-obfuscator";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const chunksDir = path.join(root, ".next/static/chunks");

const OPTIONS = {
  target: "browser",
  seed: 20261212,
  compact: true,
  simplify: true,
  identifierNamesGenerator: "mangled-shuffled",
  renameGlobals: false,
  stringArray: true,
  stringArrayThreshold: 1,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayIndexShift: true,
  stringArrayEncoding: ["base64"],
  stringArrayWrappersCount: 1,
  stringArrayWrappersType: "variable",
  splitStrings: false,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  selfDefending: false,
  disableConsoleOutput: false,
  numbersToExpressions: false,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  sourceMap: false,
};

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(chunksDir);

// Never ship source maps, even if a tool emitted one.
for (const f of files.filter((f) => f.endsWith(".map"))) await fs.rm(f);

const targets = files.filter((f) => /[\\/]ic-[^\\/]*\.js$/.test(f));
if (targets.length === 0) {
  console.error("obfuscate: app chunk 'ic-*.js' not found — check next.config.ts splitChunks.");
  process.exit(1);
}

for (const file of targets) {
  const code = await fs.readFile(file, "utf8");
  const result = JavaScriptObfuscator.obfuscate(code, OPTIONS).getObfuscatedCode();
  await fs.writeFile(file, result);
  const kb = (n) => (n / 1024).toFixed(1);
  console.log(`obfuscate: ${path.relative(root, file)}  ${kb(code.length)} KB → ${kb(result.length)} KB`);
}
