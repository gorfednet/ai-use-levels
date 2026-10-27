// Section 8: every level has a mark with a name, a spoken form, braille and both SVG files.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readJson, root } from './lib/spec.mjs';

const spec = readJson('spec.json');
const levels = spec.tokens.filter((token) => token.slot === 'level');

test('every level has exactly one mark, and every mark names a level', () => {
  assert.ok(Array.isArray(spec.marks), 'spec.json has a marks array');
  assert.deepEqual(
    spec.marks.map((mark) => mark.level),
    levels.map((level) => level.id),
    'marks follow the level tokens one for one, in order',
  );
});

for (const level of levels) {
  test(`${level.id} mark has a name, spoken form, braille and SVGs with a title`, () => {
    const mark = spec.marks.find((m) => m.level === level.id);
    assert.ok(mark, `${level.id} has no mark`);
    assert.match(mark.name, /^AI USE LEVEL [A-Z]+ SYMBOL$/);
    assert.ok(mark.spoken.endsWith(`, ${level.name}`), `${level.id} spoken form ends with its level name`);
    assert.match(mark.braille, /^[⠀-⣿]+$/, `${level.id} braille is Unicode braille cells`);
    for (const variant of ['light', 'dark']) {
      const file = mark.files?.[variant];
      assert.ok(file, `${level.id} has no ${variant} file`);
      const path = join(root, file);
      assert.ok(existsSync(path), `${file} is missing`);
      const svg = readFileSync(path, 'utf8');
      const title = /<title[^>]*>([^<]+)<\/title>/.exec(svg)?.[1];
      assert.equal(title, `AI use level ${level.id.slice(1)}, ${level.name}`, `${file} title`);
    }
  });
}

// Uncontracted UEB: capital sign, letters, number sign then digits a-j = 1-0.
const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const CELLS = '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵';
function decode(braille) {
  let out = '';
  let capital = false;
  let numeric = false;
  for (const cell of braille) {
    if (cell === '⠠') { capital = true; numeric = false; continue; }
    if (cell === '⠼') { numeric = true; continue; }
    const i = CELLS.indexOf(cell);
    assert.ok(i !== -1, `unknown cell ${cell} in ${braille}`);
    if (numeric) {
      assert.ok(i < 10, `${cell} is not a digit in ${braille}`);
      out += String((i + 1) % 10);
    } else {
      out += capital ? LETTERS[i].toUpperCase() : LETTERS[i];
      capital = false;
    }
  }
  return out;
}

for (const level of levels) {
  test(`${level.id} braille spells the token and brailleName spells the name`, () => {
    const mark = spec.marks.find((m) => m.level === level.id);
    assert.equal(decode(mark.braille), level.id);
    assert.equal(decode(mark.brailleName), level.name);
  });
}
