#!/usr/bin/env node
// Prints the CHANGELOG.md entry for a pushed v* tag, for the release workflow. It refuses a tag the
// repository isn't ready for, so a release can't publish a draft or a stale citation.
//
//   node scripts/release-notes.mjs v1.3.0
//
// Exit 1 when CHANGELOG.md has no entry for the tag, when the entry's heading still says draft, or
// when CITATION.cff doesn't cite the tag's version. Exit 2 on a missing or malformed tag.
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readText } from '../test/lib/spec.mjs';

// "v1.3.0" -> { full: "1.3.0", short: "1.3", minor: "1.3" }. "1.0.0" is listed as "## 1.0", and a
// patch tag such as v1.0.2 has its own heading and leaves the cited version at 1.0.
export function parseTag(tag) {
  const match = /^v(\d+)\.(\d+)(?:\.(\d+))?$/.exec(tag ?? '');
  if (!match) throw new Error(`not a release tag: ${JSON.stringify(tag)}`);
  const full = tag.slice(1);
  return { full, short: full.replace(/\.0$/, ''), minor: `${match[1]}.${match[2]}` };
}

// Returns { notes } or { problem }. The heading is "## <version> (<date or status>)".
export function releaseNotes(tag, changelog, citation) {
  const { full, short, minor } = parseTag(tag);
  const lines = changelog.split('\n');
  const start = lines.findIndex((line) => {
    const version = /^## (\S+)/.exec(line)?.[1];
    return version === short || version === full;
  });
  if (start === -1) return { problem: `no CHANGELOG entry for ${tag}` };
  if (/draft|not released/i.test(lines[start])) {
    return { problem: `the CHANGELOG entry for ${tag} is still a draft: ${lines[start]}` };
  }
  if (!citation.includes(`version: "${minor}"`)) {
    return { problem: `CITATION.cff does not cite version ${minor}, so ${tag} would publish a stale citation` };
  }
  let end = lines.findIndex((line, i) => i > start && line.startsWith('## '));
  if (end === -1) end = lines.length;
  const notes = lines.slice(start + 1, end).join('\n').trim();
  if (notes.length === 0) return { problem: `the CHANGELOG entry for ${tag} is empty` };
  return { notes };
}

function main(argv) {
  let result;
  try {
    result = releaseNotes(argv[0], readText('CHANGELOG.md'), readText('CITATION.cff'));
  } catch (error) {
    console.error(`release-notes: ${error.message}`);
    return 2;
  }
  if (result.problem) {
    console.error(`release-notes: ${result.problem}`);
    return 1;
  }
  console.log(result.notes);
  return 0;
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
