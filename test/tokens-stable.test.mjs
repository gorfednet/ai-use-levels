// Extension rule 1: tokens are forever. For every published tag, every token in that
// tag's spec.json must still be in HEAD with the same id, slot, meaning and since.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { compareVersions, readJson, root } from './lib/spec.mjs';

function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' });
}

const head = readJson('spec.json');

const tags = git('tag', '--list', 'v*')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .sort((a, b) => compareVersions(a.slice(1).split('-')[0], b.slice(1).split('-')[0]));

function levelNumber(id) {
  const match = /^L(\d+)$/.exec(id);
  if (!match) throw new Error(`level id is not L<n>: ${JSON.stringify(id)}`);
  return Number(match[1]);
}

function levelIds(spec) {
  return spec.tokens.filter((token) => token.slot === 'level').map((token) => token.id);
}

test('HEAD level ids are in increasing order', () => {
  const numbers = levelIds(head).map(levelNumber);
  assert.ok(numbers.length > 0, 'HEAD has at least one level');
  for (let i = 1; i < numbers.length; i += 1) {
    assert.ok(numbers[i] > numbers[i - 1], `levels out of order at ${numbers[i - 1]} then ${numbers[i]}`);
  }
});

test('HEAD slot vocabularies are pairwise disjoint', () => {
  const bySlot = new Map();
  for (const token of head.tokens) {
    if (!bySlot.has(token.slot)) bySlot.set(token.slot, new Set());
    bySlot.get(token.slot).add(token.id);
  }
  const slots = [...bySlot.keys()];
  for (let i = 0; i < slots.length; i += 1) {
    for (let j = i + 1; j < slots.length; j += 1) {
      const shared = [...bySlot.get(slots[i])].filter((id) => bySlot.get(slots[j]).has(id));
      assert.deepEqual(shared, [], `slots ${slots[i]} and ${slots[j]} share tokens`);
    }
  }
  const ids = head.tokens.map((token) => token.id);
  assert.equal(new Set(ids).size, ids.length, 'token ids are unique across HEAD');
});

if (tags.length === 0) {
  test('no v* tag yet: HEAD shape checked, nothing to compare', (t) => {
    t.diagnostic('no v* tag in this clone: nothing to compare against HEAD');
    console.log('tokens-stable: no v* tag yet, nothing to compare; HEAD shape checked');
    assert.ok(Array.isArray(head.tokens) && head.tokens.length > 0, 'HEAD has tokens');
    assert.ok(levelIds(head).length > 0, 'HEAD has level tokens');
    for (const token of head.tokens) {
      assert.equal(typeof token.id, 'string', 'token id is a string');
      assert.equal(typeof token.slot, 'string', 'token slot is a string');
      assert.equal(typeof token.meaning, 'string', 'token meaning is a string');
      assert.equal(typeof token.since, 'string', 'token since is a string');
      assert.ok(
        token.deprecated === null || typeof token.deprecated === 'object',
        'deprecated is null or an object',
      );
    }
  });
}

for (const tag of tags) {
  test(`every token in ${tag} survives unchanged in HEAD`, () => {
    const tagged = JSON.parse(git('show', `${tag}:spec.json`));
    const headById = new Map(head.tokens.map((token) => [token.id, token]));

    for (const was of tagged.tokens) {
      const now = headById.get(was.id);
      assert.ok(now, `token ${JSON.stringify(was.id)} from ${tag} was removed`);
      assert.equal(now.slot, was.slot, `token ${was.id}: slot changed since ${tag}`);
      assert.equal(now.meaning, was.meaning, `token ${was.id}: meaning changed since ${tag}`);
      assert.equal(now.since, was.since, `token ${was.id}: since changed since ${tag}`);
      if (was.deprecated === null) {
        assert.ok(
          now.deprecated === null || typeof now.deprecated === 'object',
          `token ${was.id}: deprecated must be null or an object`,
        );
      } else {
        assert.deepEqual(now.deprecated, was.deprecated, `token ${was.id}: deprecated changed since ${tag}`);
      }
    }

    const wasLevels = levelIds(tagged);
    const nowLevels = levelIds(head);
    assert.deepEqual(
      nowLevels.slice(0, wasLevels.length),
      wasLevels,
      `levels in HEAD do not start with the levels of ${tag}, in order`,
    );

    assert.ok(
      compareVersions(head.version, tagged.version) >= 0,
      `spec version went backwards: ${tagged.version} at ${tag}, ${head.version} at HEAD`,
    );
  });
}
