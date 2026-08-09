# Changelog

All notable changes to devcanon are recorded here. Releases follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [2.2.0] - 2026-08-09

### Added

- Optional guided product setup during `init`, with a clear skip path for users who do not want to choose a stack.
- Simple, project-aware questions for web, mobile, API, desktop, and other products.
- Portable `dcp1_` product codes for sharing the same setup between the CLI, web app, and Devcanon Studio.
- Generated `.ai/product.md`, `.ai/product.json`, and `.ai/prompts/build-product.md` files that give an AI agent the product context and an end-to-end build request.
- Project-specific prompt templates for web, mobile, API, desktop, and general products.

## [2.1.1] - 2026-08-06

### Changed

- Added the Devcanon mark and product identity to the local Studio sidebar.
- Rendered standards navigation with safe DOM nodes instead of HTML injection.
- Preserved the local handbook editor and non-destructive update workflow.

## [2.1.0] - 2026-08-06

### Added

- Portable, offline `dc1_` preset codes and `init --preset <code>` support.
- `configure` command with interactive standards-file selection and direct `--file` mode.
- `studio` command providing a localhost-only visual Markdown editor and safe update button.
- Project-specific `.ai/preset.md` profiles with explicit precedence and safety boundaries.

## [2.0.0] - 2026-08-06

### Changed

- Changed future releases from MIT to the source-available PolyForm Shield 1.0.0 license. Earlier MIT releases retain their original terms.
- Expanded contribution rules with required issues, forks, pull requests, code-owner review, CI, and contributor IP declarations.
- Moved website planning into a separate website repository.

### Added

- GitHub CODEOWNERS, pull-request template, feature-proposal template, and CI workflow.
- Enforceable documentation-page design standards, including required review of the Reelma Pay reference whenever it is accessible.

## [1.1.1] - 2026-08-06

### Fixed

- Refuse installation into the filesystem root before creating or listing files.
- Translate filesystem failures into clear, actionable guidance instead of exposing raw Node.js errors.

### Added

- Startup warning when interactive mode is launched from the filesystem root.
- `/install` as a discoverable alias for `/init`.
- `/cd <path>` to change the target repository without restarting devcanon.
- Writable-target preflight checks before installation begins.

## [1.1.0] - 2026-08-06

### Added

- Interactive terminal mode when `devcanon` runs without arguments.
- Slash shortcuts: `/init`, `/update`, `/check`, `/where`, `/version`, `/clear`, `/help`, and `/exit`.
- Branded ANSI terminal banner with `NO_COLOR` support.
- Global installation documentation.
- Detailed CLI reference, website specification, security policy, contributing guide, and brand assets.

### Changed

- Unknown commands now fail clearly instead of being treated as target directories.
- Package documentation now treats global, one-off, and project-pinned installation as equal workflows.

## [1.0.0] - 2026-08-06

### Added

- Initial public npm release.
- 33 modular engineering standards and 10 reusable implementation guides.
- Safe installation into existing repositories.
- `init`, `update`, and `check` commands.
- Conflict preservation, `--force`, `--dry-run`, and optional root `AGENTS.md` discovery.
- Zero runtime dependencies and Node.js 20+ support.

[Unreleased]: https://github.com/KaReeeeeeeeEM/devcanon/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/KaReeeeeeeeEM/devcanon/releases/tag/v2.2.0
[2.1.1]: https://github.com/KaReeeeeeeeEM/devcanon/releases/tag/v2.1.1
[2.1.0]: https://github.com/KaReeeeeeeeEM/devcanon/releases/tag/v2.1.0
[2.0.0]: https://github.com/KaReeeeeeeeEM/devcanon/releases/tag/v2.0.0
[1.1.1]: https://github.com/KaReeeeeeeeEM/devcanon/releases/tag/v1.1.1
[1.1.0]: https://github.com/KaReeeeeeeeEM/devcanon/releases/tag/v1.1.0
[1.0.0]: https://www.npmjs.com/package/devcanon/v/1.0.0
