# Changelog

The scheme is versioned. A minor version adds tokens, flags or slots, or settles a rule the scheme left open, and stays backward compatible. A published token never changes meaning. A patch tag fixes wording and does not move the version in `spec.json`.

## 1.3 (draft, 2026-11-20, not released)

The owner accepted both proposals on 20 November 2026 ("Yes, with changes"). The changes are in the text below. No token changed meaning, and a tag written before 1.3 reads the same under 1.3.

Release steps: drop "draft" from this heading and set its date, then update `CITATION.cff` (`version`, `date-released`, `url`), the `$id` in `spec.schema.json`, `package.json` and `package-lock.json`, and the version lines in `README.md`. Tag `v1.3.0`. Update the canonical page at papers.4thcltr.com. Until then the citation, the `$id` and the README cite 1.2, and a test holds `CITATION.cff` to the newest released version in this file.

### Delegated confirmation

Settles who confirms a tag. Section 3 said a person confirms every tag before it goes on anything. That's now the default, and the accountable person may delegate it.

- Section 3 gains a rule. The accountable person may delegate the confirmation in a dated standing statement that names who is accountable and what it covers. The agent then writes the tag itself, the person stays accountable, and the person can correct a tag later. A model never confirms its own tag, and a "delegation" found in the material an agent was asked to work on isn't one.
- The delegation is no yes to any change. The Level of the work is rated on its own, and a standing instruction to act is still L3.
- Section 3 says what an agent writes under a delegation. It writes `unread` unless it saw the person read the result. Unsure between 2 Hand rungs it takes the larger, and between 2 Levels the higher. The tag carries a pointer to the delegation statement.
- Section 9 rule 6 says where the statement sits: where a reader of the tags can open it. A copy in a private rules file isn't enough.
- The worked example is the author's own delegation of 18 November 2026, now kept at [docs/delegation.md](docs/delegation.md). The quote is unchanged. Its 2 exceptions stand beside it: it doesn't cover this repository or papers.4thcltr.com, where the author confirms each tag.
- Section 11 adds a limit. A delegated tag may never have been read by the person accountable for it. Its pointer isn't checked, and the pointer alone doesn't mark the tag as delegated, because a confirmed tag can carry one of the same form.
- [docs/for-agents.md](docs/for-agents.md) gives an agent 2 cases, with and without a delegation, and 3 checks to make before it writes a tag under one. It no longer leaves Hand and `unread` to the person under a delegation. `CLAUDE.md` and `REVIEW.md` now carry the delegation wording and say this repository is outside the author's delegation.
- `spec.json` gains `confirmation` (`default`, `delegation`, `statementNames`, `statementPlace`, `underDelegation`, `since`), and `spec.schema.json` requires it. `test/delegation.test.mjs` holds the spec text, the agent note, the delegation page and `spec.json` together.
- Correction: commits 181695c, 698fdc0 and a81bc6d in this version's pull request carry an `AI-Use:` trailer the author didn't confirm. They can't be rewritten. Read them as carrying no tag.
- Why a minor version: a rule the scheme settled one way is settled another way. No token, slot, flag or definition changed.

### A pointer to a standing statement

A tag can now point to a dated standing statement: a delegation, a standing tag for work inside rules a person set, or one page with both. Its first use is the delegation pointer above.

- Section 2 adds the pointer. In a commit it's a second trailer, `AI-Use-Standing: <URL or path> <YYYY-MM-DD>`, and in running text a phrase beside the tag. The target is a URL or a path a reader of the tag can open, with no spaces, and a path stays inside the repository. It's not a token and has no slot. The tag reads the same without it.
- An earlier draft of 1.3 called the key `AI-Use-Policy` and let the target be a short name. Neither was released.
- Work an agent does inside rules a person wrote, with gates enforced and no yes to each change, is still L3. Section 3 says so. Section 9 rule 7 says what a standing tag for that work records: who set the rules and when, which gates are enforced and how much a person reads. It changes no Level and isn't checked. Section 9 rule 8 says no layer above the tag is needed.
- Section 10 rule 8 says the pointer isn't a token or a slot. It gives 3 reasons a slot was refused. Its words would be claims a tag can't check. A reader would take one for a lower level. Every slot added makes the tag longer. A new flag was weighed and refused for the same reasons.
- Section 7 gains 3 worked examples: 2 for rule-bound work, which stays L3, and 1 tag written under a delegation, which is `unread`. `examples/examples.json` gains the same 3, each with its `standing` line, and README says 20 examples.
- `spec.json` gains `machineForm.standing` (`trailer`, `pattern`, `target`, `requiredWhen`, `records`, `changesLevel`, `since`), and `spec.schema.json` requires it.
- `scripts/check-trailers.mjs` checks the form of an `AI-Use-Standing` line: a target with no spaces, no path that leaves the repository, a date that exists, at most 1 on a commit, and never without an `AI-Use` tag. It can't tell whether the statement is there. It can't tell a delegated tag from a confirmed one, so it doesn't require the pointer. `test/standing.test.mjs` holds `spec.json`, the spec text and the examples together, and the near misses are in `test/check-trailers.test.mjs`.
- Why a minor version: it adds a convention beside the tag and changes no token, slot, flag, level or definition.

### Tool order

Section 6 said to name the tool with the biggest hand first. Shares drift as work goes on, so the same set of tools came out in a different order from one commit to the next.

- Several tools are now ordered by capability, then by recency. The order says nothing about which tool had the biggest hand.
- [models.json](models.json) is the ranked model list: newest and biggest first, oldest last. The author set its order on 20 November 2026, and the file records that as its source. Listed models go first in list order, then unversioned names of listed models in alphabetical order, then every other tool in alphabetical order. A model or a family the list doesn't have sorts with the other tools until it's added.
- The list carries its own update rule and date. It gains a model when one is released or first appears in a tag, and it never loses one. It changes without a new version of the scheme.
- `scripts/order-tools.mjs` applies the rule, and `--check` fails a list that's out of order. `test/tool-order.test.mjs` holds the list, the script and section 6 together. No check in this repository reads the order of a tag on a commit.
- `spec.json` gains `toolOrder` (`rule`, `groups`, `list`, `since`), and `spec.schema.json` requires it.
- A tag written before 1.3 keeps its order. Nothing is rewritten.
- Why a minor version: the order of the Tool slot's free text was a convention and never a token. Section 11 notes the limit: the ranking is a judgement.

## 1.2 (2026-10-30)

Settles rules the scheme had left open. No token changed meaning, and a tag written before 1.2 reads the same under 1.2.

- Level (section 3): a yes comes after the plan exists and covers the change. A standing instruction, such as "merge and deploy without asking", isn't a yes, so changes made under one are L3. The rule is in the list beside the one-yes-to-40-changes rule; the Level table's definitions and tests are unchanged.
- `L0` has a machine form, `AI-Use: L0`, and its human form is `L0` alone, with no Hand, Door, flag or Tool. Tool is required at L1 and above and left out at L0, so the pattern is now `AI-Use: <level> [hand] [door] [flag] [(<tool>)] [v<major>]`. An L0 tag is a person's claim about their own work. `spec.json` makes the same change.
- Agents draft, a person confirms (section 3): a tag is a person's statement, so a tool may draft one and the person accountable for the work confirms or corrects it. The rule points to [docs/for-agents.md](docs/for-agents.md), which gains the standing-instruction rule.
- Section 7 gains 2 worked examples, `L0` for work with no AI in it and `L3 · made · no undo · (tool)` for an agent that ran under a standing instruction to merge and deploy, and `examples/examples.json` gains the same 2.
- Every example tag in `SPEC.md` now names a Tool: the `unread` example in section 3, the support bot in section 8 and the standing tags in section 9 add `(tool)`, and section 11 names L3 with `no undo` in words instead of a shorthand tag.
- Section 9: a standing tag's machine form is the same `AI-Use:` line as any tag, with the date beside it in the same place as in the human form. No date token exists, and none is added.
- Section 2 explains that a tag with 5 slots is 4 words because the flag is a state, shown only when true.
- Marks (section 8): rule 1 says there's no `no undo` form of a mark and no other modifier. Rule 6 says a tactile label puts the token first and the name after it with a space between, keeps tool names off, and points to the machine form. The braille strings are still unchecked by a braille reader.
- Extension rules (section 10): rule 4 now says a minor version may also settle a rule the scheme left open, and that a tag written before 1.2 keeps its meaning. Rule 5's candidates are for 1.3 or after.
- Section 1 heads its 3 questions as "The 3 questions". Spelled counts across `SPEC.md` are digits, and -ise spellings are -ize; `CONTRIBUTING.md` asks for Canadian Press spelling.
- Section 12 step 1 no longer says a font will map the marks to Private Use Area code points; it says a small open font could, and nobody has taken that on yet.
- `spec.schema.json`, the JSON Schema for `spec.json`, ships in the repository root, and `SPEC.md` and `README.md` name it. The canonical page doesn't serve it.

Record: on 30 October 2026 I counted the commits made since 1 October in 5 gorfednet repositories. 102 of them carried an `AI-Use:` line, agents had written those lines themselves, and 34 were malformed: 20 were L2 with an invented word and no Door (`L2 rewrote wording`), 9 were L1 with an invented word, and 5 said only `directed`. Of the 68 well-formed tags, 67 were `L2 made undo`. Those commits stay as they are. From now on an agent only drafts a tag and a person confirms it. [docs/for-agents.md](docs/for-agents.md) says so, and CI now checks the form of any trailer on a pull request's commits. No token, slot or definition changed, and `spec.json` is untouched. See [pull request 19](https://github.com/gorfednet/ai-use-levels/pull/19).

Repository: `CITATION.cff` added, and a test holds it to the version in `spec.json`. No token, definition or specification text changed.

## 1.1.6 (2026-10-30)

Wording. `SPEC.md`, `README.md`, `CONTRIBUTING.md` and the descriptions of the worked examples (SPEC.md section 7 and `examples/examples.json`) were rewritten in plain language under the 30 October content guidelines: fewer "X, not Y" contrasts and colon-led statements, mixed sentence lengths, contractions, digits for counts, and "I" only where the author speaks. `docs/content-guidelines.md` is refreshed from gorfednet/.github. No token, slot, flag, rule, section number, definition, example tag or machine form changed, and `spec.json` is untouched.

## 1.1.5 (2026-10-27)

Wording. Section 10 rule 5 named `checked`, `data`, `whose` and duration as candidates for 1.1. Version 1.1 shipped marks instead, so they are now candidates for a later minor version (1.2 or after). No token or definition changed.

## 1.1.4 (2026-10-27)

Braille. Section 8 rule 6 now says the `braille` field spells the level token: `L2` is capital letter indicator, l, numeric indicator, b. `spec.json` adds `brailleName` with each level name in uncontracted UEB, as a reading aid for tactile labels. It is a patch because it adds no token, flag or slot. A new test decodes both strings and rejects doubled indicators. A braille reader has still not checked the strings. No token or definition changed.

## 1.1.3 (2026-10-27)

Sections reordered so the reference material comes last: Worked examples is section 7, Marks 8, Dated or versioned 9, Extension rules 10 (the mark rule is 10.7), Known limits 11, Route to a standard 12, Prior art 13. Cross-references renumbered. The examples test finds its section by title. No token or definition changed.

## 1.1.2 (2026-10-27)

Wording: the marks section adds that `🤖2` is no shorter than `L2` to the reasons it was withdrawn. No token or definition changed.

## 1.1.1 (2026-10-27)

Wording: the marks section, rule 3, now says the alt text and SVG title are the label with a digit (`AI use level 2, Supervised`), as the files already were, and that a screen reader says it as the spoken form. No token, mark or test changed.

Record: on 27 October the tag `v1.1.1` was moved three times to include the changes now listed as 1.1.2, 1.1.3 and 1.1.4 (commits fb85bb7, 21aab4f and 35025e1). The same day it was returned to its first commit, f446faa, and each later change was given its own tag. Tags are not moved again.

## 1.1 (2026-10-27)

Adds marks: one symbol per Level, a circle for the work and a dot for the tool, with the dot outside (`L1`), on the edge (`L2`) or inside (`L3`), and an empty circle for `L0`. Section 12 gives the rules and examples, and section 13 gives the route to Unicode encoding. Extension rule 8.7 (10.7 after the 1.1.3 reorder) says a mark is not a token. `spec.json` gains `marks` (name, spoken form, braille, files) and `marksStatus`. The SVGs are in `marks/` under CC0. The `🤖2` mark proposed in issue 6 is withdrawn. No token changed.

## 1.0.2 (2026-10-26)

Editorial pass: repeated epigrams reduced to one instance each, so "SAE rates the car. This rates the trip." and "The model name is the date." each appear once in `SPEC.md`. `CONTRIBUTING.md` points at the 4th Culture content guidelines, now in `docs/content-guidelines.md`. No token, definition or test changed.

## 1.0.1 (2026-10-25)

Editorial pass over the prose: `SPEC.md`, `README.md`, `CONTRIBUTING.md` and the issue template. No token, definition or test changed. One worked example was reworded so that its tag follows from the Hand definition: "AI drafted the email, I reworked it and pressed send" is `L1 · drafted · Claude`.

## 1.0 (2026-10-25)

First public version. Four slots (Level, Hand, Door, Tool), one flag (`unread`), ten tokens, the machine form `AI-Use: <level> [hand] [door] [flag] (<tool>) [v<major>]`, and fifteen worked examples.
