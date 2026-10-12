import fs from "node:fs/promises";
import path from "node:path";

const imageExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".tif",
  ".tiff",
  ".webp",
]);
const knownPrefixes = ["men", "women"];

const args = process.argv.slice(2);
const apply = args.includes("--apply");

const prefixIndex = args.indexOf("--prefix");
const prefix = prefixIndex === -1 ? undefined : args[prefixIndex + 1];
const positional = args.filter(
  (arg, index) =>
    !arg.startsWith("--") && (prefixIndex === -1 || index !== prefixIndex + 1),
);
const directory = positional[0];

if (!directory || !prefix || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(prefix)) {
  console.error(
    "Usage: node scripts/rename-images.js <folder> --prefix <men|women|...> [--apply]",
  );
  process.exit(1);
}

const renameImages = async () => {
  const folder = path.resolve(directory);
  const entries = await fs.readdir(folder, { withFileTypes: true });
  const names = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        !entry.name.startsWith(".") &&
        imageExtensions.has(path.extname(entry.name).toLowerCase()),
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const knownPattern = new RegExp(
    `^(${[...new Set([...knownPrefixes, prefix])].join("|")})-(\\d+)$`,
  );
  const takenNumbers = new Set();
  const pending = [];

  for (const name of names) {
    const match = knownPattern.exec(path.basename(name, path.extname(name)));
    if (!match) pending.push(name);
    else if (match[1] === prefix) takenNumbers.add(Number(match[2]));
  }

  if (pending.length === 0) {
    console.log("Nothing to rename.");
    return;
  }

  let next = 1;
  const plan = pending.map((oldName) => {
    while (takenNumbers.has(next)) next += 1;
    takenNumbers.add(next);
    const newName = `${prefix}-${String(next).padStart(2, "0")}${path.extname(oldName).toLowerCase()}`;
    return { oldName, newName };
  });

  for (const { oldName, newName } of plan) {
    console.log(`${newName}  <-  ${oldName}`);
  }

  if (!apply) {
    console.log(
      `\nDry run: ${plan.length} file(s) would be renamed. Re-run with --apply to do it.`,
    );
    return;
  }

  for (const { oldName, newName } of plan) {
    await fs.rename(path.join(folder, oldName), path.join(folder, newName));
  }

  const logPath = path.join(folder, "rename-log.json");
  let log = {};
  try {
    log = JSON.parse(await fs.readFile(logPath, "utf8"));
  } catch {
    // first run: no log yet
  }
  for (const { oldName, newName } of plan) log[newName] = oldName;
  await fs.writeFile(logPath, `${JSON.stringify(log, null, 2)}\n`);

  console.log(
    `\nRenamed ${plan.length} file(s). Mapping saved in ${path.basename(logPath)}.`,
  );
};

renameImages().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
