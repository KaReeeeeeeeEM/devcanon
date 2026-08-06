#!/usr/bin/env node

import { constants } from 'node:fs';
import { access, copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templateRoot = path.join(packageRoot, '.ai');
const packageJson = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
const commandNames = new Set(['init', 'update', 'check', 'help']);
const colorEnabled = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, value) => colorEnabled ? `\u001b[${code}m${value}\u001b[0m` : value;

function printBanner() {
  console.log(paint('38;5;81', `
 ██████╗ ███████╗██╗   ██╗ ██████╗ █████╗ ███╗   ██╗ ██████╗ ███╗   ██╗
 ██╔══██╗██╔════╝██║   ██║██╔════╝██╔══██╗████╗  ██║██╔═══██╗████╗  ██║
 ██║  ██║█████╗  ██║   ██║██║     ███████║██╔██╗ ██║██║   ██║██╔██╗ ██║
 ██║  ██║██╔══╝  ╚██╗ ██╔╝██║     ██╔══██║██║╚██╗██║██║   ██║██║╚██╗██║
 ██████╔╝███████╗ ╚████╔╝ ╚██████╗██║  ██║██║ ╚████║╚██████╔╝██║ ╚████║
 ╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═══╝`));
  console.log(`${paint('1', `Engineering standards, on command · v${packageJson.version}`)}\n`);
}

function printHelp() {
  console.log(`devcanon ${packageJson.version} — AI engineering standards for any repository

Usage:
  devcanon                         Start the interactive CLI
  devcanon init [directory] [--dry-run] [--force] [--no-root-agents]
  devcanon update [directory] [--dry-run] [--force]
  devcanon check [directory]

Commands:
  interactive  Open a prompt with slash commands
  init    Add missing standards safely; preserve existing files by default
  update  Show or apply changes from the installed template
  check   Validate the standards manifest and required document sections

Options:
  --dry-run         Preview file operations without writing
  --force           Replace differing devcanon-managed files
  --no-root-agents  Do not create the root AGENTS.md discovery file
  -h, --help        Show this help
  -v, --version     Print the installed version

Examples:
  npx devcanon init
  npx devcanon init ../existing-project
  npx devcanon update --dry-run
  npx devcanon update --force`);
}

function parseArgs(argv) {
  const flags = new Set(argv.filter((arg) => arg.startsWith('-')));
  const positional = argv.filter((arg) => !arg.startsWith('-'));
  const command = positional.length === 0 ? 'interactive' : positional.shift();
  return {
    command,
    target: path.resolve(positional[0] ?? '.'),
    dryRun: flags.has('--dry-run'),
    force: flags.has('--force'),
    rootAgents: !flags.has('--no-root-agents'),
    help: flags.has('-h') || flags.has('--help'),
    version: flags.has('-v') || flags.has('--version'),
  };
}

function splitCommand(input) {
  const values = [];
  for (const match of input.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)) values.push(match[1] ?? match[2] ?? match[3]);
  return values;
}

async function runInteractive() {
  printBanner();
  console.log(`Current directory: ${paint('2', process.cwd())}`);
  console.log(`Type ${paint('36', '/help')} for commands or ${paint('36', '/init')} to install standards.\n`);

  const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    while (true) {
      const answer = (await terminal.question(`${paint('38;5;81', 'devcanon')} ${paint('2', '›')} `)).trim();
      if (!answer) continue;
      const normalized = answer.startsWith('/') ? answer.slice(1) : answer;
      const [command, ...args] = splitCommand(normalized);
      if (['exit', 'quit', 'q'].includes(command)) break;
      if (['help', '?'].includes(command)) {
        console.log(`\n${paint('1', 'Shortcuts')}
  /init [path]          Install standards without overwriting local changes
  /check [path]         Validate the handbook
  /update [path]        Add missing files and report local differences
  /update --dry-run     Preview an update
  /update --force       Replace locally modified standards
  /where                Show the current target directory
  /version              Show the installed version
  /clear                Clear the terminal
  /exit                 Leave devcanon\n`);
        continue;
      }
      if (command === 'where') { console.log(process.cwd()); continue; }
      if (command === 'version') { console.log(packageJson.version); continue; }
      if (command === 'clear') { console.clear(); printBanner(); continue; }
      if (!commandNames.has(command) || command === 'help') {
        console.log(`${paint('33', 'Unknown shortcut:')} ${answer}. Type /help.`);
        continue;
      }
      try {
        await execute(parseArgs([command, ...args]));
      } catch (error) {
        console.error(paint('31', error.message));
      }
      console.log();
    }
  } finally {
    terminal.close();
  }
  console.log(paint('2', 'Standards saved. Build well.'));
}

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function filesUnder(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path.join(directory, entry.name), relative));
    else if (entry.isFile()) files.push(relative);
  }
  return files;
}

async function sameContent(left, right) {
  if (!await exists(right)) return false;
  return (await readFile(left)).equals(await readFile(right));
}

const rootAgentContent = `# Repository AI Instructions

The authoritative AI engineering standards for this repository are in [\`.ai/AGENTS.md\`](.ai/AGENTS.md).

Before planning or modifying code, read \`.ai/AGENTS.md\`, \`.ai/project-rules.md\`, and every standard relevant to the task. Existing repository conventions remain authoritative where the standards require local adaptation.
`;

async function install(options) {
  if (!await exists(options.target)) throw new Error(`Target does not exist: ${options.target}`);
  if (!(await stat(options.target)).isDirectory()) throw new Error(`Target is not a directory: ${options.target}`);

  const standards = await filesUnder(templateRoot);
  const operations = (await Promise.all(standards.map(async (relative) => {
    const source = path.join(templateRoot, relative);
    const destination = path.join(options.target, '.ai', relative);
    if (!await exists(destination)) return { kind: 'create', source, destination, relative: path.join('.ai', relative) };
    if (!await sameContent(source, destination)) return { kind: options.force ? 'replace' : 'conflict', source, destination, relative: path.join('.ai', relative) };
    return null;
  }))).filter(Boolean);

  const rootAgentsPath = path.join(options.target, 'AGENTS.md');
  if (options.rootAgents && !await exists(rootAgentsPath)) {
    operations.push({ kind: 'root', destination: rootAgentsPath, relative: 'AGENTS.md' });
  }

  for (const operation of operations) {
    const label = operation.kind === 'conflict' ? 'skip (modified)' : operation.kind;
    console.log(`${options.dryRun ? 'would ' : ''}${label}: ${operation.relative}`);
  }

  await Promise.all(operations.map(async (operation) => {
    if (options.dryRun || operation.kind === 'conflict') return;
    await mkdir(path.dirname(operation.destination), { recursive: true });
    if (operation.kind === 'root') await writeFile(operation.destination, rootAgentContent, { flag: 'wx' });
    else await copyFile(operation.source, operation.destination);
  }));

  const conflicts = operations.filter(({ kind }) => kind === 'conflict').length;
  const changed = operations.filter(({ kind }) => kind !== 'conflict').length;
  if (!operations.length) console.log('devcanon is already up to date.');
  else console.log(`\n${options.dryRun ? 'Previewed' : 'Completed'}: ${changed} change(s), ${conflicts} preserved conflict(s).`);
  if (conflicts) console.log('Review conflicts manually or rerun with --force to replace them.');
  if (options.command === 'init' && !options.dryRun) console.log('Start with .ai/AGENTS.md.');
}

const requiredFiles = [
  'AGENTS.md', 'architecture.md', 'design.md', 'frontend.md', 'backend.md', 'api.md',
  'database.md', 'authentication.md', 'authorization.md', 'security.md', 'performance.md',
  'animations.md', 'accessibility.md', 'testing.md', 'deployment.md', 'coding-style.md',
  'documentation.md', 'git.md', 'dependencies.md', 'error-handling.md', 'forms.md',
  'state-management.md', 'logging.md', 'monitoring.md', 'ui-components.md', 'charts.md',
  'notifications.md', 'uploads.md', 'internationalization.md', 'responsiveness.md',
  'folder-structure.md', 'naming-conventions.md', 'project-rules.md',
  ...['dashboard', 'admin-panel', 'landing-page', 'crud', 'authentication', 'ecommerce', 'analytics', 'ai-features', 'saas', 'api-module']
    .map((name) => path.join('prompts', `${name}.md`)),
];
const requiredSections = ['Purpose', 'Philosophy', 'Best Practices', 'Rules', 'Examples', 'Anti-patterns', 'Checklist'];

async function check(target) {
  const aiRoot = path.join(target, '.ai');
  const issues = [];
  for (const relative of requiredFiles) {
    const file = path.join(aiRoot, relative);
    if (!await exists(file)) {
      issues.push(`missing: .ai/${relative}`);
      continue;
    }
    const content = await readFile(file, 'utf8');
    if (!content.trim()) issues.push(`empty: .ai/${relative}`);
    for (const section of requiredSections) {
      if (!content.includes(`## ${section}`)) issues.push(`missing section "${section}": .ai/${relative}`);
    }
  }
  if (issues.length) {
    console.error(issues.join('\n'));
    throw new Error(`Standards check failed with ${issues.length} issue(s).`);
  }
  console.log(`Valid: ${requiredFiles.length} standards files with all required sections.`);
}

async function execute(options) {
  if (options.command === 'check') return check(options.target);
  if (options.command === 'init' || options.command === 'update') return install(options);
  throw new Error(`Unknown command: ${options.command}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.version) return console.log(packageJson.version);
  if (options.help || options.command === 'help') return printHelp();
  if (options.command === 'interactive') return runInteractive();
  return execute(options);
}

main().catch((error) => {
  console.error(`devcanon: ${error.message}`);
  process.exitCode = 1;
});
