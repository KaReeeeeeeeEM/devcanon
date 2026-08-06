# Contributing to devcanon

## Development

Requirements: Node.js 20+ and npm 10+.

```bash
npm test
npm run check
node bin/aistd.js --help
```

Read `.ai/AGENTS.md` and the standards relevant to your change before editing. Keep the CLI dependency-free unless a dependency provides substantial, durable value.

## Changes

- Preserve safe behavior for existing repositories.
- Add tests for CLI behavior and regression fixes.
- Update `README.md`, `docs/CLI.md`, and `CHANGELOG.md` when public behavior changes.
- Follow Semantic Versioning; never rewrite an already published npm version.
- Keep commits focused and use imperative messages.

## Release Process

1. Move relevant Unreleased entries into a dated version section.
2. Run `npm test`, `npm run check`, and `npm pack --dry-run`.
3. Commit and tag `vX.Y.Z`.
4. Push the commit and tag.
5. Publish with `npm publish --access public`.
6. Create a GitHub release using the matching changelog section.
7. Verify the public package in a clean temporary directory.
