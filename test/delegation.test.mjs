// Delegated confirmation (SPEC.md section 3, spec.json "confirmation"): the machine form, the spec
// text and the agent note say the same thing.
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkStanding } from '../scripts/check-trailers.mjs';
import { readJson, readText } from './lib/spec.mjs';

const spec = readJson('spec.json');
const specText = readText('SPEC.md');
const forAgents = readText('docs/for-agents.md');

const delegation = readText('docs/delegation.md');

// The delegation statement of 18 November 2026, quoted in SPEC.md section 9, in for-agents.md and
// in docs/delegation.md, where a reader of a tag can open it.
const STATEMENT = "I'm accountable for the `AI-Use` tags on commits in the gorfednet repositories. Agents write those tags themselves, and I don't confirm each one. I can correct any tag later.";
const POINTER = 'AI-Use-Standing: https://github.com/gorfednet/ai-use-levels/blob/main/docs/delegation.md 2026-11-18';

test('spec.json says who confirms a tag, and when delegation arrived', () => {
  const { confirmation } = spec;
  assert.equal(confirmation.since, '1.3');
  assert.ok(confirmation.delegation.includes('dated standing statement'), 'delegation is by a dated statement');
  assert.ok(confirmation.delegation.includes('accountable'), 'the person stays accountable');
  assert.deepEqual(confirmation.statementNames, ['date', 'accountable person', 'what it covers']);
  assert.ok(confirmation.statementPlace.includes('a reader of the tags can open it'), 'the statement is where a reader can open it');
  assert.equal(confirmation.underDelegation.length, 4);
  for (const word of ['unread unless it saw the person read', 'larger', 'higher', 'pointer to the delegation statement']) {
    assert.ok(confirmation.underDelegation.some((rule) => rule.includes(word)), `spec.json says: ${word}`);
  }
});

test('SPEC.md and docs/for-agents.md quote the same delegation statement', () => {
  // Each check runs from the opening quotation mark to the closing one, so a sentence added
  // anywhere inside the quote fails it.
  assert.ok(specText.includes(`: "Delegation, 18 November 2026. ${STATEMENT}" `), 'SPEC.md quotes the statement whole');
  assert.ok(forAgents.includes(`: "${STATEMENT}" `), 'for-agents.md quotes the statement whole');
  assert.ok(delegation.includes(`\n"Delegation, 18 November 2026. ${STATEMENT}"\n`), 'docs/delegation.md holds the statement whole');
});

test('the statement sits where a reader can open it, and each copy of the pointer is the same well-formed line', () => {
  const rule = specText.split('\n').find((line) => line.startsWith('6. A delegation of the confirmation'));
  assert.ok(rule, 'section 9 has the rule');
  assert.ok(rule.includes('It sits where a reader of the tags can open it'), 'a reader can open it');
  assert.ok(rule.includes("A copy in a rules file that only the person and their agents can read isn't enough"), 'a private rules file is not enough');
  assert.ok(rule.includes('[docs/delegation.md](docs/delegation.md)'), 'the worked example names its place');
  for (const [name, text] of [['SPEC.md', specText], ['for-agents.md', forAgents], ['docs/delegation.md', delegation]]) {
    assert.ok(text.includes(POINTER), `${name} shows the pointer`);
  }
  assert.deepEqual(checkStanding(POINTER, spec), []);
  assert.ok(POINTER.includes('/docs/delegation.md '), 'the pointer names the file that holds the statement');
});

test('the statement names its scope, and this repository is outside it', () => {
  // The exceptions stand beside the quote, never inside it: the quote is the owner's wording.
  const EXCEPTIONS = "it doesn't cover the ai-use-levels repository or papers.4thcltr.com";
  for (const [name, text] of [['SPEC.md', specText], ['for-agents.md', forAgents], ['docs/delegation.md', delegation]]) {
    assert.ok(text.includes(EXCEPTIONS), `${name} names the 2 exceptions`);
  }
  for (const file of ['CLAUDE.md', 'REVIEW.md']) {
    const text = readText(file);
    assert.ok(text.includes("doesn't cover this repository"), `${file} says the delegation does not cover this repository`);
    assert.ok(!/unless the owner has confirmed that tag|has not confirmed/.test(text), `${file} dropped the 1.2 wording`);
  }
});

test('SPEC.md section 3 says what an agent writes under a delegation', () => {
  const rule = specText.split('\n').find((line) => line.startsWith('- A tag written under a delegation follows'));
  assert.ok(rule, 'section 3 has the rule');
  assert.ok(rule.includes('It writes `unread` unless it saw the person read the result'), 'unread unless seen');
  assert.ok(rule.includes('between 2 Hand rungs it takes the larger, and between 2 Levels the higher'), 'larger Hand, higher Level');
  assert.ok(rule.includes('carries a pointer to the delegation statement'), 'the pointer');
  assert.ok(rule.includes("it doesn't mark the tag as delegated"), 'the pointer alone does not say delegated');
  assert.ok(!/can tell it from a tag a person confirmed|pointer says the confirmation was delegated/.test(specText), 'no claim that the pointer marks a delegated tag');
});

test('SPEC.md section 3 keeps the delegation apart from a yes to a change', () => {
  const rule = specText.split('\n').find((line) => line.startsWith('- The accountable person may delegate'));
  assert.ok(rule, 'section 3 has the delegation rule');
  assert.ok(rule.includes("It isn't a yes to any change"), 'a delegation is not a yes');
  assert.ok(rule.includes('a standing instruction to act is still L3'), 'a standing instruction is still L3');
  assert.ok(rule.includes('A model never confirms its own tag'), 'a model does not confirm its own tag');
});

test('docs/for-agents.md tells an agent to check the statement before it writes a tag', () => {
  for (const check of ["It's dated", 'It covers this work', 'it sits where a reader of your tag can open it']) {
    assert.ok(forAgents.includes(check), `for-agents.md says: ${check}`);
  }
});

test('docs/for-agents.md no longer leaves Hand and unread to the person under a delegation', () => {
  assert.ok(!forAgents.includes('for the person to fill in'), 'the 1.2 wording is gone');
  assert.ok(forAgents.includes('Write it unless you saw the person read the result'), 'unread');
  assert.ok(forAgents.includes("If you're unsure between 2 rungs, write the larger"), 'Hand');
  assert.ok(forAgents.includes("If you're unsure between 2 levels, write the higher"), 'Level');
  assert.ok(forAgents.includes('Under a delegation you always write it'), 'the pointer');
});
