# Draft for SPEC.md section 8: other media

Draft, 20 November 2026, proposed for 1.4. It isn't part of the spec. The research behind it is in [2026-11-20-other-media.md](2026-11-20-other-media.md).

Adopting it means changing `SPEC.md`, `spec.json`, `spec.schema.json`, `examples/examples.json` and `CHANGELOG.md` together. The last part of this file lists those changes.

## Text to add after rule 6

7. Words are the tag in every medium. In audio and video, say the full tag once where the credits are. Use the spoken form of section 2: "level two, made, undo, Claude Code". A mark shown on screen follows rules 1 to 3. A spoken tag is captioned as speech.

8. A level cue is a sound or a vibration that stands for the Level. It's 1 long beat for the work, then 1 short beat for each level. `L0` is long. `L1` is long short. `L2` is long short short. `L3` is long short short short. A long beat is 400 ms, a short beat is 100 ms and each gap is 150 ms. Every beat has the same pitch and the same loudness. As sound it uses 1 musical timbre. As vibration it uses the same times: `[400, 150, 100, 150, 100]` is `L2`.

9. A level cue never stands alone. It plays just before the spoken tag, or beside a tag a person can read. A caption names it: `[AI use level cue: 2]`. It shows the Level and nothing else. A level cue isn't a mark, so rule 10.7 doesn't count it and the set of 4 marks stays fixed.

10. A raised mark is at least 6 mm across with 3 mm clear around it, the `L1` dot included. The braille of rule 6 is the label, and the raised mark is an extra.

11. A file holds the machine form unchanged in the free-text field its format has:

    | Format | Field |
    |---|---|
    | MP3 (ID3v2.4) | A `TXXX` frame with the description `AI-Use` and the rest of the line as its value |
    | Ogg, FLAC and Opus | A Vorbis comment, `AI-USE=<the rest of the line>` |
    | WebVTT | A `NOTE` at the top of the file holding the whole line |
    | C2PA manifest | An assertion labelled `com.4thcltr.ai-use` holding the whole line |

    A standard value can go beside it, such as an IPTC digital source type. That value describes the media and never stands for the Level. A platform's own AI label and a disclosure the law requires stay as they are. The tag is added to them.

12. In plain text the level token is the mark: write `L2`. A terminal prints the tag as text, and colour is never the only thing that shows the Level.

## Text to add to section 11, Known limits

- No listener has tested the level cues. A person who hasn't learned them won't know what a cue means. Rule 8.9 keeps a spoken or readable tag beside every cue. The beat lengths may change after a listening test. `spec.json` says so under `marksStatus`.
- A level cue for `L4` would have 5 beats. Earcon guidance caps a short motive at 4 notes, so a new level may need a new cue design.

## Example to change

The third row of the examples table in section 8 reads:

| Where | Mark | Full tag behind it |
|---|---|---|
| An overlay on a generated image | L1 mark | `L1 · made · Midjourney` in the image's alt text and sidecar |

Proposed:

| Where | Mark | Full tag behind it |
|---|---|---|
| An overlay on a generated image | L1 mark | `L1 · made · Midjourney` in the image's caption and sidecar |

Alt text describes the picture. Rule 2 still lets the mark's own alt text hold the tag.

## Examples to add

| Where | Mark or cue | Full tag behind it |
|---|---|---|
| A podcast episode | L2 level cue, then the spoken tag in the intro | `AI-Use: L2 drafted undo (Claude Opus 5.5)` in the file's `TXXX` frame and the show notes |
| A video's opening credit | L3 mark with `L3` beside it | The spoken tag in the credit, captioned, and the machine form in the description |
| A command-line tool's output | `L2` | `AI-Use: L2 made undo (Claude Code)` on the next line |

## What adoption changes

- `SPEC.md`: rules 7 to 12 in section 8, the 2 new limits in section 11, the changed example and the 3 new ones.
- `spec.json`: a `cue` list of beat lengths on each mark, and a line under `marksStatus` that no listener has tested the cues.
- `spec.schema.json`: the `cue` field.
- `test/marks.test.mjs`: each cue is 1 long beat and as many short beats as its level. The near-miss case is a cue with 1 beat too many.
- `CHANGELOG.md` and `CITATION.cff`: the 1.4 entry.
- No token changes, so `tokens-stable` is untouched.

## Decided

- The owner decided on 20 November 2026 that the level cue goes into this draft now, before a listening test.
- The owner confirmed `com.4thcltr.ai-use` as the C2PA assertion label on 20 November 2026.

## Open question for the owner

- Whether the changed alt-text example should go into 1.3 as a small fix.
