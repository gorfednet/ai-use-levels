# AI Use Levels for agents

This note is for an agent working on something that may carry an `AI-Use` tag. It repeats parts of [SPEC.md](../SPEC.md) and changes none of them. If the 2 ever disagree, SPEC.md is right.

## Who owns the tag

You may draft a tag, and a person owns it. That person confirms your draft or corrects it, and the committer is accountable for what the tag says, never the tool. A person here means someone accountable for the work (section 3), so another model reading your draft doesn't count as confirming it.

Put your draft where the person will read it, such as the pull request body or your report, and label it as a draft. Write it in the human form, for example `L2 · undo · Claude Opus 5.5`. Don't add an `AI-Use:` line to a commit until a person has confirmed that tag. A commit with no tag claims nothing (section 2), which is honest while the tag is waiting for a person.

## What you can't know at commit time

Your session only sees part of the work, so 2 slots are for the person to fill in.

- Hand. Section 4 judges the final result, and a person may still rework what you produced. Leave Hand out of the draft, or give what it'd be if nobody changes the result, and say so.
- `unread`. It depends on whether a person reads the result later, so you can't report it. The flag comes off once a person reads the result.

Level and Door are yours to report for your own session only. A merge, a send or a deploy that a person does later is the person's act. Name the Tool as specifically as you can: `Claude Opus 5.5` says more than `Claude` (section 6).

## Level (section 3)

A change is an effect outside the conversation: it wrote, sent, paid, deployed, deleted, published or told someone. Reading, searching and generating text aren't changes.

| Level | Name | Test |
|---|---|---|
| `L0` | None | None |
| `L1` | Suggested | Did anything take effect except by a person's own action? No |
| `L2` | Supervised | Could a person have stopped every change before it counted? Yes |
| `L3` | Unattended | Did anything take effect before a person could stop it? Yes |

- `L0` means no AI touched it, so it can't be the level of your own work.
- A change that ran under auto-approval, with no person's yes, is L3. Reading the result closely afterwards doesn't make it L2.
- One yes to a plan of 40 changes is L2, because the person could have said no before anything happened. The yes has to cover the change, and a change outside the plan didn't wait for it.
- Where the steps differed, tag the highest level reached by any step that changed something. A read-only step doesn't raise the level.
- A run that changed nothing outside the conversation is L1, however long it ran.

## Hand (section 4)

| Token | Test |
|---|---|
| `touched` | Would a reader recognise anything of its output in the final? Barely |
| `drafted` | Its shape survives; most of the words or code are a person's |
| `made` | Its words, code or pixels survive |

The number of interactions doesn't matter. If you're unsure between 2 rungs, pick the larger.

## Door (section 5)

Door is tagged only at `L2` and `L3`, and it rates only the machine's changes.

| Token | Test |
|---|---|
| `undo` | Could you put it all back in minutes without telling anyone? Yes |
| `no undo` | Did anything leave your control? Yes |

Tag the least reversible change, even if every other change could be put back. Reaching a person or system you don't control always counts, even if a rollback exists, because they saw it.
