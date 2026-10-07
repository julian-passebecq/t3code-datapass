// One exporter owns the format and redaction policy. T3 launches the bundled local CLI,
// never a command read from an imported conversation. No shell expansion or network.
import * as NodeChildProcess from "node:child_process";
import * as NodeFS from "node:fs";
import * as NodeURL from "node:url";
import * as NodePath from "node:path";

const args = process.argv.slice(2);
const index = args.indexOf("--exporter");
const custom = index >= 0 ? args[index + 1] : undefined;
if (index >= 0) args.splice(index, 2);
const exporter = custom
  ? NodePath.resolve(custom)
  : NodeURL.fileURLToPath(
      new URL("../../datapass-agent/dist/export-conversations.cjs", import.meta.url),
    );
if (!NodeFS.existsSync(exporter) || (index >= 0 && !custom)) {
  console.error(
    "Build the DataPass Agent exporter first: npm run build in datapass-agent. Or pass --exporter <export-conversations.cjs>.",
  );
  process.exitCode = 1;
} else {
  const child = NodeChildProcess.spawn(process.execPath, [exporter, ...args], {
    stdio: "inherit",
    shell: false,
    windowsHide: true,
  });
  child.on("error", () => {
    console.error("Could not launch the local exporter.");
    process.exitCode = 1;
  });
  child.on("exit", (code) => {
    process.exitCode = code ?? 1;
  });
}
