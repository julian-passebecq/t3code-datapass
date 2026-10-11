// Checks that every GitHub Actions job inherited from upstream is skipped in this fork,
// and that inherited workflows never queue fork runs behind a shared concurrency group.
//
// Upstream workflows release, deploy, publish, and run on Blacksmith runners this fork
// cannot use. Each of their jobs must start its `if:` with UPSTREAM_GUARD so it skips
// here; only the workflows in FORK_WORKFLOWS run in the fork. Fork CI runs it with
// `node scripts/fork-workflow-guards.ts` (no dependencies).
import * as FS from "node:fs";
import * as Path from "node:path";

export const UPSTREAM_GUARD = "github.repository == 'pingdotgg/t3code'";
export const FORK_WORKFLOWS: ReadonlySet<string> = new Set(["fork-ci.yml"]);

export interface WorkflowJob {
  readonly id: string;
  readonly line: number;
  /** The job's `if:` expression with any `${{ }}` wrapper removed, or undefined. */
  readonly condition: string | undefined;
}

const JOB_KEY = /^ {2}([A-Za-z0-9_-]+):\s*(?:#.*)?$/;
const IF_KEY = /^ {4}if:\s*(.*)$/;

const unwrapExpression = (value: string) => {
  const trimmed = value.trim();
  const match = /^\$\{\{([\s\S]*)\}\}$/.exec(trimmed);
  return (match ? match[1]! : trimmed).trim();
};

/** Lists the jobs of a workflow file. Expects the repo's two-space indentation. */
export function listWorkflowJobs(text: string): WorkflowJob[] {
  const lines = text.split(/\r?\n/);
  const jobsStart = lines.findIndex((line) => /^jobs:\s*$/.test(line));
  if (jobsStart === -1) return [];

  const jobs: WorkflowJob[] = [];
  let index = jobsStart + 1;
  while (index < lines.length) {
    const line = lines[index]!;
    if (/^\S/.test(line)) break;
    const key = JOB_KEY.exec(line);
    if (!key) {
      index += 1;
      continue;
    }
    let end = index + 1;
    while (end < lines.length && !JOB_KEY.test(lines[end]!) && !/^\S/.test(lines[end]!)) end += 1;

    let condition: string | undefined;
    for (let cursor = index + 1; cursor < end; cursor += 1) {
      const ifMatch = IF_KEY.exec(lines[cursor]!);
      if (!ifMatch) continue;
      const inline = ifMatch[1]!.replace(/\s+#.*$/, "");
      if (/^[|>][-+]?$/.test(inline.trim())) {
        const block: string[] = [];
        for (let next = cursor + 1; next < end && /^ {6,}\S/.test(lines[next]!); next += 1) {
          block.push(lines[next]!.trim());
        }
        condition = unwrapExpression(block.join(" "));
      } else {
        condition = unwrapExpression(inline);
      }
      break;
    }
    jobs.push({ id: key[1]!, line: index + 1, condition });
    index = end;
  }
  return jobs;
}

/**
 * A workflow-level concurrency group is resolved before any job `if:`, so a shared
 * group (or `queue: max`) makes fork runs wait forever behind a run that can never
 * start. Inherited groups must give each fork run its own group with this prefix.
 */
export const FORK_CONCURRENCY_PREFIX =
  "${{ github.repository != 'pingdotgg/t3code' && format('fork-{0}', github.run_id) || ";

/** The top-level `concurrency.group` of a workflow, or undefined when it has none. */
export function workflowConcurrencyGroup(text: string): string | undefined {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^concurrency:\s*$/.test(line));
  if (start === -1) {
    const inline = lines.find((line) => /^concurrency:\s*\S/.test(line));
    return inline?.replace(/^concurrency:\s*/, "").trim();
  }
  for (let index = start + 1; index < lines.length && !/^\S/.test(lines[index]!); index += 1) {
    const group = /^ {2}group:\s*(.+?)\s*$/.exec(lines[index]!);
    if (group) return group[1];
  }
  return undefined;
}

export const isUpstreamGuarded = (condition: string | undefined) =>
  condition !== undefined &&
  (condition === UPSTREAM_GUARD || condition.startsWith(`${UPSTREAM_GUARD} &&`));

/** Returns "file:line job" for every inherited job that would run in the fork. */
export function findUnguardedJobs(workflowsDir: string): string[] {
  const problems: string[] = [];
  const files = FS.readdirSync(workflowsDir)
    .filter((file) => /\.ya?ml$/.test(file) && !FORK_WORKFLOWS.has(file))
    .sort();
  for (const file of files) {
    const text = FS.readFileSync(Path.join(workflowsDir, file), "utf8");
    const group = workflowConcurrencyGroup(text);
    if (group !== undefined && !group.startsWith(FORK_CONCURRENCY_PREFIX)) {
      problems.push(`${file}: concurrency group must start with ${FORK_CONCURRENCY_PREFIX}`);
    }
    const jobs = listWorkflowJobs(text);
    if (jobs.length === 0) problems.push(`${file}: no jobs found (unexpected layout)`);
    for (const job of jobs) {
      if (!isUpstreamGuarded(job.condition)) {
        problems.push(`${file}:${job.line} ${job.id} lacks \`if: ${UPSTREAM_GUARD}\``);
      }
    }
  }
  return problems;
}

if (import.meta.main) {
  const workflowsDir = Path.resolve(import.meta.dirname, "..", ".github", "workflows");
  const problems = findUnguardedJobs(workflowsDir);
  if (problems.length > 0) {
    console.error(
      `Upstream jobs must skip in this fork. Start each job's if: with ${UPSTREAM_GUARD}\n` +
        `(or add the workflow to FORK_WORKFLOWS in scripts/fork-workflow-guards.ts):`,
    );
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
  }
  console.log("All inherited workflow jobs are guarded to pingdotgg/t3code.");
}
