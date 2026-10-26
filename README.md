# AI Use Levels

A scheme for saying, in one breath, what one piece of work owes to generative AI, so two people can tell whether they are talking about the same kind of use.

The tag has four slots in a fixed order, Level · Hand · Door · Tool:

```
L2 · made · undo · Claude Code
```

Level says whether the tool could change anything by itself and whether each change waited for a yes (`L0` none, `L1` suggested, `L2` supervised, `L3` unattended). Hand says how much of the result is its output (`touched`, `drafted`, `made`). Door says whether what it changed can be taken back (`undo`, `no undo`; only at L2 and L3). Tool names the tool, as specifically as you can. A flag, `unread`, marks work no accountable person has read.

The same tag in machine form, for a commit trailer, front matter, an HTML meta or an image sidecar:

```
AI-Use: L2 made undo (Claude Code)
```

SAE rates the car. This rates the trip. A tag describes what happened on one piece of work, never what the tool could have done. No tag means nothing claimed. It never means L0.

## Read it

- [SPEC.md](SPEC.md): the specification, version 1.0.
- [spec.json](spec.json): the same scheme as data: slots, tokens, the machine form.
- [examples/examples.json](examples/examples.json): the worked examples with their machine form.
- [CHANGELOG.md](CHANGELOG.md): what each version changed.

The canonical page is https://papers.4thcltr.com/ai-use-levels/. It serves each version at its own URL, so a tag can cite a version that never moves. This repository is the source and the place to argue: open an issue (see [CONTRIBUTING.md](CONTRIBUTING.md)).

## Cite it

> AI Use Levels 1.0. 4th Culture, Toronto, 2026. https://papers.4thcltr.com/ai-use-levels/

In running text, "AI Use Levels 1.0" with the link is enough. A tag with no version token is version 1.

## Licence

CC BY 4.0, one licence for text and data ([LICENSE](LICENSE)). If you embed the token list in a tool, a document or a form, a link to the canonical URL satisfies attribution.

## Repository

`npm test` runs the checks with `node --test`: `spec.json` has the right shape, every example tokenises, the examples match SPEC.md section 9, and every token published in an earlier `v*` tag is still present and unchanged in the current `spec.json` (tokens are forever). CI runs on GitHub-hosted runners because this repository is public.

The first version of this repository was written by Claude Code from the author's data sheet, under supervision, on a branch, and read by the author before it was published.

```
AI-Use: L2 made undo (Claude Fable 5.1)
```
