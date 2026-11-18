# AI Use Levels

Agents write the `AI-Use` tag on their own commits. The owner delegated the confirmation (owner, 18 November 2026, dated standing statement in SPEC.md section 9, rule 6). Before that, agents drafted and the owner confirmed (30 October 2026).

- Write an `AI-Use:` trailer on every commit you make. You're the only one who knows what your session did.
- Rate your own session by the tests in [docs/for-agents.md](docs/for-agents.md). An edit nobody approved as it happened is L3, whatever the delegation says.
- Report the tag in your final message, so the owner can correct it later.
- The delegation covers the owner's own repositories. In someone else's clone or pull request, draft the tag in the pull request body. Label it a draft, and leave the trailer off until its owner confirms it.
- `scripts/check-trailers.mjs` checks the form of any trailer on a pull request's commits. It can't tell whether a tag is true, or whether a person confirmed it or an agent wrote it under a delegation.
