// The release workflow publishes a pushed v* tag through scripts/release-notes.mjs, which refuses a
// draft entry and a stale citation.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { parseTag, releaseNotes } from '../scripts/release-notes.mjs';
import { readText, root } from './lib/spec.mjs';

const changelog = readText('CHANGELOG.md');
const citation = readText('CITATION.cff');
const workflow = readText('.github/workflows/release.yml');

const SAMPLE = '# Changelog\n\n## 1.3 (draft, 2026-11-20, not released)\n\nDraft notes.\n\n## 1.2 (2026-10-30)\n\nNotes for 1.2.\n\n## 1.0.2 (2026-10-26)\n\nA patch.\n\n## 1.0 (2026-10-20)\n\nFirst.\n';
const cff = (version) => `version: "${version}"\n`;

test('a released entry with a matching citation gives its notes', () => {
  assert.deepEqual(releaseNotes('v1.2.0', SAMPLE, cff('1.2')), { notes: 'Notes for 1.2.' });
  assert.deepEqual(releaseNotes('v1.0.2', SAMPLE, cff('1.0')), { notes: 'A patch.' }, 'a patch tag keeps the cited version');
  assert.deepEqual(releaseNotes('v1.0.0', SAMPLE, cff('1.0')), { notes: 'First.' }, '1.0.0 is listed as 1.0');
});

test('a tag for a draft entry is refused, whatever the citation says', () => {
  assert.match(releaseNotes('v1.3.0', SAMPLE, cff('1.2')).problem, /still a draft/);
  assert.match(releaseNotes('v1.3.0', SAMPLE, cff('1.3')).problem, /still a draft/);
  assert.match(releaseNotes('v1.3.0', SAMPLE.replace('draft, 2026-11-20, not released', '2026-11-21, not released'), cff('1.3')).problem, /still a draft/);
});

test('a tag the citation has not caught up with is refused', () => {
  const released = SAMPLE.replace('(draft, 2026-11-20, not released)', '(2026-11-21)');
  assert.match(releaseNotes('v1.3.0', released, cff('1.2')).problem, /stale citation/);
  assert.deepEqual(releaseNotes('v1.3.0', released, cff('1.3')), { notes: 'Draft notes.' });
});

test('a tag with no entry, and a malformed tag, are errors', () => {
  assert.match(releaseNotes('v1.4.0', SAMPLE, cff('1.4')).problem, /no CHANGELOG entry/);
  assert.match(releaseNotes('v1.1.0', SAMPLE, cff('1.1')).problem, /no CHANGELOG entry/, '1.1 does not match 1.0.2 or 1.0');
  for (const tag of ['1.3.0', 'v1', 'vnext', undefined]) assert.throws(() => parseTag(tag), /not a release tag/);
});

test('in this repository, the draft version cannot be released and the cited one can', () => {
  const draft = /^## (\d+\.\d+) \(draft/m.exec(changelog)?.[1];
  const cited = /^version: "(\d+\.\d+)"$/m.exec(citation)?.[1];
  assert.ok(cited, 'CITATION.cff names a version');
  const run = (tag) => spawnSync(process.execPath, [path.join(root, 'scripts/release-notes.mjs'), tag], { encoding: 'utf8' });
  const good = run(`v${cited}.0`);
  assert.equal(good.status, 0, good.stderr);
  assert.ok(good.stdout.trim().length > 0, 'the notes are printed');
  if (draft) {
    const refused = run(`v${draft}.0`);
    assert.equal(refused.status, 1);
    assert.match(refused.stderr, /still a draft/);
  }
  assert.equal(run('nonsense').status, 2);
});

test('the release workflow takes its notes from the script', () => {
  assert.ok(workflow.includes('node scripts/release-notes.mjs "$GITHUB_REF_NAME" > notes.md'), 'release.yml runs the script');
  assert.ok(!workflow.includes('awk'), 'the unguarded awk is gone');
});
