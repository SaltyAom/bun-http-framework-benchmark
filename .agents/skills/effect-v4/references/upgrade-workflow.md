# Bumping the Effect v4 beta

Advance package pins and the source oracle as one reviewed unit.

## 1. Resolve a published version

Query the registry; do not infer the latest beta from GitHub `main`:

```sh
npm view effect@beta version
npm view @effect/platform-bun@beta version
npm view @effect/platform-node@beta version
```

Stop if the three packages do not have a matching published beta.

## 2. Update exact pins together

Update these `package.json` dependencies to the same exact version:

- `effect`
- `@effect/platform-bun`
- `@effect/platform-node`

Do not use a range or the floating `beta` dist-tag. Regenerate the lockfile with the
package manager chosen for the change; do not hand-edit a binary lockfile. Inspect the
lockfile diff for unrelated dependency churn.

## 3. Advance the source oracle

Fetch tags and check out the release tag matching the package version:

```sh
git -C repos/effect fetch --tags
git -C repos/effect checkout "effect@<version>"
git -C repos/effect rev-parse HEAD
git -C repos/effect tag --points-at HEAD
git add repos/effect
```

Confirm the three package manifests inside the submodule report the same version:

```text
repos/effect/packages/effect/package.json
repos/effect/packages/platform-bun/package.json
repos/effect/packages/platform-node/package.json
```

Update `versions.json` with the version, release tag, and peeled commit. The gitlink
and npm pins are independent facts; verify both.

## 4. Check migration notes and behavior

Read release notes between the old and new betas. Search
`repos/effect/migration/` and the exact source for every affected unstable HTTP API.
Then run:

```sh
bun scripts/build-framework.ts bun/effect
bun scripts/build-framework.ts node/effect
bun run verify
```

Treat changed routing, request parsing, response streaming, logging, startup, or
runtime teardown as benchmark-significant even if typechecking stays green.

## Stop conditions

Pause instead of reaching for a compatibility workaround when:

- a matching platform beta or release tag does not exist;
- the needed behavior is only on unreleased `main`;
- Bun and Node adapters require different externally observable route behavior;
- the verifier regresses because of the beta rather than a local implementation bug.
