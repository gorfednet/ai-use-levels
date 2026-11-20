// The shape of spec.json and examples/examples.json.
import test from 'node:test';
import assert from 'node:assert/strict';
import { REQUIRED_VALUES, compareVersions, parseVersion, readJson, readText, tokenize } from './lib/spec.mjs';

const spec = readJson('spec.json');
const examples = readJson('examples/examples.json');

test('spec.json has its top-level fields', () => {
  assert.equal(spec.name, 'AI Use Levels');
  assert.doesNotThrow(() => parseVersion(spec.version), 'version is dotted integers');
  assert.match(spec.canonical, /^https:\/\/[^\s]+\/$/, 'canonical is an https URL ending in /');
  assert.equal(spec.licence, 'CC-BY-4.0');
  assert.equal(typeof spec.absence, 'string');
  assert.ok(spec.absence.length > 0, 'absence is stated');
  assert.equal(spec.machineForm.trailer, 'AI-Use');
  assert.equal(typeof spec.machineForm.pattern, 'string');
  assert.ok(spec.machineForm.pattern.startsWith('AI-Use: '), 'pattern starts with the trailer');
  assert.ok(spec.machineForm.pattern.includes('[(<tool>)]'), 'the tool is optional in the pattern');
  assert.equal(typeof spec.machineForm.versionToken, 'string');
});

test('machineForm.level0 is the lowest level token alone, with no tool', () => {
  const lowest = spec.tokens.find((token) => token.slot === 'level');
  const bare = tokenize(spec.machineForm.level0, spec);
  assert.deepEqual(bare.tokens, [lowest.id], 'level0 is one token, the lowest level');
  assert.equal(bare.tool, null, 'level0 has no tool');
  assert.equal(bare.version, null, 'level0 has no version token');
});

test('slots have id, order and required; the tool slot is free with a reach list', () => {
  assert.ok(Array.isArray(spec.slots) && spec.slots.length > 0);
  const orders = spec.slots.map((slot) => slot.order);
  assert.deepEqual(orders, spec.slots.map((_, i) => i + 1), 'orders are 1..n in file order');
  for (const slot of spec.slots) {
    assert.equal(typeof slot.id, 'string', 'slot id is a string');
    assert.ok(REQUIRED_VALUES.has(slot.required), `slot ${slot.id}: unknown required value ${slot.required}`);
  }
  const tool = spec.slots.at(-1);
  assert.equal(tool.id, 'tool', 'the tool slot is last');
  assert.equal(tool.required, 'at L1 and above', 'the tool is left out at L0 only');
  assert.equal(tool.free, true);
  assert.ok(Array.isArray(tool.reach) && tool.reach.length > 0, 'tool reach is a non-empty list');
  for (const slot of spec.slots.slice(0, -1)) {
    assert.notEqual(slot.free, true, `slot ${slot.id} is a closed vocabulary`);
  }
});

test('tokens have their fields, belong to a closed slot, and since <= version', () => {
  assert.ok(Array.isArray(spec.tokens) && spec.tokens.length > 0);
  const closedSlots = new Set(spec.slots.filter((slot) => slot.free !== true).map((slot) => slot.id));
  for (const token of spec.tokens) {
    for (const field of ['id', 'slot', 'name', 'meaning', 'since']) {
      assert.equal(typeof token[field], 'string', `token ${token.id}: ${field} is a string`);
      assert.ok(token[field].length > 0, `token ${token.id}: ${field} is not empty`);
    }
    assert.ok(closedSlots.has(token.slot), `token ${token.id}: slot ${token.slot} is not a closed slot`);
    assert.ok(
      token.test === null || typeof token.test === 'string',
      `token ${token.id}: test is a string or null`,
    );
    assert.ok(
      compareVersions(token.since, spec.version) <= 0,
      `token ${token.id}: since ${token.since} is later than version ${spec.version}`,
    );
    if (token.deprecated !== null) {
      assert.equal(typeof token.deprecated.since, 'string', `token ${token.id}: deprecated.since`);
      assert.equal(typeof token.deprecated.replacedBy, 'string', `token ${token.id}: deprecated.replacedBy`);
    }
  }
  for (const slotId of closedSlots) {
    assert.ok(spec.tokens.some((token) => token.slot === slotId), `slot ${slotId} has at least one token`);
  }
});

test('every example machine string tokenizes into known tokens plus a parenthesized tool, except L0', () => {
  assert.ok(Array.isArray(examples) && examples.length > 0, 'there are examples');
  const slotOf = new Map(spec.tokens.map((token) => [token.id, token.slot]));
  const orderOf = new Map(spec.slots.map((slot) => [slot.id, slot.order]));
  const lowest = spec.tokens.find((token) => token.slot === 'level').id;
  assert.ok(examples.some((example) => example.machine === spec.machineForm.level0), 'the L0 example is present');
  for (const example of examples) {
    for (const field of ['use', 'tag', 'machine']) {
      assert.equal(typeof example[field], 'string', `example ${JSON.stringify(example)}: ${field}`);
    }
    const parsed = tokenize(example.machine, spec);
    const slots = parsed.tokens.map((id) => slotOf.get(id));
    assert.equal(slots[0], 'level', `${example.machine}: first token is a level`);
    if (parsed.tokens[0] === lowest) {
      assert.deepEqual(parsed.tokens, [lowest], `${example.machine}: L0 is the level token alone`);
      assert.equal(parsed.tool, null, `${example.machine}: L0 names no tool`);
      assert.equal(example.tag, lowest, `${example.machine}: the human form of L0 is the level alone`);
    } else {
      assert.ok(typeof parsed.tool === 'string' && parsed.tool.length > 0, `${example.machine}: names a tool`);
    }
    assert.equal(new Set(slots).size, slots.length, `${example.machine}: one token per slot`);
    const orders = slots.map((slot) => orderOf.get(slot));
    assert.deepEqual(orders, [...orders].sort((a, b) => a - b), `${example.machine}: slot order`);
    if (slots.includes('door')) {
      assert.ok(['L2', 'L3'].includes(parsed.tokens[0]), `${example.machine}: a door only at L2 or L3`);
    }
    assert.equal(parsed.version, null, `${example.machine}: a 1.x tag carries no version token`);
  }
});

// The version CITATION.cff has to cite, read from a changelog: the major.minor of the first
// "## <version> (<date>)" heading that isn't marked draft, with the date of that minor's own
// heading. A patch entry such as "## 1.2.1" doesn't move the cited version or its date, which is
// what scripts/release-notes.mjs asks of a patch tag. A draft is cited only once it is released.
function released(changelog) {
  const headings = changelog
    .split('\n')
    .map((line) => /^## (\d+(?:\.\d+)*) \((.+)\)$/.exec(line))
    .filter((match) => match && !/draft|not released/i.test(match[2]))
    .map((match) => ({ version: match[1], date: match[2] }));
  if (headings.length === 0) throw new Error('the changelog lists no released version');
  const version = parseVersion(headings[0].version).slice(0, 2).join('.');
  const own = headings.find((heading) => heading.version === version);
  if (!own) throw new Error(`the changelog has no heading for ${version} itself`);
  return own;
}

test('a patch entry leaves the cited version and its date where the minor put them', () => {
  const log = (...headings) => headings.map((heading) => `## ${heading}\n\nNotes.\n`).join('\n');
  assert.deepEqual(released(log('1.3 (draft, 2026-11-20, not released)', '1.2 (2026-10-30)')), { version: '1.2', date: '2026-10-30' });
  assert.deepEqual(released(log('1.2.1 (2026-11-21)', '1.2 (2026-10-30)')), { version: '1.2', date: '2026-10-30' });
  assert.deepEqual(released(log('1.3 (draft)', '1.2.1 (2026-11-21)', '1.2 (2026-10-30)', '1.1.6 (2026-10-28)')), { version: '1.2', date: '2026-10-30' });
  assert.deepEqual(released(log('1.3 (2026-11-21)', '1.2.1 (2026-11-21)', '1.2 (2026-10-30)')), { version: '1.3', date: '2026-11-21' });
  assert.throws(() => released(log('1.3 (draft)')), /no released version/);
  assert.throws(() => released(log('1.2.1 (2026-11-21)', '1.1 (2026-10-25)')), /no heading for 1\.2 itself/);
});

test('CITATION.cff cites the newest released version, with its date', () => {
  const cff = readText('CITATION.cff');
  const { version, date } = released(readText('CHANGELOG.md'));
  assert.ok(compareVersions(version, readJson('spec.json').version) <= 0, 'a released version is not newer than spec.json');
  assert.ok(cff.includes(`version: "${version}"`), `CITATION.cff does not name version ${version}`);
  assert.ok(cff.includes(`/ai-use-levels/${version}/`), `CITATION.cff does not link version ${version}`);
  assert.ok(cff.includes(`date-released: "${date}"`), `CITATION.cff does not carry the release date ${date}`);
});
