# Pull request review (ai-use-levels)

Read by the Claude reviewer (`.github/workflows/claude-review.yml`, which calls gorfednet/.github's shared workflow) on every non-draft pull request and on a `claude review` comment. The shared workflow says what to report in general; this file holds what is particular to this repository.

## What this repository is

AI Use Levels: a public scheme that tags what one piece of work owes to generative AI (Level, Hand, Door, Tool). Version 1.3 is released, and `SPEC.md` holds it. It holds the specification (`SPEC.md`, `spec.json`, `spec.schema.json`), worked examples (`examples/`), the marks (`marks/`), the ranked model list (`models.json`) with `scripts/order-tools.mjs`, the author's delegation (`docs/delegation.md`), and `scripts/check-trailers.mjs`, which checks the form of `AI-Use:` and `AI-Use-Standing:` trailers on a pull request's commits. Node 22, `node --test`. The repository is public, so CI (`.github/workflows/ci.yml`) runs on GitHub-hosted runners only.

## House rules to hold the change to

- `SPEC.md` is the authority. `docs/for-agents.md` repeats parts of it and changes none; if the two disagree, SPEC.md is right.
- A published token never changes meaning. A change to a token, a rule or a version needs `spec.json`, `spec.schema.json`, `SPEC.md`, `examples/examples.json`, `CHANGELOG.md` and `CITATION.cff` to agree; the tests in `test/` (`spec-shape`, `spec-schema`, `examples`, `tokens-stable`, `marks`, `delegation`, `standing`, `tool-order`, `release-notes`) hold them together. `tokens-stable` compares HEAD against every `v*` tag.
- Do not weaken a test to go green: no loosened pattern in `scripts/check-trailers.mjs`, no deleted example, no edited published token. A new guard needs the near-miss negative case.
- The spec lets the accountable person delegate confirming the tag (SPEC.md section 3, accepted by the owner on 20 November 2026). His delegation of 18 November 2026 (`docs/delegation.md`) doesn't cover this repository. Here an agent drafts the tag in the pull request body, labelled as a draft, and the owner confirms it. Report any commit in the pull request that carries an `AI-Use:` or `AI-Use-Standing:` trailer, except the 3 corrected below. The trailer check proves the form of a tag, never that it is true.
- The delegation statement reads the same in `SPEC.md` section 9, `docs/for-agents.md` and `docs/delegation.md`. The quote is the owner's own words as he confirmed them on 18 November 2026 and reworded them on 20 November 2026, so a change inside the quotation marks needs his yes on the pull request. The 2 exceptions to its scope stand beside the quote.
- A wrong or unconfirmed trailer on a pushed commit is corrected by a note on its pull request or by a later commit. Nobody rewrites a pushed commit, and merges here are merge commits. Corrected so far: 181695c, 698fdc0 and a81bc6d (pull request 26) each carry `AI-Use: L3 made undo (Claude Sonnet 5.5)`, which the owner didn't confirm. Read those 3 as carrying no tag.
- `models.json` only gains models or moves them. A removed model is a finding, because old tags stop sorting.
- Copy follows `docs/content-guidelines.md`: plain language, digits for numbers, Canadian Press spelling, no AI tells. SPEC.md counts are digits and -ize spellings.
- Open work goes in the pull request or an issue; this repository has no `docs/backlog.json`.
- No secrets in the repository. Feature work goes through a branch and pull request, not a direct push to `main`.

## Where the rules live

- `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`
- `SPEC.md`, `CHANGELOG.md`, `docs/for-agents.md`, `docs/content-guidelines.md`
- `test/`, `scripts/check-trailers.mjs`, `.github/workflows/ci.yml`
