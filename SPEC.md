# AI Use Levels 1.0

A scheme for saying what one piece of work owes to generative AI. Four tokens in a fixed order, Level · Hand · Door · Tool, with a flag for work nobody has read.

Canonical page: https://papers.4thcltr.com/ai-use-levels/. Machine-readable form: `spec.json` in this repository. Licence: CC BY 4.0.

## 1. Identity

| Field | Value |
|---|---|
| Name | AI Use Levels. A tag is a *use tag*; a piece of work is "a level-two use" |
| Version | 1.0. The scheme is versioned; use tags are not dated (section 7) |
| Purpose | Say, in one breath, what one piece of work owes to generative AI, so two people can tell whether they are talking about the same kind of use |
| Principle | SAE rates the car. This rates the trip. A tag describes what happened on one piece of work, never what the tool could have done. The same tool is `L1` on Monday and `L3` on Tuesday; both tags are true |
| What it is not | A permission system, an audit, or a liability column. It records the chance a person had to intervene, not how well they used it |
| The four questions | Could it change anything by itself? Did each change wait for a yes? How much of the result is its output? Could it be undone? |

## 2. Syntax

Human form (canonical). Fixed order, any separator people already type:

```
L2 · made · undo · Claude Code
```

Spoken: "level two, made, undo, Claude Code", or as a sentence: "Claude Code made it under supervision, all under undo."

| Slot | Values | Required |
|---|---|---|
| Level | `L0` `L1` `L2` `L3` (or the level's name) | always |
| Hand | `touched` `drafted` `made` | recommended |
| Door | `undo` `no undo` | at L2 and L3; omitted at L0 and L1 (nothing to undo) |
| Flag | `unread` | only when true |
| Tool | free text, last; optional reach in parentheses: `(chat)` `(IDE)` `(app)` `(API)` `(agent)` | always |

Shortest honest tag: `L1 · ChatGPT`. Full tag: Level · Hand · Door · Flag · Tool.

Machine form (commit trailer, front matter, HTML meta, image sidecar). Same tokens, tool in parentheses:

```
AI-Use: L2 made undo (Claude Code)
```

Pattern: `AI-Use: <level> [hand] [door] [flag] (<tool>) [v<major>]`.

Tokens are self-identifying (an `L` number, a Hand word, a Door word, the flag, parentheses), so a parser reads by token, not position. The tool is everything from the first opening parenthesis to the last closing one, so a reach parenthetical nests: `AI-Use: L1 touched (Copilot (IDE))`. A tag with no version token is v1; later versions must carry theirs (`v2`) after the tool. It coexists with git's `Co-Authored-By`: that trailer says who, this one says how.

Absence. No tag means nothing claimed. It never means L0.

## 3. LEVEL (the headline)

The question: could it change anything by itself, and did each change wait for a yes? "Change" means an effect outside the conversation: wrote, sent, paid, deployed, deleted, published, told someone. Reading, searching and generating text are not changes.

| Level | Name | Definition | Test |
|---|---|---|---|
| `L0` | None | No AI touched it | None |
| `L1` | Suggested | It could change nothing by itself. A person moved every piece of its output into the work (pasted, typed, accepted, pressed send) | Did anything take effect except by a person's own action? No |
| `L2` | Supervised | It made changes itself, and each change waited for a person's yes before it took effect | Could a person have stopped every change before it counted? Yes |
| `L3` | Unattended | It made changes itself without waiting for anyone | Did anything take effect before a person could stop it? Yes |

Flag: `unread`. No accountable person has read the result. Attaches to any level: `L1 · made · unread · DeepL` is a translation posted blind, `L3 · made · no undo · unread` is the bot that merged to production. The flag is a state, not a level: it is removed when a person reads. Levels never change after the fact.

Rules:

- One tag per piece of work. Where steps differed, tag the highest level reached by any step that changed something. Read-only steps raise nothing.
- Granularity is the person's. One yes to a plan of forty changes is L2: the person could have said no before anything happened. Four hundred yeses in two hours is still L2. The tag rates the opportunity to intervene, not diligence; a rubber stamp is a lie the tagger tells, and the scheme cannot catch it.
- "A person" is someone accountable for the work. A model reviewing a model lowers nothing.
- A run that changed nothing outside the conversation is L1 however long it ran: a twenty-minute research agent that produced a report is `L1 · made`.
- The numbers do not map to SAE J3016. SAE L3 is the handover level; this L3 is simply "it acted without waiting".

## 4. HAND (its hand in the result)

How much of the final is the machine's output. Hand rates production, not ideas: a transcript, a translation and a summary are all `made`, and the reader knows from the genre whose ideas they were. Independent of Level: a person can press every button and still publish something the machine made whole (`L1 · made`), which is the case people hide.

| Token | Definition | Test |
|---|---|---|
| `touched` | Corrections and local changes to a person's material: polish, autocomplete, spot fixes, formatting | Would a reader recognise anything of its output in the final? Barely |
| `drafted` | It produced a first version a person substantially reworked | Its shape survives; most of the words or code are a person's |
| `made` | The final is substantially its output; a person chose, read, maybe trimmed | Its words, code or pixels survive |

Rules:

- Judge the final, not the interactions. Two hundred tab-accepts that add up to most of the file are `made`.
- Choosing is not reworking. One picked from forty generations is `made`. Inpainting a hand is still `made`.
- In doubt between two rungs, pick the larger.
- Why three rungs and not one label: Meta's single "Made with AI" label landed on retouched photos and was renamed within months. One word cannot carry this; three can.

## 5. DOOR (what it did that cannot be taken back)

Only at `L2` and `L3`, because at `L1` the machine changed nothing. Reversibility, with reach folded in.

| Token | Definition | Test |
|---|---|---|
| `undo` | Everything it changed can be reversed by the tagger alone, asking nobody: a branch, a versioned document, a trash can, a staging system nobody else saw | Could you put it all back in minutes without telling anyone? Yes |
| `no undo` | At least one change cannot be taken back: sent, paid, deployed, deleted without backup, published, told someone. Reaching a person or system you do not control always counts, even if a rollback exists, because they saw it | Did anything leave your control? Yes |

Rules:

- Tag the worst door opened, not the typical one. One sent email makes the piece `no undo`.
- Door rates the machine's changes. If the AI drafted the email and a person pressed send, that send is the person's act: `L1 · drafted`, no door. The irreversibility belongs to the person, and the tag says so by omission.

## 6. TOOL (free text, last)

Name the tool as specifically as you can: `Claude Opus 5.5`, `Claude Code`, `Copilot (IDE)`, `GPT-5 (API)`. A product name is acceptable; a model version is better, because the model version is the date. How the tool is reached lives here as an optional parenthetical: `(chat)`, `(IDE)`, `(app)`, `(API)`, `(agent)`. Reach is a property of the tool, and its risk is already carried by Level and Door, so it earns no slot of its own.

Several tools: name the one with the biggest hand, then others after a plus: `L2 · made · undo · Claude Code + Copilot`.

## 7. Dated or versioned?

Version the scheme. Do not date a use tag. Date a standing tag.

| Thing | Dated? | Why |
|---|---|---|
| The scheme | Versioned (1.0, 1.1, and so on) | Like CC 4.0. A tag with no version token is v1 |
| A use tag on one piece of work | No | The artifact carries the date (post, commit, document, release). Tokens never change meaning (section 8), so an old tag reads correctly forever without one. A hand-typed tag must stay short |
| The tool name | Version it where you can | `Claude Opus 5.5`, not `Claude`. The model name is the date |
| A standing tag on a system or a policy | Yes | "Support bot runs at `L3 · made · no undo`, 2% read, since June 2026." "Production changes are L2 or lower (policy of 2026-10)." A stance gets revised; a reader needs to know which was in force. This is also the fleet form: ten thousand chats get one dated standing tag, not ten thousand use tags |
| An artifact with no date of its own | Yes, beside the tag | A bio, an evergreen page, a screenshot that will be reposted |

The objection that the same agent suggests today and executes unattended tomorrow is answered by the principle, not by a date: the tag describes the trip.

## 8. Extension rules

1. Tokens are forever. A published token never changes meaning. Fix a bad one by adding a new token and deprecating the old; never redefine, never renumber.
2. Levels grow upward only. First candidate for `L4`: *it chose the task* (every current level assumes a person set the goal; a proactive agent that decides what to do next is a new rung, not a flag).
3. New slots carry their own closed vocabulary, with no word shared with another slot, so tokens stay self-identifying and order remains a reading convention. New slots go before the tool.
4. A minor version adds tokens, flags or slots and is backward compatible. A major version is a last resort; deprecate, never remove.
5. Candidate 1.1 additions, left out to keep the tag at four words: `checked` (tests, a fact-check or a second reader ran; the answer to "could the person even read it"), `data` (the material left your machine, or went to training), `whose` (my things, our things, other people's things), duration.
6. Governance. A public, forkable specification with a changelog; proposals as issues; a token is accepted when three real uses cannot be expressed honestly without it.

## 9. Worked examples

| Use | Tag |
|---|---|
| A chatbot polished one paragraph | `L1 · touched · ChatGPT` |
| Autocomplete suggested a few lines | `L1 · touched · Copilot (IDE)` |
| I asked for the whole post and posted it as-is | `L1 · made · ChatGPT` |
| Grammarly fixed typos as I typed | `L1 · touched · Grammarly` |
| One of forty generated images, unedited | `L1 · made · Midjourney` |
| A research agent ran twenty minutes, changed nothing, I used the report | `L1 · made · Deep Research` |
| Machine translation posted in a language I cannot read | `L1 · made · unread · DeepL` |
| Coding agent, permission prompt on every edit, I read each diff | `L2 · made · undo · Claude Code` |
| Agent proposed an infrastructure plan, I approved once, apply made forty changes | `L2 · made · no undo · (tool)` |
| Agent ran overnight on a branch and opened a PR I then read | `L3 · made · undo · Claude Code` |
| Lint-fixer ran unattended on a branch; I read, then merged | `L3 · touched · undo · (tool)` |
| Agent with production and email access ran unattended; I read the logs after | `L3 · made · no undo · (tool)` |
| Bot auto-merged on green CI; nobody has read the diff | `L3 · made · no undo · unread · (tool)` |
| Meeting bot emailed its summary to every attendee before the host saw it | `L3 · made · no undo · unread · (tool)` |
| AI drafted the email, I pressed send | `L1 · drafted · Claude` |

The same examples are in `examples/examples.json` with their machine form.

## 10. Known limits

- It rates opportunity, not diligence. A rubber stamp at `L2` tags the same as a real review.
- Hand is self-reported and will be shaded downward. CRediT had the same problem and spread only when publishers required it.
- It says nothing about what the tool was *permitted* to do. That is a governance question (the Cloud Security Alliance framework, Zheng et al.) and belongs in a dated standing tag, not a use tag.
- It does not establish liability. It does show where liability needs an owner: every `L3 · no undo`.

## 11. Prior art

| Scheme | What it rates | Relation |
|---|---|---|
| Sheridan & Verplank 1978; Parasuraman, Sheridan & Wickens 2000 (ten levels of automation) | Who decides and who is told | The lineage. `L1` to `L3` compress their "executes with veto / executes and informs / does not inform" |
| SAE J3016 L0 to L5 | The vehicle, fixed at manufacture | The analogy; this scheme rates the trip and does not share its numbers |
| Human in / on / out of the loop (DoD 3000.09, autonomous-weapons policy) | Oversight position | Same idea as L1 to L3; the words were dropped because "on the loop" is jargon and sounds like "in the loop" aloud |
| AI Assessment Scale, Perkins / Furze / Roe / MacVaugh (five levels) | What a student is permitted to use | Permission, not disclosure; no agents acting on the world |
| Feng, McDonald & Zhang 2025, operator to observer | The user's role in an agent system | Rates the configuration; closest in spirit |
| Mitchell et al. 2025 (Hugging Face), autonomy levels | Agent systems | Argues against the top rung; rates the system |
| Morris et al. 2023, Levels of AGI (DeepMind) | System capability and autonomy | Rates the system |
| Cloud Security Alliance, Agentic AI Autonomy Levels v2 (2026) | Enterprise deployments, five dimensions, prescribed controls | Governance; the standing tag of section 7 is its small cousin |
| Zheng et al. 2026, capability vs permission | Separates could from may | Adopted: a use tag is about did |
| CRediT | Human authorship roles | Hand is a three-rung CRediT for machines |
| IPTC digital source type, C2PA | Machine-readable provenance of media | The machine-readable Hand for images; a use tag can sit beside it |
| Creative Commons | Licence terms | The syntax model: few self-identifying tokens, versioned, human and machine layers. CC Signals (2025) is about training and is not this |
| Bezos's one-way and two-way doors | Decision reversibility | Door is that idiom applied to the machine's changes |
| "Loop engineering", "four levels of agentic loops" | Agent architecture | Name collision only; the reason the working title "Loop Levels" was dropped |

Sources read:

- https://arxiv.org/abs/2403.14692v2
- https://leonfurze.com/2023/12/18/the-ai-assessment-scale-version-1/
- https://labs.cloudsecurityalliance.org/research/agentic-ai-autonomy-levels-control-framework-v2-csa-styled/
- https://www.alphaxiv.org/abs/2607.23438
- https://medium.com/@tahirbalarabe2/what-is-loop-engineering-four-levels-of-agentic-loops-ccc48b850002
