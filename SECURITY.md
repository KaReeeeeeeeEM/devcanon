# Security Policy

## Supported Versions

Security fixes are provided for the latest published major version.

## Reporting

Do not open a public issue for a suspected vulnerability. Use GitHub private vulnerability reporting on the devcanon repository. Include affected version, reproduction steps, impact, and any suggested remediation.

## Security Model

devcanon performs local filesystem operations only. It has no runtime dependencies, does not execute repository code, and does not transmit repository contents. Existing files are preserved unless the user explicitly supplies `--force`.

Before publishing, maintainers must inspect the npm tarball and verify that no credentials, unrelated files, or private data are included.
