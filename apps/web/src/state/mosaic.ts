import { createMosaicEnvironmentAtoms } from "@t3tools/client-runtime/state/mosaic";

import { connectionAtomRuntime } from "../connection/runtime";

export const mosaicEnvironment = createMosaicEnvironmentAtoms(connectionAtomRuntime);
