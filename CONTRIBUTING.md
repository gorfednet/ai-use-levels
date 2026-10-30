# Contributing

## Where to argue

Argue in the issues. Open one to dispute the scheme, to report a use it can't tag honestly or to propose a token. I keep the argument in the open so a later reader can see why a word was added or refused.

## The acceptance rule

A token is accepted when 3 real uses can't be tagged honestly without it. A use is real when it happened and can be described, so a hypothetical doesn't count. Neither do 3 uses that the existing tokens tag awkwardly. To pass, each use has to be impossible to tag honestly with the tokens there are today, and a clumsy tag is still a tag.

## Tokens do not change

A published token never changes meaning. To fix a bad token, add a new one and mark the old one deprecated; nothing gets redefined, renumbered or removed. Levels only grow upward. A new slot has its own closed vocabulary and shares no word with another slot. `test/tokens-stable.test.mjs` checks every published `v*` tag against the current `spec.json`, and if a change breaks that test, the scheme doesn't make the change.

## How to propose

Open an issue with the "Token proposal" template. It asks for what the acceptance rule needs:

- The 3 uses, each of which happened. For each one, what the tool did, what a person did, the tag you'd write today, and why that tag is wrong or incomplete.
- The slot the token belongs in (`level`, `hand`, `door`, `flag`), or the name and closed vocabulary of a new slot.
- The word, its meaning in one sentence, and the test a tagger applies to a real piece of work.
- What it doesn't cover, meaning uses that look similar and should stay with an existing token.

If your issue argues with a rule and doesn't propose a token, it needs less: the rule, the use that breaks it and the tag you'd want to write.

## Small fixes

A typo, a broken link or a sentence that reads badly doesn't need an issue first. Open a pull request. A change in meaning goes through an issue. `SPEC.md`, `spec.json` and `examples/examples.json` change together, and `npm test` checks the parts a test can check: the shape of `spec.json`, that every example tokenises, that the Worked examples section of `SPEC.md` agrees with `examples.json`, and that no published token has moved.

## Style

Write plainly, in sentences of mixed length, with contractions where speech would use them. State rules in the second person or in a neutral voice, and keep "I" for the places where the author speaks, such as the rationale in `SPEC.md` and this file. Use British and Canadian spelling, and leave out superlatives, exclamation marks and "we". The full guide is the 4th Culture content guidelines in `docs/content-guidelines.md`.
