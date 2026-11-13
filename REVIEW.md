# Pull request review (ai-use-levels)

Read by the Claude reviewer (`.github/workflows/claude-review.yml`, which calls gorfednet/.github's shared workflow) on every non-draft pull request and on a `claude review` comment. The shared workflow says what to report in general; this file holds what is particular to this repository.

## What this repository is

AI Use Levels: a public scheme, version 1.2, that tags what one piece of work owes to generative AI (Level, Hand, Door, Tool). It holds the specification (`SPEC.md`, `spec.json`, `spec.schema.json`), worked examples (`examples/`), the marks (`marks/`), and `scripts/check-trailers.mjs`, which checks the form of `AI-Use:` trailers on a pull request's commits. Node 22, `node --test`. The repository is public, so CI (`.github/workflows/ci.yml`) runs on GitHub-hosted runners only.

## House rules to hold the change to

- `SPEC.md` is the authority. `docs/for-agents.md` repeats parts of it and changes none; if the two disagree, SPEC.md is right.
- A published token never changes meaning. A change to a token, a rule or a version needs `spec.json`, `spec.schema.json`, `SPEC.md`, `examples/examples.json`, `CHANGELOG.md` and `CITATION.cff` to agree; the tests in `test/` (`spec-shape`, `spec-schema`, `examples`, `tokens-stable`, `marks`) hold them together. `tokens-stable` compares HEAD against every `v*` tag.
- Do not weaken a test to go green: no loosened pattern in `scripts/check-trailers.mjs`, no deleted example, no edited published token. A new guard needs the near-miss negative case.
- An agent drafts the `AI-Use` tag and a person confirms it (owner, 30 October 2026). No commit in the pull request carries an `AI-Use:` trailer the owner has not confirmed; a proposed tag goes in the pull request body, labelled as a draft. The trailer check proves the form of a tag, never that it is true.
- Copy follows `docs/content-guidelines.md`: plain language, digits for numbers, Canadian Press spelling, no AI tells. SPEC.md counts are digits and -ize spellings.
- Open work goes in the pull request or an issue; this repository has no `docs/backlog.json`.
- No secrets in the repository. Feature work goes through a branch and pull request, not a direct push to `main`.

## Where the rules live

- `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`
- `SPEC.md`, `CHANGELOG.md`, `docs/for-agents.md`, `docs/content-guidelines.md`
- `test/`, `scripts/check-trailers.mjs`, `.github/workflows/ci.yml`
