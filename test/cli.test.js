import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';
import { decodePreset, encodePreset } from '../lib/preset.js';
import { applyProduct, decodeProduct, encodeProduct, productPrompt } from '../lib/product.js';

const exec = promisify(execFile);
const cli = path.resolve('bin/aistd.js');
const packageVersion = JSON.parse(await readFile(path.resolve('package.json'), 'utf8')).version;

test('installs standards into an existing directory', async () => {
  const target = await mkdtemp(path.join(os.tmpdir(), 'aistd-'));
  const { stdout } = await exec(process.execPath, [cli, 'init', target]);
  assert.match(stdout, /Start with \.ai\/AGENTS\.md/);
  assert.match(await readFile(path.join(target, '.ai/AGENTS.md'), 'utf8'), /AI Engineering Standards/);
  assert.match(await readFile(path.join(target, 'AGENTS.md'), 'utf8'), /.ai\/AGENTS.md/);
  await exec(process.execPath, [cli, 'check', target]);
});

test('preserves modified standards unless force is supplied', async () => {
  const target = await mkdtemp(path.join(os.tmpdir(), 'aistd-'));
  await exec(process.execPath, [cli, 'init', target]);
  const file = path.join(target, '.ai/design.md');
  await writeFile(file, '# Local design\n');
  const { stdout } = await exec(process.execPath, [cli, 'update', target]);
  assert.match(stdout, /skip \(modified\): \.ai\/design\.md/);
  assert.equal(await readFile(file, 'utf8'), '# Local design\n');
  await exec(process.execPath, [cli, 'update', target, '--force']);
  assert.match(await readFile(file, 'utf8'), /# Product Design/);
});

test('dry run does not write files', async () => {
  const target = await mkdtemp(path.join(os.tmpdir(), 'aistd-'));
  const { stdout } = await exec(process.execPath, [cli, 'init', target, '--dry-run']);
  assert.match(stdout, /would create: \.ai\/AGENTS\.md/);
  await assert.rejects(readFile(path.join(target, '.ai/AGENTS.md')));
});

test('interactive mode accepts slash shortcuts and exits cleanly', async () => {
  const child = spawn(process.execPath, [cli], { stdio: ['pipe', 'pipe', 'pipe'] });
  let output = '';
  let exitSent = false;
  child.stdout.on('data', (chunk) => {
    output += chunk;
    if (!exitSent && output.includes(`devcanon › ${packageVersion}`)) {
      exitSent = true;
      child.stdin.end('/exit\n');
    }
  });
  child.stderr.on('data', (chunk) => { output += chunk; });
  child.stdin.write('/version\n');
  const exitCode = await new Promise((resolve) => child.on('close', resolve));
  assert.equal(exitCode, 0);
  assert.match(output, /Engineering standards, on command/);
  assert.match(output, new RegExp(packageVersion.replaceAll('.', '\\.')));
  assert.match(output, /Standards saved\. Build well\./);
});

test('preset codes are deterministic and install a project profile', async () => {
  const code = encodePreset({ accent: 'violet', density: 'compact' });
  assert.equal(code, encodePreset({ accent: 'violet', density: 'compact' }));
  assert.equal(decodePreset(code).accent, 'violet');
  const target = await mkdtemp(path.join(os.tmpdir(), 'devcanon-preset-'));
  await exec(process.execPath, [cli, 'init', target, '--preset', code]);
  assert.match(await readFile(path.join(target, '.ai/preset.md'), 'utf8'), /\*\*accent\*\*: violet/);
});

test('product setup codes generate an agent brief and complete build prompt', async () => {
  const product = { name: 'Pocket Garden', description: 'Help children remember to water plants.', kind: 'mobile', stackMode: 'choose', mobile: 'flutter-dart', language: 'dart', database: 'sqlite', dataTool: 'sql', hasDesignReferences: true };
  const code = encodeProduct(product);
  assert.equal(decodeProduct(code).name, 'Pocket Garden');
  assert.match(productPrompt(product), /attach design examples/i);
  const target = await mkdtemp(path.join(os.tmpdir(), 'devcanon-product-'));
  await exec(process.execPath, [cli, 'init', target, '--product', code]);
  assert.match(await readFile(path.join(target, '.ai/product.md'), 'utf8'), /Pocket Garden/);
  assert.match(await readFile(path.join(target, '.ai/prompts/build-product.md'), 'utf8'), /Build Pocket Garden from start to finish/);
});

test('users can skip stack selection while keeping a useful build prompt', async () => {
  const target = await mkdtemp(path.join(os.tmpdir(), 'devcanon-product-open-'));
  await exec(process.execPath, [cli, 'init', target, '--no-setup']);
  await applyProduct(target, { name: 'Simple idea', description: 'Help people plan meals.' });
  assert.match(await readFile(path.join(target, '.ai/product.md'), 'utf8'), /Stack choices are intentionally open/);
});

test('unknown direct commands fail instead of being interpreted as paths', async () => {
  await assert.rejects(exec(process.execPath, [cli, 'unknown']), /Unknown command: unknown/);
});

test('refuses the filesystem root with actionable guidance', async () => {
  await assert.rejects(
    exec(process.execPath, [cli, 'init', path.parse(process.cwd()).root]),
    (error) => {
      assert.match(error.stderr, /will not install into the filesystem root/);
      assert.match(error.stderr, /cd \/path\/to\/your\/project/);
      assert.doesNotMatch(error.stderr, /ENOENT|EACCES|EPERM/);
      return true;
    },
  );
});
