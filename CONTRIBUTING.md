# Contributing to devcanon

devcanon accepts focused fixes, documentation improvements, tests, and approved features. Contributions are reviewed for product fit, originality, maintenance cost, security, and compatibility; submission does not guarantee acceptance.

## Required Workflow

1. Open an issue before implementing a material feature, new command, dependency, architecture change, or standards-policy change.
2. Fork the repository. Do not request direct write access for ordinary contributions.
3. Create a focused branch such as `fix/root-target-message` or `docs/global-install`.
4. Read `.ai/AGENTS.md` and the relevant standards.
5. Implement the smallest coherent change with tests and documentation.
6. Run `npm test` and `npm run check`.
7. Open a pull request using the repository template.
8. Address review without force-pushing away reviewed history unless a maintainer requests rebasing.

## Main Branch Policy

- Nobody contributes by pushing directly to `main`.
- Every change reaches `main` through a pull request.
- At least one approving code-owner review is required.
- New commits dismiss stale approvals; unresolved conversations block merging.
- CI must pass. Force pushes and branch deletion are blocked.
- The project owner performs or explicitly approves releases.
- Maintainers may close changes that duplicate the product, weaken safeguards, create incompatible forks inside the project, or diverge from the roadmap.

These controls are enforced in GitHub settings as well as documented here.

## Contribution and IP Terms

By submitting a contribution, you certify that you created it or have the right to submit it, and you grant the project owner a perpetual, worldwide, irrevocable, royalty-free license to use, reproduce, modify, distribute, sublicense, and relicense that contribution as part of devcanon. You retain copyright in your original contribution.

Do not submit confidential employer material, copied proprietary standards, trademarked assets, or code whose license is incompatible with this repository. Disclose substantial inspiration and third-party sources in the pull request.

The repository uses PolyForm Shield 1.0.0 beginning with version 2.0.0. It permits use, changes, and distribution for noncompeting purposes, but not a competing product. Earlier npm versions published under MIT remain governed by MIT; a later license cannot revoke rights already granted.

## Engineering Requirements

- Keep the CLI dependency-free unless an approved proposal establishes durable value.
- Preserve non-destructive installation and clear recovery messages.
- Add a regression test for every bug fix where practical.
- Update `README.md`, `docs/CLI.md`, and `CHANGELOG.md` with public behavior.
- Do not edit a published version; follow Semantic Versioning.
- Never include secrets, unrelated files, package tarballs, or user repository content.

## Release Process

Only the owner or a designated release maintainer may release:

1. Review dependency, license, and intellectual-property changes.
2. Finalize the version and dated changelog section.
3. Run `npm test`, `npm run check`, and `npm pack --dry-run`.
4. Merge the approved pull request into protected `main`.
5. Tag `vX.Y.Z`, publish to npm with 2FA, and create the matching GitHub release.
6. Verify global and `npx` installation from the public registry.
