# Contributing

## Issues are the conversation

Open an issue to argue with the scheme, report a use it cannot tag honestly, or propose a token. Discussion happens in the open so a later reader can see why a word was added or refused.

## When a token is accepted

A token is accepted when three real uses cannot be tagged honestly without it. Describe the three uses, the slot the token belongs in, and the word. The issue template `token-proposal` asks for exactly that. Hypothetical uses do not count; a use is real when it happened and can be described.

## Tokens are forever

A published token never changes meaning. A bad token is fixed by adding a new one and marking the old one deprecated; nothing is redefined, renumbered or removed. `test/tokens-stable.test.mjs` enforces this against every published tag. Levels grow upward only. A new slot carries its own closed vocabulary, with no word shared with another slot.

## Pull requests

Pull requests are welcome for typos, broken links and wording that reads badly. Changes to meaning go through an issue first. Keep `SPEC.md`, `spec.json` and `examples/examples.json` in step; `npm test` checks the parts that can be checked.

## Style

Plain and declarative. British and Canadian spelling. No superlatives.
