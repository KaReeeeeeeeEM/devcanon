# devcanon CLI Reference

## Installation

Global installation is best for frequent use:

```bash
npm install --global devcanon
devcanon
```

Use the latest published version once without installing:

```bash
npx devcanon init
```

Teams may pin a version in `devDependencies` for reproducible updates:

```bash
npm install --save-dev devcanon
npx devcanon check
```

## Interactive mode

Run `devcanon` with no arguments. The prompt accepts slash commands and their plain equivalents:

| Shortcut | Purpose |
| --- | --- |
| `/init [path]` | Install missing standards safely |
| `/install [path]` | Alias for `/init` |
| `/setup [path]` | Create a product brief and complete AI build prompt |
| `/configure [path]` | Edit one handbook file |
| `/studio [path]` | Open the local visual handbook editor |
| `/update [path]` | Add missing standards and report conflicts |
| `/check [path]` | Validate all required files and sections |
| `/where` | Display the current target directory |
| `/cd <path>` | Change the target repository |
| `/version` | Display the CLI version |
| `/clear` | Clear and redraw the terminal |
| `/help` or `/?` | Display shortcut help |
| `/exit` | Close the session |

Paths containing spaces may be quoted:

```text
devcanon › /init "../My Existing App"
```

If devcanon starts in `/`, it refuses to install into the filesystem root and explains how to choose a project:

```text
devcanon › /cd /Users/you/Projects/my-app
devcanon › /init
```

## Direct commands

### `devcanon init [directory]`

Adds all missing `.ai` files. Existing local files are never replaced by default. If the repository has no root `AGENTS.md`, devcanon adds a small discovery file pointing AI tools to the handbook.

In an interactive terminal, `init` offers a short optional product setup. Choose the stack yourself or let the AI recommend the simplest suitable stack. Use `--no-setup` to skip the offer.

### `devcanon setup [directory]`

Asks simple questions about the product, then creates `.ai/product.md`, `.ai/product.json`, and `.ai/prompts/build-product.md`. Run it again whenever the product direction changes.

Use a portable setup code made by the PWA or Devcanon Studio without answering the questions again:

```bash
devcanon init --product dcp1_<your-product-code>
```

### `devcanon update [directory]`

Compares the packaged handbook with the repository. Missing files are added, identical files are ignored, and modified files are reported as conflicts.

### `devcanon check [directory]`

Validates the 48-file manifest and confirms every standard and reusable prompt contains Purpose, Philosophy, Best Practices, Rules, Examples, Anti-patterns, and Checklist sections.

## Options

| Option | Meaning |
| --- | --- |
| `--dry-run` | Print operations without writing |
| `--force` | Replace differing handbook files |
| `--no-root-agents` | Skip creation of root `AGENTS.md` |
| `--no-setup` | Skip optional product setup during `init` |
| `--product <code>` | Apply a portable `dcp1_` product setup code |
| `--preset <code>` | Apply a portable `dc1_` engineering preset code |
| `--help`, `-h` | Print command help |
| `--version`, `-v` | Print the version |

## Exit behavior

Successful commands exit with code `0`. Invalid targets, invalid commands, and failed checks exit non-zero, making `devcanon check` suitable for CI.

## Color and automation

Colors are shown only in an interactive terminal. Set `NO_COLOR=1` to disable ANSI decoration explicitly. Direct commands remain non-interactive and safe for scripts.

## Updating the global CLI

```bash
npm install --global devcanon@latest
devcanon --version
devcanon update --dry-run
```

Always preview standards updates when the repository has project-specific customizations.
