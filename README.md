# AI Use Levels

"I used AI for this" has stopped meaning anything. It covers a chatbot that polished one paragraph and an agent that ran all night with the keys to production. AI Use Levels is a tag of four words, Level · Hand · Door · Tool, that says in one breath what one piece of work owes to generative AI. With it, 2 people can tell whether they're talking about the same kind of use. A tag describes what happened on one piece of work, and what the tool was capable of doesn't change it.

## The tag

```
L2 · made · undo · Claude Code
```

- Level: could it change anything by itself, and did each change wait for a yes? `L0` none, `L1` suggested, `L2` supervised, `L3` unattended.
- Hand: how much of the result is its output. `touched`, `drafted` or `made`.
- Door: can what it changed be taken back? `undo` or `no undo`. It's tagged only at L2 and L3, because at L1 the tool changed nothing.
- Tool: name it as specifically as you can. A model version is better than a product name.
- One flag, `unread`, for work no accountable person has read.

No tag means nothing is claimed. It never means L0.

## Use it

The machine form uses the same tokens and puts the tool in parentheses. Add one line wherever the work already keeps its metadata:

- In a commit message, as the last line, beside `Co-Authored-By`: `AI-Use: L2 made undo (Claude Code)`
- In YAML front matter, the same line unchanged: `AI-Use: L2 made undo (Claude Code)`
- In an HTML page: `<meta name="AI-Use" content="L2 made undo (Claude Code)">`
- In a LinkedIn post, or any running text, at the end: `(This post: L1 · drafted · Claude Opus 5.5)`

Where 4 words don't fit, a mark can stand for the Level. It's a circle for the work with a dot for the tool, placed outside the circle, on its edge or inside it. The SVGs are in [marks/](marks/) under CC0.

[SPEC.md](SPEC.md) has the rules, the test for each token and 15 worked examples.

## Read it

- [SPEC.md](SPEC.md): the specification, version 1.1.
- [spec.json](spec.json): the same scheme as data, with the slots, the tokens and the machine form.
- [examples/examples.json](examples/examples.json): the worked examples with their machine form.
- [CHANGELOG.md](CHANGELOG.md): what each version changed.

The canonical page is https://papers.4thcltr.com/ai-use-levels/. It serves each version at its own URL, so a tag can cite a version that never moves.

## Cite it

> AI Use Levels 1.1. 4th Culture, Toronto, 2026. https://papers.4thcltr.com/ai-use-levels/

In running text, "AI Use Levels 1.1" with the link is enough. A tag with no version token is version 1.

## Argue with it

I'd like the argument to happen here, in this repository. Open an issue to report a use the scheme can't tag honestly, or to propose a token; a token is accepted when 3 real uses can't be tagged honestly without it. For a typo, skip the issue and open a pull request. [CONTRIBUTING.md](CONTRIBUTING.md) covers everything else.

## Licence

Text and data are both under CC BY 4.0 ([LICENSE](LICENSE)). If you embed the token list in a tool, a document or a form, a link to the canonical URL satisfies attribution.

## Repository

`npm test` runs the checks with `node --test`. They confirm that `spec.json` has the right shape, that every example tokenises and that the examples match the Worked examples section of SPEC.md. They also confirm that every token published in an earlier `v*` tag is still in the current `spec.json` and unchanged, because a published token never changes meaning. CI runs on GitHub-hosted runners because this repository is public.

Claude Code wrote the text in this repository from my data sheet and later rewrote it at my direction. Each time it worked under supervision, on a branch, and I read the result before it was merged.

```
AI-Use: L2 made undo (Claude Fable 5.1)
```
