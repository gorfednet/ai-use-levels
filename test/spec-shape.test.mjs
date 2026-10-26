// The shape of spec.json and examples/examples.json.
import test from 'node:test';
import assert from 'node:assert/strict';
import { compareVersions, parseVersion, readJson, tokenise } from './lib/spec.mjs';

const spec = readJson('spec.json');
const examples = readJson('examples/examples.json');

const REQUIRED_VALUES = new Set(['always', 'recommended', 'at L2 and L3', 'when true']);

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
  assert.equal(typeof spec.machineForm.versionToken, 'string');
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

test('every example machine string tokenises into known tokens plus a parenthesised tool', () => {
  assert.ok(Array.isArray(examples) && examples.length > 0, 'there are examples');
  const slotOf = new Map(spec.tokens.map((token) => [token.id, token.slot]));
  const orderOf = new Map(spec.slots.map((slot) => [slot.id, slot.order]));
  for (const example of examples) {
    for (const field of ['use', 'tag', 'machine']) {
      assert.equal(typeof example[field], 'string', `example ${JSON.stringify(example)}: ${field}`);
    }
    const parsed = tokenise(example.machine, spec);
    const slots = parsed.tokens.map((id) => slotOf.get(id));
    assert.equal(slots[0], 'level', `${example.machine}: first token is a level`);
    assert.equal(new Set(slots).size, slots.length, `${example.machine}: one token per slot`);
    const orders = slots.map((slot) => orderOf.get(slot));
    assert.deepEqual(orders, [...orders].sort((a, b) => a - b), `${example.machine}: slot order`);
    if (slots.includes('door')) {
      assert.ok(['L2', 'L3'].includes(parsed.tokens[0]), `${example.machine}: a door only at L2 or L3`);
    }
    assert.equal(parsed.version, null, `${example.machine}: a 1.x tag carries no version token`);
  }
});
