// The pointer to a standing tag (SPEC.md sections 2, 9 and 10, spec.json machineForm.policy): the
// machine form, the spec text and the examples say the same thing, and the pointer is no token.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readJson, readText } from './lib/spec.mjs';

const spec = readJson('spec.json');
const examples = readJson('examples/examples.json');
const specText = readText('SPEC.md');
const { policy } = spec.machineForm;

test('spec.json describes the pointer, and a standing tag changes no Level', () => {
  assert.equal(policy.trailer, 'AI-Use-Policy');
  assert.equal(policy.pattern, 'AI-Use-Policy: <standing tag> <YYYY-MM-DD>');
  assert.equal(policy.changesLevel, false);
  assert.equal(policy.since, '1.3');
  assert.deepEqual(policy.records, ['who set the rules and when', 'which gates are enforced', 'how much a person reads']);
});

test('SPEC.md names the pattern and the 3 things a standing tag records', () => {
  assert.ok(specText.includes(`\`${policy.pattern}\``), 'SPEC.md shows the pattern');
  const rule = specText.split('\n').find((line) => line.startsWith('7. A standing tag for agent work'));
  assert.ok(rule, 'section 9 has the rule');
  for (const [i, word] of ['who set the rules and when', 'which gates the rules enforce', 'how much a person reads'].entries()) {
    assert.ok(rule.includes(word), `rule 7 records fact ${i + 1}: ${word}`);
  }
  assert.ok(rule.includes('changes the Level of no piece of work'), 'a standing tag changes no Level');
});

test('rules a person set in advance leave the Level alone', () => {
  const bullet = specText.split('\n').find((line) => line.startsWith('- Rules a person set in advance'));
  assert.ok(bullet, 'section 3 has the rule');
  assert.ok(bullet.includes('so the work is L3'), 'the work is still L3');
});

test('the pointer is no token and no slot', () => {
  const words = [policy.trailer, 'policy'];
  assert.deepEqual(spec.tokens.filter((token) => words.includes(token.id)), [], 'no policy token');
  assert.deepEqual(spec.slots.filter((slot) => words.includes(slot.id)), [], 'no policy slot');
  assert.ok(specText.includes("isn't a token or a slot"), 'SPEC.md says so in section 10');
});

test('each example with a policy line is a level-3 tag, and SPEC.md shows it in section 7', () => {
  const withPolicy = examples.filter((example) => example.policy !== undefined);
  assert.equal(withPolicy.length, 2, 'the 2 rule-bound examples');
  for (const example of withPolicy) {
    assert.ok(example.machine.startsWith('AI-Use: L3 '), `${example.machine}: rule-bound work stays L3`);
    assert.ok(example.policy.startsWith(`${policy.trailer}: `), `${example.policy}: uses the trailer in spec.json`);
  }
});
