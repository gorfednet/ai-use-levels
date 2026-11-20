// scripts/check-trailers.mjs: the form of an AI-Use line, and the range it reads.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  bareForm,
  checkStanding,
  checkStandingPlacement,
  checkTag,
  doorLevels,
  standingLines,
  tagLines,
  toolFloor,
} from '../scripts/check-trailers.mjs';
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
    'AI-Use: L0',
    'AI-Use: L0 v1',
    'AI-Use: L2 undo (Claude Opus 5.5)',
    'AI-Use: L1 touched (Copilot (IDE))',
    'AI-Use: L2 made no undo (Copilot (IDE)) v1',
    'AI-Use: L3 made no undo unread (Claude Code + Copilot)',
  ]) {
    assert.deepEqual(checkTag(line, spec), [], line);
  }
});

// The first 3 are forms that reached real commits in October 2026. "AI-Use: directed" was
// "not a machine-form tag" under 1.1, when the tool's parentheses were part of the syntax;
// since 1.2 the parentheses are optional and the word fails as an unknown token instead.
const nearMisses = [
  ['AI-Use: L2 rewrote wording (Claude Opus 5.5)', /unknown token/],
  ['AI-Use: L2 made wording (Claude Opus 5.5)', /unknown token/],
  ['AI-Use: directed', /unknown token/],
  ['AI-Use: L2 made (Claude Code)', /L2 needs a Door/],
  ['AI-Use: L3 (Claude Code)', /L3 needs a Door/],
  ['AI-Use: L1 made undo (Claude Code)', /L1 takes no Door/],
  ['AI-Use: L0 no undo (Claude Code)', /L0 takes no Door/],
  // L0 is the level token alone (SPEC.md section 2, spec.json machineForm.level0).
  ['AI-Use: L0 (ChatGPT)', /L0 takes no Tool/],
  ['AI-Use: L0 (none)', /L0 takes no Tool/],
  ['AI-Use: L0 made', /L0 takes no Hand/],
  ['AI-Use: L0 unread', /L0 takes no flag/],
  ['AI-Use: L0 no undo', /L0 takes no Door/],
  // L1 and above name a Tool.
  ['AI-Use: L1 made', /L1 needs a Tool/],
  ['AI-Use: L1', /L1 needs a Tool/],
  ['AI-Use: L3 made no undo unread', /L3 needs a Tool/],
  ['AI-Use: L2 made undo v1', /L2 needs a Tool/],
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
  ['AI-Use: L2 made undo', /L2 needs a Tool/],
  ['AI-Use: L2 made undo ()', /empty tool/],
  ['AI-Use: L0 ()', /empty tool/],
  ['AI-Use: L0v1', /unknown token/],
  ['AI-Use: L0 2', /unknown token/],
  ['AI-Use: L0 (none) 2', /not a machine-form tag/],
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

test('the lowest level with a Tool comes from spec.json', () => {
  assert.equal(toolFloor(spec), 'L1');
  assert.throws(() => toolFloor({ slots: [{ id: 'tool', required: 'always' }] }), /names no lowest level/);
  assert.throws(() => toolFloor({ slots: [] }), /names no lowest level/);
});

test('the bare form comes from spec.json machineForm.level0', () => {
  assert.equal(bareForm(spec), 'L0');
  assert.throws(() => bareForm({ ...spec, machineForm: { trailer: 'AI-Use' } }), /level0 is missing/);
  for (const level0 of ['AI-Use: L0 (none)', 'AI-Use: L0 made', 'AI-Use: L1 touched (ChatGPT)']) {
    assert.throws(
      () => bareForm({ ...spec, machineForm: { ...spec.machineForm, level0 } }),
      /not a level token alone/,
      level0,
    );
  }
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
  commit('No AI\n\nAI-Use: L0');
  const result = run('--range', 'HEAD~2..HEAD');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 commit\(s\), 2 tag\(s\), 0 bad/);
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

// The pointer to a standing statement (SPEC.md section 2, spec.json machineForm.standing).
test('every worked example with a standing line passes, beside its tag', () => {
  const withStanding = examples.filter((example) => example.standing !== undefined);
  assert.ok(withStanding.length > 0, 'at least one example has a standing line');
  for (const example of withStanding) {
    assert.deepEqual(checkStanding(example.standing, spec), [], example.standing);
    assert.deepEqual(checkStandingPlacement(`Subject\n\n${example.machine}\n${example.standing}`), [], example.standing);
  }
});

test('well-formed standing lines pass', () => {
  for (const line of [
    'AI-Use-Standing: docs/ai-use.md 2026-09-01',
    'AI-Use-Standing: https://example.com/ai-use 2026-09-01',
    'AI-Use-Standing: standing/ai-use.md#delegation 2026-02-28',
    'AI-Use-Standing: docs/v1..2/ai-use.md 2026-09-01',
    'AI-Use-Standing: https://example.com/a/../ai-use 2026-09-01',
    'AI-Use-Standing: http://example.com/ai-use 2026-09-01',
    'AI-Use-Standing: docs/standing/c/ai-use.md 2026-09-01',
    'AI-Use-Standing: x 2028-02-29',
  ]) {
    assert.deepEqual(checkStanding(line, spec), [], line);
  }
});

const standingNearMisses = [
  ['AI-Use-Standing: docs/ai-use.md', /not a standing line/],
  ['AI-Use-Standing: engineering standing tag 2026-02-28', /not a standing line/], // a name in several words is no URL or path
  ['AI-Use-Standing: docs/ai use.md 2026-09-01', /not a standing line/],
  ['AI-Use-Standing: ../rules/ai-use.md 2026-09-01', /leaves the repository/],
  ['AI-Use-Standing: docs/../../rules.md 2026-09-01', /leaves the repository/],
  ['AI-Use-Standing: /Users/me/rules.md 2026-09-01', /leaves the repository/],
  ['AI-Use-Standing: ~/rules.md 2026-09-01', /leaves the repository/],
  ['AI-Use-Standing: .. 2026-09-01', /leaves the repository/],
  ['AI-Use-Standing: C:/Users/me/rules.md 2026-09-01', /leaves the repository/],
  ['AI-Use-Standing: c:\\\\rules.md 2026-09-01', /leaves the repository/],
  ['AI-Use-Standing: \\\\\\\\host\\\\rules.md 2026-09-01', /leaves the repository/],
  ['AI-Use-Standing: file:///Users/me/rules.md 2026-09-01', /leaves the repository/],
  ['AI-Use-Standing: ssh://host/rules.md 2026-09-01', /leaves the repository/],
  ['AI-Use-Standing: https:// 2026-09-01', /not a standing line|leaves the repository/],
  ['AI-Use-Standing:  2026-09-01', /not a standing line/],
  ['AI-Use-Standing: 2026-09-01', /not a standing line/],
  ['AI-Use-Standing: docs/ai-use.md 2026-9-1', /not a standing line/],
  ['AI-Use-Standing: 2026-09-01 docs/ai-use.md', /not a standing line/],
  ['AI-Use-Standing:docs/ai-use.md 2026-09-01', /not a standing line/],
  ['ai-use-standing: docs/ai-use.md 2026-09-01', /not a standing line/],
  ['AI_Use_Standing: docs/ai-use.md 2026-09-01', /not a standing line/],
  ['AI-Use-Standing: docs/ai-use.md 2026-09-01 ', /not a standing line/], // standingLines trims a real line first
  ['AI-Use-Standing: docs/ai-use.md 2026-02-30', /does not exist/],
  ['AI-Use-Standing: docs/ai-use.md 2027-02-29', /does not exist/],
  ['AI-Use-Standing: docs/ai-use.md 2026-13-01', /does not exist/],
  ['AI-Use-Standing: docs/ai-use.md 2026-00-10', /does not exist/],
];

for (const [line, expected] of standingNearMisses) {
  test(`fails: ${line}`, () => {
    const problems = checkStanding(line, spec);
    assert.ok(problems.length > 0, 'at least one problem');
    assert.match(problems.join('\n'), expected);
  });
}

test('the unpublished draft key is not a standing line', () => {
  assert.deepEqual(standingLines('AI-Use-Policy: docs/ai-use.md 2026-09-01'), []);
  assert.match(checkStanding('AI-Use-Policy: docs/ai-use.md 2026-09-01', spec).join('\n'), /not a standing line/);
});

test('a standing line is never read as a tag, and a tag line never as a standing line', () => {
  const message = 'AI-Use: L3 made undo (Claude Code)\nAI-Use-Standing: docs/ai-use.md 2026-09-01';
  assert.deepEqual(tagLines(message), ['AI-Use: L3 made undo (Claude Code)']);
  assert.deepEqual(standingLines(message), ['AI-Use-Standing: docs/ai-use.md 2026-09-01']);
  assert.deepEqual(standingLines('Subject mentions AI-Use-Standing: x 2026-09-01\n\n    AI-Use-Standing: x 2026-09-01'), []);
});

test('a standing line stands only beside a tag, and only one', () => {
  const pointer = 'AI-Use-Standing: docs/ai-use.md 2026-09-01';
  assert.deepEqual(checkStandingPlacement(`Subject\n\nAI-Use: L3 made undo (Claude Code)\n${pointer}`), []);
  assert.match(checkStandingPlacement(`Subject\n\n${pointer}`).join('\n'), /no AI-Use tag beside it/);
  assert.match(checkStandingPlacement(`Subject\n\nAI-Use: L1 (ChatGPT)\n${pointer}\n${pointer}`).join('\n'), /2 standing lines/);
});

test('the standing trailer comes from spec.json', () => {
  assert.throws(() => checkStanding('AI-Use-Standing: x 2026-09-01', { machineForm: {} }), /standing\.trailer is missing/);
  const renamed = { machineForm: { standing: { trailer: 'AI-Use-Policy', pattern: 'x' } } };
  assert.throws(() => checkStanding('AI-Use-Standing: x 2026-09-01', renamed), /not AI-Use-Standing/);
});

test('a good standing line passes the range, and a bad one or a lone one fails it', (t) => {
  const { commit, run } = repo(t);
  commit('Good\n\nAI-Use: L3 made undo (Claude Code)\nAI-Use-Standing: docs/ai-use.md 2026-09-01');
  const good = run('--range', 'HEAD~1..HEAD');
  assert.equal(good.status, 0, good.stderr);
  assert.match(good.stdout, /1 commit\(s\), 1 tag\(s\), 0 bad \(1 standing line\(s\)\)/);
  commit('Bad date\n\nAI-Use: L3 made undo (Claude Code)\nAI-Use-Standing: docs/ai-use.md 2026-02-30');
  assert.equal(run('--range', 'HEAD~1..HEAD').status, 1);
  commit('Alone\n\nAI-Use-Standing: docs/ai-use.md 2026-09-01');
  const alone = run('--range', 'HEAD~1..HEAD');
  assert.equal(alone.status, 1);
  assert.match(alone.stderr, /no AI-Use tag beside it/);
});
