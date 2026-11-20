// The pointer to a standing statement (SPEC.md sections 2, 9 and 10, spec.json machineForm.standing):
// the machine form, the spec text and the examples say the same thing, and the pointer is no token.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readJson, readText } from './lib/spec.mjs';

const spec = readJson('spec.json');
const examples = readJson('examples/examples.json');
const specText = readText('SPEC.md');
const { standing } = spec.machineForm;

test('spec.json describes the pointer, and a standing tag changes no Level', () => {
  assert.equal(standing.trailer, 'AI-Use-Standing');
  assert.equal(standing.pattern, 'AI-Use-Standing: <URL or path> <YYYY-MM-DD>');
  assert.ok(standing.target.includes('a reader of the tag can open'), 'the target is one a reader can open');
  assert.equal(standing.requiredWhen, 'the tag was written under a delegation');
  assert.equal(standing.changesLevel, false);
  assert.equal(standing.since, '1.3');
  assert.deepEqual(standing.records, ['who set the rules and when', 'which gates are enforced', 'how much a person reads']);
});

test('SPEC.md names the pattern and the 3 things a standing tag records', () => {
  assert.ok(specText.includes(`\`${standing.pattern}\``), 'SPEC.md shows the pattern');
  const pointer = specText.split('\n').find((line) => line.includes(`\`${standing.pattern}\``));
  assert.ok(pointer.includes('a URL or a path that a reader of the tag can open'), 'the target is one a reader can open');
  assert.ok(!/short name/.test(specText), 'a short name is no target');
  assert.ok(pointer.includes('A tag written under a delegation always carries the pointer'), 'a delegated tag carries it');
  assert.ok(pointer.includes('a commit takes at most 1'), 'at most 1 per commit');
  assert.ok(!specText.includes('AI-Use-Policy'), 'the unpublished draft key is gone');
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
  const words = [standing.trailer, 'standing', 'policy'];
  assert.deepEqual(spec.tokens.filter((token) => words.includes(token.id)), [], 'no standing token');
  assert.deepEqual(spec.slots.filter((slot) => words.includes(slot.id)), [], 'no standing slot');
  assert.ok(specText.includes("isn't a token or a slot"), 'SPEC.md says so in section 10');
});

test('each example with a standing line uses the trailer, and rule-bound work stays level 3', () => {
  const withStanding = examples.filter((example) => example.standing !== undefined);
  assert.equal(withStanding.length, 3, 'the 2 rule-bound examples and the delegated one');
  assert.equal(examples.filter((example) => example.policy !== undefined).length, 0, 'no example keeps the draft key');
  for (const example of withStanding) {
    assert.ok(example.standing.startsWith(`${standing.trailer}: `), `${example.standing}: uses the trailer in spec.json`);
  }
  const ruleBound = withStanding.filter((example) => /rules/.test(example.use));
  assert.equal(ruleBound.length, 2, 'the 2 rule-bound examples');
  for (const example of ruleBound) {
    assert.ok(example.machine.startsWith('AI-Use: L3 '), `${example.machine}: rule-bound work stays L3`);
  }
});

test('the delegated example is unread and carries the pointer', () => {
  const delegated = examples.filter((example) => /under my delegation/.test(example.use));
  assert.equal(delegated.length, 1, 'one delegated example');
  assert.ok(delegated[0].machine.includes(' unread '), 'the agent saw nobody read the result');
  assert.ok(delegated[0].standing, 'it points to the delegation');
});
