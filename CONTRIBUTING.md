# Contributing

## Where to argue

In the issues. Open one to argue with the scheme, to report a use it cannot tag honestly, or to propose a token. The argument happens in the open, so a later reader can see why a word was added or refused.

## The acceptance rule

A token is accepted when three real uses cannot be tagged honestly without it. A use is real when it happened and can be described; a hypothetical does not count. Three uses that the existing tokens tag awkwardly do not count either. The test is that it cannot be tagged, not that it is tagged clumsily.

## Tokens do not change

A published token never changes meaning. A bad token is fixed by adding a new one and marking the old one deprecated. Nothing is redefined, renumbered or removed. Levels grow upward only. A new slot carries its own closed vocabulary and shares no word with another slot. `test/tokens-stable.test.mjs` checks every published `v*` tag against the current `spec.json`, and a change that breaks it is a change the scheme does not make.

## How to propose

Open an issue with the "Token proposal" template. It asks for exactly what the acceptance rule needs:

- The three uses. Each one happened. For each, what the tool did, what a person did, the tag you would write today, and why that tag is wrong or incomplete.
- The slot the token belongs in (`level`, `hand`, `door`, `flag`), or the name and closed vocabulary of a new slot.
- The word, its meaning in one sentence, and the test a tagger applies to a real piece of work.
- What it does not cover: uses that look similar and should stay with an existing token.

An issue that argues with a rule rather than proposing a token needs less: the rule, the use that breaks it, and the tag you would want to write.

## Small fixes

A typo, a broken link or a sentence that reads badly needs no issue first. Open a pull request. A change in meaning goes through an issue. `SPEC.md`, `spec.json` and `examples/examples.json` move together, and `npm test` checks the parts a test can check: the shape of `spec.json`, that every example tokenises, that the Worked examples section of `SPEC.md` and `examples.json` agree, and that no published token has moved.

## Style

Plain and declarative. Short sentences. British and Canadian spelling. No superlatives, no exclamation marks, no "we". It follows the 4th Culture content guidelines (docs/content-guidelines.md).
