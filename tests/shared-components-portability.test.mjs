import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("content validation carries its duplicate-exemption contract with the site source", () => {
  const localPath = new URL("../research/shared-components.json", import.meta.url);
  const local = JSON.parse(readFileSync(localPath, "utf8"));

  assert.equal(local.schema_version, "shared-components.v1");
  assert.ok(local.components.length > 0);
  assert.deepEqual(local.undeclared_duplicates, []);

  const parentPath = new URL("../../research/shared-components.json", import.meta.url);
  if (existsSync(parentPath)) {
    assert.deepEqual(local, JSON.parse(readFileSync(parentPath, "utf8")));
  }
});
