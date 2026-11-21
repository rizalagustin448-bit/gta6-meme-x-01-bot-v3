// Entry point for the GTA 6 meme v3 entry: it hands the harness the two
// things the judge reads — the X post record in POST.json and the meme
// picture in meme.png — by copying both into the run's output directory.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const postPath = join(repoRoot, "POST.json");
const postRaw = readFileSync(postPath, "utf8");
const post = JSON.parse(postRaw) as { post_url?: string };
if (typeof post.post_url !== "string" || post.post_url.length === 0) {
  throw new Error("POST.json must carry a non-empty post_url string");
}

const picturePath = join(repoRoot, "meme.png");
if (!existsSync(picturePath)) {
  throw new Error("meme.png is missing from the repository root");
}
const pictureHead = readFileSync(picturePath).subarray(0, 8);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!pictureHead.equals(pngMagic)) {
  throw new Error("meme.png is not a PNG picture");
}

copyFileSync(postPath, join(outDir, "POST.json"));
copyFileSync(picturePath, join(outDir, "meme.png"));
console.log(`meme v3 ready: ${post.post_url} -> ${outDir}`);
