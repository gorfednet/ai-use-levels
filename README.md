# AI Use Levels

"I used AI for this" has stopped meaning anything. It covers a chatbot that polished one paragraph and an agent that ran all night with the keys to production. AI Use Levels is a tag of four words, Level · Hand · Door · Tool, that says in one breath what one piece of work owes to generative AI, so two people can tell whether they are talking about the same kind of use. A tag describes what happened on one piece of work, never what the tool could have done.

## The tag

```
L2 · made · undo · Claude Code
```

- Level: could it change anything by itself, and did each change wait for a yes? `L0` none, `L1` suggested, `L2` supervised, `L3` unattended.
- Hand: how much of the result is its output. `touched`, `drafted` or `made`.
- Door: can what it changed be taken back? `undo` or `no undo`. Only at L2 and L3, because at L1 it changed nothing.
- Tool: name it, as specifically as you can; a model version is better than a product name.
- One flag, `unread`, for work no accountable person has read.

No tag means nothing claimed. It never means L0.

## Use it

The machine form carries the same tokens with the tool in parentheses. One line, wherever the work already keeps its metadata:

- In a commit message, as the last line, beside `Co-Authored-By`: `AI-Use: L2 made undo (Claude Code)`
- In YAML front matter, the same line unchanged: `AI-Use: L2 made undo (Claude Code)`
- In an HTML page: `<meta name="AI-Use" content="L2 made undo (Claude Code)">`
- In a LinkedIn post, or any running text, at the end: `(This post: L1 · drafted · Claude Opus 5.5)`

The rules, the test for each token and fifteen worked examples are in [SPEC.md](SPEC.md).

## Read it

- [SPEC.md](SPEC.md): the specification, version 1.0.
- [spec.json](spec.json): the same scheme as data: slots, tokens, the machine form.
- [examples/examples.json](examples/examples.json): the worked examples with their machine form.
- [CHANGELOG.md](CHANGELOG.md): what each version changed.

The canonical page is https://papers.4thcltr.com/ai-use-levels/. It serves each version at its own URL, so a tag can cite a version that never moves.

## Cite it

> AI Use Levels 1.0. 4th Culture, Toronto, 2026. https://papers.4thcltr.com/ai-use-levels/

In running text, "AI Use Levels 1.0" with the link is enough. A tag with no version token is version 1.

## Argue with it

This repository is the place. Open an issue to report a use the scheme cannot tag honestly, or to propose a token: a token is accepted when three real uses cannot be tagged honestly without it. A typo needs no issue; open a pull request. [CONTRIBUTING.md](CONTRIBUTING.md) has the rest.

## Licence

CC BY 4.0, for text and data alike ([LICENSE](LICENSE)), and a link to the canonical URL satisfies attribution when you embed the token list in a tool, a document or a form.

## Repository

`npm test` runs the checks with `node --test`: `spec.json` has the right shape, every example tokenises, the examples match SPEC.md section 9, and every token published in an earlier `v*` tag is still present and unchanged in the current `spec.json`, because a published token never changes meaning. CI runs on GitHub-hosted runners because this repository is public.

The text in this repository was written by Claude Code from the author's data sheet, then rewritten by Claude Code at the author's direction, each time under supervision, on a branch, and read by the author before it was merged.

```
AI-Use: L2 made undo (Claude Fable 5.1)
```
