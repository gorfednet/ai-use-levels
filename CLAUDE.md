# AI Use Levels

The spec lets the accountable person delegate confirming the `AI-Use` tag (SPEC.md section 3). The owner accepted that rule for 1.3 on 20 November 2026. His own delegation of 18 November 2026 ([docs/delegation.md](docs/delegation.md)) doesn't cover this repository, so here agents draft the tag and he confirms it.

- Don't put an `AI-Use:` or `AI-Use-Standing:` trailer on a commit here. A commit carries `Co-Authored-By` only.
- Put your proposed tag in the pull request body, labelled as a draft for the owner to confirm.
- [docs/for-agents.md](docs/for-agents.md) has the tests, the 2 cases (with and without a delegation) and what you write when you can't see the whole work.
- With several tools, order them by [models.json](models.json): `node scripts/order-tools.mjs "<tools>"`. Add a new model to the list in the pull request that first needs it.
- `scripts/check-trailers.mjs` checks the form of any trailer on a pull request's commits. It can't tell whether a tag is true.
