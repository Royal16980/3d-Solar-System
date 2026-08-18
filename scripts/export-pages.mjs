import { rename, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const apiDir = path.join(root, "app/api");
const parked = path.join(root, ".api-parked");

async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: { ...process.env, STATIC_EXPORT: "1" },
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited ${code}`));
    });
  });
}

await rename(apiDir, parked);
try {
  await run("npx", ["next", "build"]);
  await writeFile(path.join(root, "out/.nojekyll"), "");
} finally {
  await rename(parked, apiDir);
}
