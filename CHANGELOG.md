# Changelog

The scheme is versioned. A minor version adds tokens, flags or slots and stays backward compatible. A published token never changes meaning. A patch tag fixes wording and does not move the version in `spec.json`.

## Unreleased

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
