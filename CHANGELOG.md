# Changelog

All notable changes to devcanon are recorded here. Releases follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned

- Documentation website with a release timeline and install/download options.
- Configurable standard packs and organization presets.

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

[Unreleased]: https://github.com/KaReeeeeeeeEM/devcanon/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/KaReeeeeeeeEM/devcanon/releases/tag/v1.1.0
[1.0.0]: https://www.npmjs.com/package/devcanon/v/1.0.0
