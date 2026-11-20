# Delegation of the `AI-Use` tag confirmation

This is the author's own delegation, the worked example in [SPEC.md](../SPEC.md) section 9, rule 6. A tag written under it points here.

## The statement

"Delegation, 18 November 2026. I'm accountable for the `AI-Use` tags on commits in the gorfednet repositories. Agents write those tags themselves, and I don't confirm each one. It doesn't cover the ai-use-levels repository or papers.4thcltr.com, where I confirm each tag. I can correct any tag later."

Michael Duncan McArthur

## What it covers

- Commit trailers in the gorfednet repositories, from 18 November 2026.
- It doesn't cover this repository or papers.4thcltr.com. There an agent drafts the tag in the pull request, marked as a draft, and I confirm it.
- It doesn't cover the tag on a published page. Each site keeps its own rule for those.

## What an agent does under it

- It rates its own session by the tests in SPEC.md sections 3 to 5.
- It writes `unread` unless it saw me read the result.
- When it's unsure, it takes the larger Hand and the higher Level.
- It puts this pointer beside the tag:

```
AI-Use-Standing: https://github.com/gorfednet/ai-use-levels/blob/main/docs/delegation.md 2026-11-18
```

A commit made under the delegation before 1.3 has no pointer. Those commits stay as they are.

## Corrections

A wrong tag on a pushed commit is corrected by a note on its pull request or by a later commit. Nobody rewrites the commit.
