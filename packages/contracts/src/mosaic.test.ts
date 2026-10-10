import * as Exit from "effect/Exit";
import { describe, expect, it } from "vite-plus/test";

import { decodeMosaicPreviewDescriptor } from "./mosaic.ts";
// A synthetic datapass.preview/1 document in the producer's shape (hashes are not of real files).
import previewFixture from "./testdata/datapass-preview-v1.json" with { type: "json" };

const fixtureText = JSON.stringify(previewFixture);
const fixture = () => JSON.parse(fixtureText);

const decode = (document: unknown) => decodeMosaicPreviewDescriptor(JSON.stringify(document));
const rejected = (document: unknown) => {
  const exit = decode(document);
  return Exit.isFailure(exit) ? String(exit.cause) : null;
};

describe("datapass.preview/1", () => {
  it("decodes the producer's document", () => {
    const exit = decodeMosaicPreviewDescriptor(fixtureText);
    expect(Exit.isSuccess(exit) && exit.value.app.id).toBe("motion-reference");
    const uncommitted = { ...fixture(), sourceCommit: null };
    delete uncommitted.$schema;
    expect(Exit.isSuccess(decode(uncommitted))).toBe(true);
  });

  it("rejects unknown fields at any depth", () => {
    expect(rejected({ ...fixture(), deployTo: "somewhere" })).not.toBeNull();
    const nested = fixture();
    nested.files[0].mode = "0755";
    expect(rejected(nested)).not.toBeNull();
  });

  it("rejects paths that leave the folder or are not POSIX-relative", () => {
    for (const path of ["../x", "a/../b", "/abs", "C:\\x", "a//b", "./a", ""]) {
      const forged = fixture();
      forged.files[2].path = path;
      forged.entry = path;
      expect(rejected(forged), path).not.toBeNull();
    }
  });

  it("rejects an entry or artifact that does not match the file list", () => {
    expect(rejected({ ...fixture(), entry: "missing.html" })).toContain("not listed in files");

    const mismatched = fixture();
    mismatched.artifacts[0].sha256 = "0".repeat(64);
    expect(rejected(mismatched)).toContain("differs from the files entry");

    const duplicated = fixture();
    duplicated.files.push({ ...duplicated.files[0] });
    expect(rejected(duplicated)).toContain("duplicate path");

    const sameId = fixture();
    sameId.artifacts.push({ ...sameId.artifacts[0] });
    expect(rejected(sameId)).toContain("duplicate artifact id");
  });

  it("enforces formats and bounds", () => {
    expect(rejected({ ...fixture(), version: 2 })).not.toBeNull();
    expect(rejected({ ...fixture(), sourceCommit: "abc123" })).not.toBeNull();
    expect(rejected({ ...fixture(), capabilities: ["motion", "motion"] })).not.toBeNull();
    expect(rejected({ ...fixture(), files: [] })).not.toBeNull();
    const badHash = fixture();
    badHash.files[1].sha256 = "F".repeat(64);
    expect(rejected(badHash)).not.toBeNull();
    const negative = fixture();
    negative.files[1].bytes = -1;
    expect(rejected(negative)).not.toBeNull();
  });
});
