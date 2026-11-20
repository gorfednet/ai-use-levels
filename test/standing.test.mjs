// The pointer to a standing statement (SPEC.md section 2, spec.json machineForm.standing): the
// machine form, the spec text and the examples say the same thing, and the pointer is no token.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readJson, readText } from './lib/spec.mjs';

const spec = readJson('spec.json');
const examples = readJson('examples/examples.json');
const specText = readText('SPEC.md');
const { standing } = spec.machineForm;

// SPEC.md section 2, from its heading to the next one.
const two = specText.slice(specText.indexOf('\n## 2. Syntax'), specText.indexOf('\n## 3. '));

test('spec.json describes the pointer, and it changes no Level', () => {
  assert.equal(standing.trailer, 'AI-Use-Standing');
  assert.equal(standing.pattern, 'AI-Use-Standing: <URL or path> <YYYY-MM-DD>');
  assert.ok(standing.target.includes('a reader of the tag can open'), 'the target is one a reader can open');
  assert.equal(standing.requiredWhen, 'the tag was written under a delegation');
  assert.equal(standing.changesLevel, false);
  assert.equal(standing.since, '1.3');
  assert.equal(standing.records, undefined, 'the rule-bound records are not part of 1.3');
});

test('SPEC.md section 2 gives every form of the pointer a target and a date', () => {
  assert.ok(two.length > 0, 'section 2 was found');
  assert.deepEqual(Object.keys(standing.forms), ['line', 'meta', 'text']);
  assert.equal(standing.forms.line, standing.pattern);
  for (const [name, form] of Object.entries(standing.forms)) {
    assert.ok(form.includes('<URL or path> <YYYY-MM-DD>'), `${name}: a target and a date`);
  }
  assert.ok(two.includes(`\`${standing.forms.line}\``), 'the line form');
  assert.ok(two.includes(`\`${standing.forms.meta}\``), 'the HTML form');
  assert.ok(two.includes('The word `standing`, the target and the date, after the tag'), 'the running-text form');
  assert.ok(two.includes('standing docs/ai-use.md 2026-09-01'), 'the running-text example has a path and a date');
  assert.ok(two.includes('always a target and a date'), 'never a phrase alone');
  assert.ok(!/under the standing tag of/.test(specText), 'no phrase pointer without a URL or path');
  assert.ok(!/short name/.test(specText), 'a short name is no target');
  assert.ok(!specText.includes('AI-Use-Policy'), 'the unpublished draft key is gone');
});

test('SPEC.md section 2 says what the target and the date are', () => {
  assert.ok(two.includes('a URL or a path that a reader of the tag can open'), 'a reader can open the target');
  assert.ok(two.includes('stays inside it'), 'a path stays inside the repository');
  assert.ok(two.includes("it's the date of the statement the tag relies on"), 'the date on a page with several statements');
  assert.ok(two.includes("that's the delegation's date"), 'the date under a delegation');
  assert.ok(standing.date.includes('the date of the one the tag relies on'), 'spec.json says the same');
  assert.ok(two.includes('A tag written under a delegation always carries the pointer'), 'a delegated tag carries it');
  assert.ok(two.includes('a tag takes at most 1'), 'at most 1');
});

test('the pointer is no token and no slot', () => {
  const words = [standing.trailer, 'standing', 'policy'];
  assert.deepEqual(spec.tokens.filter((token) => words.includes(token.id)), [], 'no standing token');
  assert.deepEqual(spec.slots.filter((slot) => words.includes(slot.id)), [], 'no standing slot');
  assert.ok(two.includes("The pointer isn't a token and has no slot"), 'SPEC.md says so in section 2');
});

test('the rule-bound standing tag of the first draft is not in 1.3', () => {
  for (const gone of ['Rules a person set in advance', 'inside human-set rules', "A layer above the tag isn't needed", 'which gates the rules enforce']) {
    assert.ok(!specText.includes(gone), `SPEC.md no longer says: ${gone}`);
  }
  assert.equal(examples.filter((example) => /rules I set|The same rules/.test(example.use)).length, 0, 'no rule-bound example');
});

test('the delegated example is unread and carries a pointer with a target and a date', () => {
  const withStanding = examples.filter((example) => example.standing !== undefined);
  assert.equal(withStanding.length, 1, 'the delegated example');
  assert.equal(examples.filter((example) => example.policy !== undefined).length, 0, 'no example keeps the draft key');
  const [delegated] = withStanding;
  assert.match(delegated.use, /under my delegation/);
  assert.ok(delegated.machine.includes(' unread '), 'the agent saw nobody read the result');
  assert.match(delegated.standing, /^AI-Use-Standing: \S+ \d{4}-\d{2}-\d{2}$/);
  const row = specText.split('\n').find((line) => line.includes(`| ${delegated.use} |`));
  assert.ok(row?.includes(`\`${delegated.standing}\``), 'SPEC.md section 7 shows the same pointer, not a phrase');
});
