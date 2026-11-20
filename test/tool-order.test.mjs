// Tool order (SPEC.md section 6): models.json is the ranked list, and scripts/order-tools.mjs
// applies the 3 groups.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { classify, orderTools, splitTools } from '../scripts/order-tools.mjs';
import { readJson, readText, root } from './lib/spec.mjs';

const list = readJson('models.json');
const { models } = list;
const specText = readText('SPEC.md');

test('models.json is a ranked list of versioned names, each listed once, with a real date', () => {
  assert.deepEqual(Object.keys(list), ['updated', 'order', 'updateRule', 'models']);
  assert.ok(models.length > 0, 'the list has models');
  for (const model of models) {
    assert.match(model, /^\S+( \S+)* \S*\d\S*$/, `${model}: ends with a version`);
  }
  assert.equal(new Set(models.map((model) => model.toLowerCase())).size, models.length, 'no model twice');
  assert.match(list.updated, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Date(`${list.updated}T00:00:00Z`).toISOString().slice(0, 10), list.updated, 'the date exists');
  assert.ok(list.updateRule.includes('Never remove a model'), 'the update rule keeps old tags sortable');
});

test('SPEC.md section 6 gives the rule and its own example is in order', () => {
  assert.ok(specText.includes('order them by capability, then by recency'), 'the rule');
  assert.ok(specText.includes('The order says nothing about which tool had the biggest hand'), 'not share');
  assert.ok(specText.includes('[models.json](models.json)'), 'names the list');
  const example = /order them by capability, then by recency: `L2 · made · undo · ([^`]+)`/.exec(specText)?.[1];
  assert.ok(example, 'section 6 has a multi-tool example');
  const tools = splitTools(example);
  assert.ok(tools.length >= 3, 'the example has a tool from each group');
  assert.deepEqual(orderTools(tools, models), tools);
  assert.deepEqual([...new Set(tools.map((tool) => classify(tool, models).group))], [0, 1, 2]);
});

test('listed models come first in list order, then unversioned names, then other tools', () => {
  const mixed = ['Cursor', 'Sonnet', 'Claude Opus 5.0', 'Fable 5.1', 'Opus 5.5', 'Claude Fable 5.2'];
  assert.deepEqual(orderTools(mixed, models), ['Claude Fable 5.2', 'Opus 5.5', 'Fable 5.1', 'Claude Opus 5.0', 'Sonnet', 'Cursor']);
  assert.deepEqual(orderTools([...mixed].reverse(), models), orderTools(mixed, models), 'the input order does not matter');
});

test('the last 2 groups are alphabetical, and a reach parenthetical stays with its tool', () => {
  assert.deepEqual(
    orderTools(['Sonnet', 'cursor', 'Copilot (IDE)', 'Claude', 'GPT-5 (API)', 'Claude Opus 5.5 (agent)'], models),
    ['Claude Opus 5.5 (agent)', 'Claude', 'Sonnet', 'Copilot (IDE)', 'cursor', 'GPT-5 (API)'],
  );
});

// Near misses: each looks like a listed model or a family name and is neither.
const nearMisses = [
  ['5.5', 2, 'a version alone names no model'],
  ['Claude Opus 5.6', 2, 'a version the list does not have'],
  ['Claude 5.5', 2, 'the maker and a version, with no model between them'],
  ['Claude Code', 2, 'a product that shares the maker name'],
  ['Opus 5.5 Turbo', 2, 'a longer name than the listed one'],
  ['Claude Opus', 1, 'a listed model without its version'],
  ['claude opus 5.5', 0, 'case does not matter'],
];
for (const [tool, group, why] of nearMisses) {
  test(`${tool} is in group ${group}: ${why}`, () => {
    assert.equal(classify(tool, models).group, group);
  });
}

test('a plus sign inside parentheses does not split, and an empty name is an error', () => {
  assert.deepEqual(splitTools('Copilot (IDE + chat) + Claude'), ['Copilot (IDE + chat)', 'Claude']);
  assert.throws(() => splitTools('Claude + '), /empty tool name/);
  assert.throws(() => orderTools(['Claude'], []), /ranked model list is empty/);
});

test('the command prints the order, and --check fails a list that is out of order', () => {
  const run = (...args) => spawnSync(process.execPath, [path.join(root, 'scripts/order-tools.mjs'), ...args], { encoding: 'utf8' });
  const printed = run('Cursor + Sonnet + Opus 5.5');
  assert.equal(printed.status, 0, printed.stderr);
  assert.equal(printed.stdout.trim(), 'Opus 5.5 + Sonnet + Cursor');
  assert.equal(run('--check', 'Opus 5.5 + Sonnet + Cursor').status, 0);
  const bad = run('--check', 'Cursor + Opus 5.5');
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /expected Opus 5.5 \+ Cursor/);
  assert.equal(run().status, 2);
  assert.equal(run('--check', 'Claude + ').status, 2);
});
