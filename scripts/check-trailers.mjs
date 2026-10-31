#!/usr/bin/env node
// Checks the form of every AI-Use line on the commits in a range. It says nothing about whether a
// tag is true, and a commit with no AI-Use line passes, because no tag means nothing is claimed.
//
//   node scripts/check-trailers.mjs --range <base>..<head>
//
// Exit 0 when the range has commits and every tag is well formed. Exit 1 on a bad tag, an empty
// range or a git error. Exit 2 on a missing or malformed --range.
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readJson, tokenize } from '../test/lib/spec.mjs';

// Loose on purpose: "ai-use:" and "AI_Use:" are read as tags, so checkTag can reject them.
// Only column 0 counts, so a commit message can quote a tag by indenting it.
const KEY = /^ai[-_]use\s*:/i;

export function tagLines(message) {
  return message
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => KEY.test(line));
}

// The levels that take a Door, read from the door slot in spec.json.
export function doorLevels(spec) {
  const levels = spec.slots.find((slot) => slot.id === 'door')?.required.match(/L\d+/g);
  if (!levels) throw new Error('spec.json: the door slot names no levels');
  return levels;
}

// The lowest level that takes a Tool, read from the tool slot in spec.json ("at L1 and above").
export function toolFloor(spec) {
  const floor = spec.slots.find((slot) => slot.id === 'tool')?.required.match(/^at (L\d+) and above$/)?.[1];
  if (!floor) throw new Error('spec.json: the tool slot names no lowest level');
  return floor;
}

// The one tag a level below the tool floor can be, read from machineForm.level0 in spec.json.
// It is the level token alone: no Hand, Door, flag or Tool.
export function bareForm(spec) {
  const form = spec.machineForm?.level0;
  if (typeof form !== 'string') throw new Error('spec.json: machineForm.level0 is missing');
  const parsed = tokenize(form, spec);
  if (parsed.tokens.length !== 1 || parsed.tool !== null) {
    throw new Error(`spec.json: machineForm.level0 is not a level token alone: ${JSON.stringify(form)}`);
  }
  return parsed.tokens[0];
}

function levelNumber(id) {
  return Number(/^L(\d+)$/.exec(id)[1]);
}

const SLOT_NAMES = { hand: 'Hand', door: 'Door', flag: 'flag', tool: 'Tool' };

// Returns what is wrong with one machine-form tag. An empty list means it is well formed.
export function checkTag(line, spec) {
  let parsed;
  try {
    parsed = tokenize(line, spec);
  } catch (error) {
    return [error.message];
  }
  const problems = [];
  const slotOf = new Map(spec.tokens.map((token) => [token.id, token.slot]));
  const orderOf = new Map(spec.slots.map((slot) => [slot.id, slot.order]));
  const bySlot = new Map();
  for (const id of parsed.tokens) {
    const slot = slotOf.get(id);
    bySlot.set(slot, [...(bySlot.get(slot) ?? []), id]);
  }
  for (const [slot, ids] of bySlot) {
    if (ids.length > 1) problems.push(`2 ${slot} tokens: ${ids.join(' and ')}`);
  }
  const orders = parsed.tokens.map((id) => orderOf.get(slotOf.get(id)));
  if (orders.some((order, i) => i > 0 && order < orders[i - 1])) {
    problems.push(`the slots are out of order: ${parsed.tokens.join(' ')}`);
  }
  const levels = bySlot.get('level') ?? [];
  if (levels.length === 0) problems.push('no level token');
  if (levels.length === 1) {
    const needsDoor = doorLevels(spec).includes(levels[0]);
    const hasDoor = bySlot.has('door');
    if (needsDoor && !hasDoor) problems.push(`${levels[0]} needs a Door (undo or no undo)`);
    if (!needsDoor && hasDoor) problems.push(`${levels[0]} takes no Door`);
    const needsTool = levelNumber(levels[0]) >= levelNumber(toolFloor(spec));
    const hasTool = parsed.tool !== null;
    if (needsTool && !hasTool) problems.push(`${levels[0]} needs a Tool in parentheses`);
    if (!needsTool && hasTool) problems.push(`${levels[0]} takes no Tool`);
    if (levels[0] === bareForm(spec)) {
      // The whole tag is the level token (spec.json machineForm.level0). Door is reported above.
      for (const slot of [...bySlot.keys()].filter((s) => s !== 'level' && s !== 'door')) {
        problems.push(`${levels[0]} takes no ${SLOT_NAMES[slot] ?? slot}`);
      }
    }
  }
  return problems;
}

function commitsIn(range) {
  return execFileSync('git', ['log', '--format=%H%x00%B%x1e', range], {
    encoding: 'utf8',
    maxBuffer: 1 << 28,
  })
    .split('\x1e')
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [sha, message] = record.split('\0');
      return { sha, message };
    });
}

function main(argv) {
  const at = argv.indexOf('--range');
  const range = at === -1 ? undefined : argv[at + 1];
  if (!range || !/^[^-\s.]\S*\.\.[^\s.]\S*$/.test(range)) {
    console.error('check-trailers: --range <base>..<head> is required');
    return 2;
  }
  let commits;
  try {
    commits = commitsIn(range);
  } catch (error) {
    console.error(`check-trailers: git could not read ${range}: ${error.message.split('\n')[0]}`);
    return 1;
  }
  if (commits.length === 0) {
    console.error(`check-trailers: no commits in ${range}, so nothing was checked`);
    return 1;
  }
  const spec = readJson('spec.json');
  let tags = 0;
  let bad = 0;
  for (const { sha, message } of commits) {
    for (const line of tagLines(message)) {
      tags += 1;
      const problems = checkTag(line, spec);
      if (problems.length > 0) {
        bad += 1;
        console.error(`${sha.slice(0, 9)} ${line}\n  ${problems.join('\n  ')}`);
      }
    }
  }
  console.log(`check-trailers: ${commits.length} commit(s), ${tags} tag(s), ${bad} bad`);
  return bad === 0 ? 0 : 1;
}

if (realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
