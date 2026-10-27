# Changelog

The scheme is versioned. A minor version adds tokens, flags or slots and stays backward compatible. A published token never changes meaning. A patch tag fixes wording and does not move the version in `spec.json`.

## 1.1.1 (2026-10-27)

Wording: section 12 rule 3 now says the alt text and SVG title are the label with a digit (`AI use level 2, Supervised`), as the files already were, and that a screen reader says it as the spoken form. Section 12 adds that `🤖2` is no shorter than `L2` to the reasons it was withdrawn. Sections reordered so the reference material comes last: Worked examples is section 7, Marks 8, Dated or versioned 9, Extension rules 10 (the mark rule is 10.7), Known limits 11, Route to a standard 12, Prior art 13. The examples test finds its section by title. Braille: section 8 rule 6 now says `braille` spells the level token (`L2` is capital letter indicator, l, numeric indicator, b), and `spec.json` adds `brailleName` with each level name in uncontracted UEB; a test decodes both and rejects doubled indicators. Still pending a braille reader's check. No token, mark or test changed.

## 1.1 (2026-10-27)

Adds marks: one symbol per Level, a circle for the work and a dot for the tool, with the dot outside (`L1`), on the edge (`L2`) or inside (`L3`), and an empty circle for `L0`. Section 12 gives the rules and examples, and section 13 gives the route to Unicode encoding. Extension rule 8.7 (10.7 after the 1.1.1 reorder) says a mark is not a token. `spec.json` gains `marks` (name, spoken form, braille, files) and `marksStatus`. The SVGs are in `marks/` under CC0. The `🤖2` mark proposed in issue 6 is withdrawn. No token changed.

## 1.0.2 (2026-10-26)

Editorial pass: repeated epigrams reduced to one instance each, so "SAE rates the car. This rates the trip." and "The model name is the date." each appear once in `SPEC.md`. `CONTRIBUTING.md` points at the 4th Culture content guidelines, now in `docs/content-guidelines.md`. No token, definition or test changed.

## 1.0.1 (2026-10-26)

Editorial pass over the prose: `SPEC.md`, `README.md`, `CONTRIBUTING.md` and the issue template. No token, definition or test changed. One worked example was reworded so that its tag follows from the Hand definition: "AI drafted the email, I reworked it and pressed send" is `L1 · drafted · Claude`.

## 1.0 (2026-10-26)

First public version. Four slots (Level, Hand, Door, Tool), one flag (`unread`), ten tokens, the machine form `AI-Use: <level> [hand] [door] [flag] (<tool>) [v<major>]`, and fifteen worked examples.
