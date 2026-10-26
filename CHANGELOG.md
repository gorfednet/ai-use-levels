# Changelog

The scheme is versioned. A minor version adds tokens, flags or slots and stays backward compatible. A published token never changes meaning. A patch tag fixes wording and does not move the version in `spec.json`.

## 1.0.2 (2026-10-26)

Editorial pass: repeated epigrams reduced to one instance each, so "SAE rates the car. This rates the trip." and "The model name is the date." each appear once in `SPEC.md`. `CONTRIBUTING.md` points at the 4th Culture content guidelines, now in `docs/content-guidelines.md`. No token, definition or test changed.

## 1.0.1 (2026-10-26)

Editorial pass over the prose: `SPEC.md`, `README.md`, `CONTRIBUTING.md` and the issue template. No token, definition or test changed. One worked example was reworded so that its tag follows from the Hand definition: "AI drafted the email, I reworked it and pressed send" is `L1 · drafted · Claude`.

## 1.0 (2026-10-26)

First public version. Four slots (Level, Hand, Door, Tool), one flag (`unread`), ten tokens, the machine form `AI-Use: <level> [hand] [door] [flag] (<tool>) [v<major>]`, and fifteen worked examples.
