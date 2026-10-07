import * as NodeChildProcess from "node:child_process";
import * as NodeFS from "node:fs";
import * as NodeURL from "node:url";
import * as NodePath from "node:path";

const args = process.argv.slice(2),
  index = args.indexOf("--searcher");
const custom = index >= 0 ? args[index + 1] : undefined;
if (index >= 0) args.splice(index, 2);
const searcher = custom
  ? NodePath.resolve(custom)
  : NodeURL.fileURLToPath(
      new URL("../../datapass-agent/dist/search-knowledge.cjs", import.meta.url),
    );
if (!NodeFS.existsSync(searcher) || (index >= 0 && !custom)) {
  console.error(
    "Build the DataPass Agent query tool first, or pass --searcher <search-knowledge.cjs>.",
  );
  process.exitCode = 1;
} else {
  const child = NodeChildProcess.spawn(process.execPath, [searcher, ...args], {
    stdio: "inherit",
    shell: false,
    windowsHide: true,
  });
  child.on("error", () => {
    console.error("Could not launch local search.");
    process.exitCode = 1;
  });
  child.on("exit", (code) => {
    process.exitCode = code ?? 1;
  });
}
