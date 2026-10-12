import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const sourceDirectory = path.join(projectRoot, "images-src");
const outputDirectory = path.join(projectRoot, "public", "images");

const MAX_WIDTH = 1200;
const WEBP_OPTIONS = { quality: 75, effort: 6 };

const supportedExtensions = new Set([
  ".avif",
  ".jpeg",
  ".jpg",
  ".png",
  ".tif",
  ".tiff",
  ".webp",
]);

const skippedExtensions = new Set([".gif", ".svg"]);

const force = process.argv.includes("--force");

const formatKb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const isUpToDate = async (sourcePath, outputPath) => {
  try {
    const [source, output] = await Promise.all([
      fs.stat(sourcePath),
      fs.stat(outputPath),
    ]);
    return output.mtimeMs >= source.mtimeMs;
  } catch {
    return false;
  }
};

const convertImages = async () => {
  await fs.mkdir(sourceDirectory, { recursive: true });
  await fs.mkdir(outputDirectory, { recursive: true });

  const entries = await fs.readdir(sourceDirectory, { withFileTypes: true });
  const sources = new Map();

  for (const entry of entries) {
    if (!entry.isFile() || entry.name.startsWith(".")) continue;

    const originalExtension = path.extname(entry.name);
    const extension = originalExtension.toLowerCase();
    const basename = path.basename(entry.name, originalExtension);

    if (skippedExtensions.has(extension)) {
      console.log(
        `Skipped ${entry.name} (${extension} is kept as is: put it directly in public/images)`,
      );
      continue;
    }
    if (!supportedExtensions.has(extension)) continue;

    if (sources.has(basename)) {
      console.warn(
        `Skipped ${entry.name}: "${basename}" already comes from ${path.basename(sources.get(basename))}`,
      );
      continue;
    }
    sources.set(basename, path.join(sourceDirectory, entry.name));
  }

  if (sources.size === 0) {
    console.log(
      `No images found in ${path.relative(projectRoot, sourceDirectory)}/`,
    );
    return;
  }

  let failures = 0;

  for (const [basename, sourcePath] of sources) {
    const outputPath = path.join(outputDirectory, `${basename}.webp`);
    const temporaryPath = path.join(outputDirectory, `.${basename}.tmp.webp`);

    if (!force && (await isUpToDate(sourcePath, outputPath))) {
      console.log(`Up to date ${basename}.webp`);
      continue;
    }

    try {
      await sharp(sourcePath)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp(WEBP_OPTIONS)
        .toFile(temporaryPath);
      await fs.rename(temporaryPath, outputPath);

      const [before, after] = await Promise.all([
        fs.stat(sourcePath),
        fs.stat(outputPath),
      ]);
      console.log(
        `Optimized ${path.basename(sourcePath)} -> ${basename}.webp (${formatKb(before.size)} -> ${formatKb(after.size)})`,
      );
    } catch (error) {
      failures += 1;
      await fs.rm(temporaryPath, { force: true });
      console.error(`Failed ${path.basename(sourcePath)}: ${error.message}`);
    }
  }

  if (failures > 0) process.exitCode = 1;
};

convertImages().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
