import * as Path from "node:path";

import { describe, expect, it } from "vite-plus/test";

import {
  findUnguardedJobs,
  FORK_CONCURRENCY_PREFIX,
  isUpstreamGuarded,
  listWorkflowJobs,
  workflowConcurrencyGroup,
} from "./fork-workflow-guards.ts";

const workflow = `name: Sample
on: push
jobs:
  plain:
    name: Plain
    runs-on: ubuntu-24.04
  inline:
    if: \${{ github.repository == 'pingdotgg/t3code' && (!cancelled()) }}
    runs-on: ubuntu-24.04
  block:
    if: >-
      github.repository == 'pingdotgg/t3code' && (
      github.event_name == 'push')
    # a comment after the condition
    runs-on: ubuntu-24.04
  other_repo:
    if: github.repository == 'someone/else'
    steps:
      - if: github.repository == 'pingdotgg/t3code'
        run: echo nested steps do not count
`;

describe("listWorkflowJobs", () => {
  it("reads inline and block job conditions, ignoring step conditions", () => {
    const jobs = listWorkflowJobs(workflow);
    expect(jobs.map((job) => [job.id, isUpstreamGuarded(job.condition)])).toEqual([
      ["plain", false],
      ["inline", true],
      ["block", true],
      ["other_repo", false],
    ]);
  });
});

describe("workflowConcurrencyGroup", () => {
  it("reads the top-level group, not a job's", () => {
    const text = `on: push\nconcurrency:\n  group: relay-production\n  cancel-in-progress: false\njobs:\n  a:\n    concurrency:\n      group: job-level\n`;
    expect(workflowConcurrencyGroup(text)).toBe("relay-production");
    expect(workflowConcurrencyGroup("on: push\njobs:\n  a:\n    runs-on: x\n")).toBeUndefined();
    expect(
      workflowConcurrencyGroup(`concurrency:\n  group: ${FORK_CONCURRENCY_PREFIX}'x' }}\n`),
    ).toBe(`${FORK_CONCURRENCY_PREFIX}'x' }}`);
  });
});

describe("repository workflows", () => {
  it("guard every inherited upstream job to pingdotgg/t3code", () => {
    const workflowsDir = Path.resolve(import.meta.dirname, "..", ".github", "workflows");
    expect(findUnguardedJobs(workflowsDir)).toEqual([]);
  });
});
