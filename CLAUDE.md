# AI Use Levels

Agents draft the `AI-Use` tag and a person confirms it (owner, 30 October 2026).

- Don't put an `AI-Use:` trailer on a commit unless the owner has confirmed that tag.
- Put your proposed tag in the pull request body, labelled as a draft for the owner to confirm.
- [docs/for-agents.md](docs/for-agents.md) has the tests and says which slots you can't know at commit time.
- `scripts/check-trailers.mjs` checks the form of any trailer on a pull request's commits. It can't tell whether a tag is true.
