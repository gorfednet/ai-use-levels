// spec.schema.json: spec.json fits it, broken copies do not, and it agrees with the hand-written
// shape tests where the two say the same thing.
import test from 'node:test';
import assert from 'node:assert/strict';
import Ajv2020 from 'ajv/dist/2020.js';
import { REQUIRED_VALUES, readJson } from './lib/spec.mjs';

const schema = readJson('spec.schema.json');
const spec = readJson('spec.json');

const ajv = new Ajv2020({ allErrors: true, strict: true });
const validate = ajv.compile(schema);

// A deep copy of spec.json for a test to break.
const copy = () => structuredClone(spec);

function errors(instance) {
  validate(instance);
  return (validate.errors ?? []).map((e) => `${e.instancePath || '/'} ${e.message}`);
}

test('spec.schema.json is draft 2020-12 with the tagged $id and a closed top level', () => {
  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(schema.$id, 'https://github.com/gorfednet/ai-use-levels/blob/v1.2.0/spec.schema.json');
  assert.equal(schema.additionalProperties, false, 'unknown top-level keys are rejected');
  assert.deepEqual(
    new Set(schema.$defs.slot.properties.required.enum),
    REQUIRED_VALUES,
    'the schema and spec-shape agree on the required values',
  );
});

test('spec.json validates against spec.schema.json', () => {
  assert.deepEqual(errors(spec), [], 'spec.json has no schema errors');
});

const broken = [
  ['an unknown top-level key', (s) => { s.colour = 'blue'; }, /must NOT have additional properties/],
  ['a missing top-level key', (s) => { delete s.marksStatus; }, /required property 'marksStatus'/],
  ['a version that is not dotted integers', (s) => { s.version = '1.2-rc1'; }, /\/version must match pattern/],
  ['a slot with an unknown required value', (s) => { s.slots[1].required = 'sometimes'; }, /\/slots\/1\/required must be equal to one of the allowed values/],
  ['a slot with an unknown key', (s) => { s.slots[0].colour = 'blue'; }, /\/slots\/0 must NOT have additional properties/],
  ['a token with no since', (s) => { delete s.tokens[3].since; }, /\/tokens\/3 must have required property 'since'/],
  ['a token whose test is a number', (s) => { s.tokens[0].test = 0; }, /\/tokens\/0\/test must match exactly one schema/],
  ['a token with an empty meaning', (s) => { s.tokens[2].meaning = ''; }, /\/tokens\/2\/meaning must NOT have fewer than 1 characters/],
  ['a token deprecated without a replacement', (s) => { s.tokens[1].deprecated = { since: '1.3' }; }, /\/tokens\/1\/deprecated/],
  ['a mark whose braille is text', (s) => { s.marks[0].braille = 'L0'; }, /\/marks\/0\/braille must match pattern/],
  ['a mark missing its dark file', (s) => { delete s.marks[2].files.dark; }, /\/marks\/2\/files must have required property 'dark'/],
  ['a machine form without level0', (s) => { delete s.machineForm.level0; }, /\/machineForm must have required property 'level0'/],
  ['a level0 that names a tool', (s) => { s.machineForm.level0 = 'AI-Use: L0 (none)'; }, /\/machineForm\/level0 must match pattern/],
  ['a pattern with a required tool', (s) => { s.machineForm.pattern = 'AI-Use: <level> [hand] [door] [flag] (<tool>) [v<major>]'; }, /\/machineForm\/pattern must match pattern/],
];

for (const [what, mutate, expected] of broken) {
  test(`rejects ${what}`, () => {
    const s = copy();
    mutate(s);
    const found = errors(s);
    assert.ok(found.length > 0, 'at least one schema error');
    assert.match(found.join('\n'), expected);
  });
}
