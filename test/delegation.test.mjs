// Delegated confirmation (SPEC.md section 3, spec.json "confirmation"): the machine form, the spec
// text and the agent note say the same thing.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readJson, readText } from './lib/spec.mjs';

const spec = readJson('spec.json');
const specText = readText('SPEC.md');
const forAgents = readText('docs/for-agents.md');

// The delegation statement of 18 November 2026, quoted in SPEC.md section 9 and in for-agents.md.
const STATEMENT = "Agents write those tags themselves, and I don't confirm each one. I can correct any tag later.";

test('spec.json says who confirms a tag, and when delegation arrived', () => {
  const { confirmation } = spec;
  assert.equal(confirmation.since, '1.3');
  assert.ok(confirmation.delegation.includes('dated standing statement'), 'delegation is by a dated statement');
  assert.ok(confirmation.delegation.includes('accountable'), 'the person stays accountable');
  assert.deepEqual(confirmation.statementNames, ['date', 'accountable person', 'what it covers']);
});

test('SPEC.md and docs/for-agents.md quote the same delegation statement', () => {
  assert.ok(specText.includes(STATEMENT), 'SPEC.md quotes the statement');
  assert.ok(forAgents.includes(STATEMENT), 'for-agents.md quotes the statement');
});

test('SPEC.md section 3 keeps the delegation apart from a yes to a change', () => {
  const rule = specText.split('\n').find((line) => line.startsWith('- The accountable person may delegate'));
  assert.ok(rule, 'section 3 has the delegation rule');
  assert.ok(rule.includes("It isn't a yes to any change"), 'a delegation is not a yes');
  assert.ok(rule.includes('a standing instruction to act is still L3'), 'a standing instruction is still L3');
  assert.ok(rule.includes('A model never confirms its own tag'), 'a model does not confirm its own tag');
});

test('docs/for-agents.md tells an agent to check the statement before it writes a tag', () => {
  for (const check of ["It's dated", 'It covers this work', 'in a place they keep their own rules']) {
    assert.ok(forAgents.includes(check), `for-agents.md says: ${check}`);
  }
});
