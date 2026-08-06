import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

const exec = promisify(execFile);
const cli = path.resolve('bin/aistd.js');

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
    if (!exitSent && output.includes('devcanon › 1.1.0')) {
      exitSent = true;
      child.stdin.end('/exit\n');
    }
  });
  child.stderr.on('data', (chunk) => { output += chunk; });
  child.stdin.write('/version\n');
  const exitCode = await new Promise((resolve) => child.on('close', resolve));
  assert.equal(exitCode, 0);
  assert.match(output, /Engineering standards, on command/);
  assert.match(output, /1\.1\.0/);
  assert.match(output, /Standards saved\. Build well\./);
});

test('unknown direct commands fail instead of being interpreted as paths', async () => {
  await assert.rejects(exec(process.execPath, [cli, 'unknown']), /Unknown command: unknown/);
});
