import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "data", "exercises.json"), "utf-8"));
const BASE = "https://static.exercisedb.dev/media";

const IMG_DIR = path.join(ROOT, "public", "exercises", "img");
const GIF_DIR = path.join(ROOT, "public", "exercises", "gif");

const ids = [...new Set(DATA.map(e => e.media_id).filter(Boolean))];
console.log(`Total unique media_ids: ${ids.length}`);
console.log(`Total files to download: ${ids.length * 2} (JPG + GIF each)\n`);

let downloaded = 0;
let skipped = 0;
let failed = 0;
const CONCURRENCY = 10;
const TOTAL = ids.length * 2;

async function downloadFile(id, ext, dir) {
  const filename = `${id}.${ext}`;
  const filepath = path.join(dir, filename);
  if (fs.existsSync(filepath)) {
    skipped++;
    return "skip";
  }
  const url = `${BASE}/${id}.${ext}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buf);
    downloaded++;
    return "ok";
  } catch (e) {
    failed++;
    return "fail";
  }
}

async function run() {
  const queue = [];
  for (const id of ids) {
    queue.push({ id, ext: "jpg", dir: IMG_DIR });
    queue.push({ id, ext: "gif", dir: GIF_DIR });
  }

  let i = 0;
  async function worker() {
    while (i < queue.length) {
      const idx = i++;
      const { id, ext, dir } = queue[idx];
      const result = await downloadFile(id, ext, dir);
      const done = downloaded + skipped + failed;
      const pct = ((done / TOTAL) * 100).toFixed(1);
      const status = result === "skip" ? "SKIP" : result === "fail" ? "FAIL" : " OK ";
      process.stdout.write(`\r[${status}] ${done}/${TOTAL} (${pct}%)  ${id}.${ext}` + " ".repeat(20));
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log(`\n\nDone!`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Skipped:    ${skipped} (already exists)`);
  console.log(`  Failed:     ${failed}`);
}

run().catch(console.error);
