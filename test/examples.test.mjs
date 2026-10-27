// examples/examples.json and SPEC.md Worked examples carry the same worked examples.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readJson, readText } from './lib/spec.mjs';

const examples = readJson('examples/examples.json');
const spec = readText('SPEC.md');

function section(markdown, title) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => /^## \d+\. /.test(line) && line.replace(/^## \d+\. /, '') === title);
  if (start === -1) throw new Error(`SPEC.md has no section titled ${title}`);
  let end = lines.findIndex((line, i) => i > start && line.startsWith('## '));
  if (end === -1) end = lines.length;
  return lines.slice(start, end).join('\n');
}

const nine = section(spec, 'Worked examples');

test('every example tag appears in SPEC.md Worked examples', () => {
  assert.ok(examples.length > 0, 'there are examples');
  for (const example of examples) {
    assert.ok(
      nine.includes(`\`${example.tag}\``),
      `tag ${JSON.stringify(example.tag)} is not in SPEC.md Worked examples`,
    );
  }
});

test('SPEC.md Worked examples has exactly as many table rows as there are examples', () => {
  const rows = nine
    .split('\n')
    .filter((line) => line.startsWith('| ') && !line.startsWith('| Use ') && !line.startsWith('|---'));
  assert.equal(rows.length, examples.length, 'row count equals example count');
  for (const example of examples) {
    assert.ok(
      rows.some((row) => row.includes(`| ${example.use} |`)),
      `use ${JSON.stringify(example.use)} is not a row in SPEC.md Worked examples`,
    );
  }
});
