import { WS_METHODS } from "@t3tools/contracts";
import type { Atom } from "effect/reactivity";

import type { EnvironmentRegistry } from "../connection/registry.ts";
import { createAtomCommandScheduler, createEnvironmentRpcCommand } from "./runtime.ts";

/**
 * Mosaic authoring calls. Inspections are commands rather than cached queries:
 * a build changes the result, and the panel re-reads it on demand.
 */
export function createMosaicEnvironmentAtoms<R, E>(
  runtime: Atom.AtomRuntime<EnvironmentRegistry | R, E>,
) {
  const buildScheduler = createAtomCommandScheduler();
  return {
    inspect: createEnvironmentRpcCommand(runtime, {
      label: "environment-data:mosaic:inspect",
      tag: WS_METHODS.mosaicInspect,
    }),
    inspectClient: createEnvironmentRpcCommand(runtime, {
      label: "environment-data:mosaic:inspect-client",
      tag: WS_METHODS.mosaicInspectClient,
    }),
    build: createEnvironmentRpcCommand(runtime, {
      label: "environment-data:mosaic:build",
      tag: WS_METHODS.mosaicBuild,
      scheduler: buildScheduler,
      concurrency: {
        mode: "serial" as const,
        key: ({ environmentId, input }: { environmentId: string; input: { cwd: string } }) =>
          JSON.stringify([environmentId, input.cwd]),
      },
    }),
    openPreview: createEnvironmentRpcCommand(runtime, {
      label: "environment-data:mosaic:open-preview",
      tag: WS_METHODS.mosaicOpenPreview,
    }),
    compare: createEnvironmentRpcCommand(runtime, {
      label: "environment-data:mosaic:compare",
      tag: WS_METHODS.mosaicCompare,
    }),
  };
}
