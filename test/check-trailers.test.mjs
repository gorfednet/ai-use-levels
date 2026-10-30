// scripts/check-trailers.mjs: the form of an AI-Use line, and the range it reads.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { checkTag, doorLevels, tagLines } from '../scripts/check-trailers.mjs';
import { readJson, root } from './lib/spec.mjs';

const spec = readJson('spec.json');
const examples = readJson('examples/examples.json');
const script = path.join(root, 'scripts', 'check-trailers.mjs');

test('every worked example passes', () => {
  assert.ok(examples.length > 0, 'there are examples');
  for (const example of examples) {
    assert.deepEqual(checkTag(example.machine, spec), [], example.machine);
  }
});

test('well-formed tags outside the examples pass', () => {
  for (const line of [
    'AI-Use: L1 (ChatGPT)',
    'AI-Use: L0 (none)',
    'AI-Use: L2 undo (Claude Opus 5.5)',
    'AI-Use: L1 touched (Copilot (IDE))',
    'AI-Use: L2 made no undo (Copilot (IDE)) v1',
    'AI-Use: L3 made no undo unread (Claude Code + Copilot)',
  ]) {
    assert.deepEqual(checkTag(line, spec), [], line);
  }
});

// The first 3 are forms that reached real commits in October 2026.
const nearMisses = [
  ['AI-Use: L2 rewrote wording (Claude Opus 5.5)', /unknown token/],
  ['AI-Use: L2 made wording (Claude Opus 5.5)', /unknown token/],
  ['AI-Use: directed', /not a machine-form tag/],
  ['AI-Use: L2 made (Claude Code)', /L2 needs a Door/],
  ['AI-Use: L3 (Claude Code)', /L3 needs a Door/],
  ['AI-Use: L1 made undo (Claude Code)', /L1 takes no Door/],
  ['AI-Use: L0 no undo (Claude Code)', /L0 takes no Door/],
  ['AI-Use: made undo (Claude Code)', /no level token/],
  ['AI-Use: (Claude Code)', /no level token/],
  ['AI-Use: L1 L2 undo (Claude Code)', /2 level tokens/],
  ['AI-Use: L2 made drafted undo (Claude Code)', /2 hand tokens/],
  ['AI-Use: L2 undo no undo (Claude Code)', /2 door tokens/],
  ['AI-Use: L1 unread unread (DeepL)', /2 flag tokens/],
  ['AI-Use: made L2 undo (Claude Code)', /out of order/],
  ['AI-Use: L2 undo made (Claude Code)', /out of order/],
  ['AI-Use: L4 made undo (Claude Code)', /unknown token/],
  ['AI-Use: l2 made undo (Claude Code)', /unknown token/],
  ['AI-Use: L2 Made undo (Claude Code)', /unknown token/],
  ['AI-Use: L2 made noundo (Claude Code)', /unknown token/],
  ['AI-Use: Supervised made undo (Claude Code)', /unknown token/],
  ['AI-Use: L2 made undo', /not a machine-form tag/],
  ['AI-Use: L2 made undo ()', /empty tool/],
  ['AI-Use: L2 made undo (Claude Code) 2', /not a machine-form tag/],
  ['AI-Use: L2 made undo (Claude Code) v', /not a machine-form tag/],
  ['AI-Use:L2 made undo (Claude Code)', /not a machine-form tag/],
  ['ai-use: L2 made undo (Claude Code)', /not a machine-form tag/],
  ['AI_Use: L2 made undo (Claude Code)', /not a machine-form tag/],
];

for (const [line, expected] of nearMisses) {
  test(`fails: ${line}`, () => {
    const problems = checkTag(line, spec);
    assert.ok(problems.length > 0, 'at least one problem');
    assert.match(problems.join('\n'), expected);
  });
}

test('the Door levels come from spec.json', () => {
  assert.deepEqual(doorLevels(spec), ['L2', 'L3']);
  const noLevels = { slots: [{ id: 'door', required: 'sometimes' }] };
  assert.throws(() => doorLevels(noLevels), /names no levels/);
});

test('tagLines takes lines that start with the key, and only those', () => {
  const message = [
    'Subject that mentions AI-Use: L2 rewrote wording (Claude Opus 5.5)',
    '',
    'The old form was:',
    '',
    '    AI-Use: L2 rewrote wording (Claude Opus 5.5)',
    '',
    'AI-Use: L2 made undo (Claude Code)',
    'ai-use: L2 made undo (Claude Code)',
    'Co-Authored-By: Claude Code <noreply@anthropic.com>',
  ].join('\n');
  assert.deepEqual(tagLines(message), [
    'AI-Use: L2 made undo (Claude Code)',
    'ai-use: L2 made undo (Claude Code)',
  ]);
  assert.deepEqual(tagLines('A commit with no tag at all'), []);
});

// A real repository, so the range handling and the exit codes are what CI gets.
function repo(t) {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-trailers-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync(
      'git',
      ['-c', 'user.name=test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', ...args],
      { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    ).trim();
  git('init', '-q', '-b', 'main');
  git('commit', '-q', '--allow-empty', '-m', 'Start');
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { cwd: dir, encoding: 'utf8' });
  const commit = (message) => git('commit', '-q', '--allow-empty', '-m', message);
  return { commit, run };
}

test('a commit with no trailer passes', (t) => {
  const { commit, run } = repo(t);
  commit('No tag here');
  const result = run('--range', 'HEAD~1..HEAD');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 commit\(s\), 0 tag\(s\), 0 bad/);
});

test('a well-formed trailer passes', (t) => {
  const { commit, run } = repo(t);
  commit('Good\n\nAI-Use: L2 made undo (Claude Code)');
  const result = run('--range', 'HEAD~1..HEAD');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 commit\(s\), 1 tag\(s\), 0 bad/);
});

test('one bad trailer fails the range and names the commit', (t) => {
  const { commit, run } = repo(t);
  commit('Bad\n\nAI-Use: L2 rewrote wording (Claude Opus 5.5)');
  commit('Good\n\nAI-Use: L1 touched (Grammarly)');
  const result = run('--range', 'HEAD~2..HEAD');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /[0-9a-f]{9} AI-Use: L2 rewrote wording \(Claude Opus 5\.5\)/);
  assert.match(result.stdout, /2 commit\(s\), 2 tag\(s\), 1 bad/);
});

test('a bad tag outside the last paragraph still fails', (t) => {
  const { commit, run } = repo(t);
  commit('Bad\n\nAI-Use: directed\n\nA paragraph after it.');
  assert.equal(run('--range', 'HEAD~1..HEAD').status, 1);
});

test('an empty range fails closed', (t) => {
  const { run } = repo(t);
  const result = run('--range', 'HEAD..HEAD');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /no commits in HEAD\.\.HEAD/);
});

test('a ref git cannot read fails closed', (t) => {
  const { run } = repo(t);
  const result = run('--range', 'nosuchref..HEAD');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /git could not read/);
});

test('a missing or malformed --range is an error', (t) => {
  const { run } = repo(t);
  for (const args of [[], ['--range'], ['--range', 'HEAD'], ['--range', '..'], ['--range', '-1..HEAD'], ['--range', 'HEAD~1..']]) {
    assert.equal(run(...args).status, 2, JSON.stringify(args));
  }
});
