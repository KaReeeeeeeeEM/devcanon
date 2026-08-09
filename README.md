<p align="center">
  <img src="docs/assets/devcanon-banner.svg" alt="devcanon — Engineering standards, on command" width="900">
</p>

<p align="center">
  Install a durable AI engineering handbook into any repository.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/devcanon">npm</a> ·
  <a href="docs/CLI.md">CLI guide</a> ·
  <a href="CHANGELOG.md">Changelog</a> ·
  <a href="https://github.com/KaReeeeeeeeEM/devcanon-website">Website</a>
</p>

## Why devcanon?

AI coding tools work better when a repository explains how engineering decisions should be made. `devcanon` installs a modular `.ai/` handbook covering architecture, product design, frontend, backend, APIs, databases, security, accessibility, testing, deployment, observability, and common feature blueprints.

The handbook is framework-neutral, versioned with the project, and designed to preserve existing conventions instead of imposing a generic visual language.

## Install globally

```bash
npm install --global devcanon
devcanon
```

Running `devcanon` without arguments opens the interactive terminal:

```text
devcanon › /init
devcanon › /setup
devcanon › /configure
devcanon › /studio
devcanon › /check
devcanon › /update --dry-run
devcanon › /help
```

If the shell opens in the wrong directory, switch targets without leaving devcanon:

```text
devcanon › /cd /path/to/your/project
devcanon › /init
```

## Use without installing

```bash
npx devcanon init
```

When the terminal is interactive, Devcanon offers a short, optional product setup before installation. Choose your kind of product and stack, or skip every technical choice. Devcanon then creates a plain-language product brief and a complete AI build prompt in `.ai/prompts/build-product.md`.

You can run the setup again at any time:

```bash
devcanon setup
```

Use a preset created in the web or desktop Studio:

```bash
npx devcanon init --preset dc1_<your-preset-code>
```

The preset writes reviewable `.ai/preset.md` and `.ai/preset.json` files. It never hides configuration in a remote account.

## Pin it to a project

```bash
npm install --save-dev devcanon
npx devcanon init
```

## Existing repositories are first-class

From the repository root:

```bash
devcanon init
```

`devcanon` creates missing files and preserves every differing local file. Updates remain reviewable:

```bash
devcanon update --dry-run  # preview
devcanon update            # add missing files; preserve conflicts
devcanon update --force    # intentionally replace conflicts
devcanon check             # validate the installed handbook
```

Edit one standard from an interactive file picker, or open it directly:

```bash
devcanon configure
devcanon configure --file design.md
```

For a local visual editor, run `devcanon studio`. Studio binds only to `127.0.0.1`, uses a one-time access token, and lets you save Markdown or apply safe handbook updates in the browser.

Target another repository by path:

```bash
devcanon init ../my-project
```

## What gets installed

```text
AGENTS.md                 AI-tool discovery file, created only if absent
.ai/
├── AGENTS.md             Handbook entry point and precedence rules
├── architecture.md       Modular boundaries and dependency direction
├── design.md             Product hierarchy, tokens, and visual restraint
├── security.md           Secure engineering defaults
├── testing.md            Risk-based verification strategy
├── ...                   33 focused engineering standards
├── product.md            Optional product and stack brief
└── prompts/              Reusable guides and generated build prompt
```

The root `AGENTS.md` points compatible AI tools to `.ai/AGENTS.md`. Existing root instructions are never overwritten.

## Safety model

- Missing standards are installed.
- Identical standards are left untouched.
- Modified standards are preserved and reported.
- `--force` is required to replace local changes.
- `--dry-run` previews every operation.
- `--no-root-agents` skips the root discovery file.
- The CLI has no runtime dependencies and requires Node.js 20+.

## Documentation

- [Complete CLI reference](docs/CLI.md)
- [Release history](CHANGELOG.md)
- [devcanon website repository](https://github.com/KaReeeeeeeeEM/devcanon-website)
- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

## Web and desktop Studio

The [separate website](https://github.com/KaReeeeeeeeEM/devcanon-website) includes a preset builder, installation choices, documentation, and release history. Devcanon Studio packages that builder for macOS, Windows, and Linux; releases are distributed from GitHub.

## License

Source-available under the PolyForm Shield License 1.0.0 © Kareem. Published versions previously released under MIT remain available under their original terms.
