# Draft for SPEC.md section 8: other media

Draft, 20 November 2026, proposed for 1.4. It isn't part of the spec. The research behind it is in [2026-11-20-other-media.md](2026-11-20-other-media.md).

Adopting it changes several files together. The part "What adoption changes" lists them.

Every example uses 1 tag: `AI-Use: L2 drafted undo (Claude Opus 5.5)`. Each example says whether a tool printed it or it was written by hand.

## Text to add after rule 6

7. Words are the tag in every medium. In audio and video, say the full tag once where the credits are. Use the spoken form of section 2: "level two, made, undo, Claude Code". A mark shown on screen follows rules 1 to 3. A spoken tag is captioned as speech.

   As said, in a podcast's intro:

   ```
   AI use: level two, drafted, undo, Claude Opus five point five.
   ```

   The caption for it, as a WebVTT cue (written by hand):

   ```
   00:00:04.000 --> 00:00:08.000
   AI use: level two, drafted, undo, Claude Opus 5.5.
   ```

8. A level cue is a sound that stands for the Level. It opens with a chord for the work: 2 notes a perfect fourth apart, sounded together for 400 ms. A pip follows for each level. A pip is 1 note at the chord's upper pitch for 100 ms, after a gap of 150 ms. `L0` is the chord. `L1` is the chord and 1 pip. `L2` is the chord and 2 pips. `L3` is the chord and 3 pips. The notes are C♯5 (554 Hz) and F♯5 (740 Hz) in 1 musical timbre. A cue plays once.

   The `L2` cue, as `spec.json` would hold it (written by hand):

   ```json
   {
     "level": "L2",
     "gapMs": 150,
     "cue": [
       { "notes": ["C#5", "F#5"], "ms": 400 },
       { "notes": ["F#5"], "ms": 100 },
       { "notes": ["F#5"], "ms": 100 }
     ]
   }
   ```

9. A level cue never stands alone. It plays just before the spoken tag, or beside a tag a person can read. A caption names it. It shows the Level and nothing else. A level cue isn't a mark, so rule 10.7 doesn't count it and the set of 4 marks stays fixed. A level cue has no vibration form. It isn't an alert, so it's never played on equipment that sounds alarms.

   The caption for the cue and the spoken tag after it (written by hand):

   ```
   00:00:03.000 --> 00:00:04.000
   [AI use level cue: 2]

   00:00:04.000 --> 00:00:08.000
   AI use: level two, drafted, undo, Claude Opus 5.5.
   ```

10. A raised mark is at least 6 mm across with 3 mm clear around it, the `L1` dot included. The braille of rule 6 is the label, and the raised mark is an extra.

    The label beside a raised `L2` mark, token and then name, from `spec.json`:

    ```
    ⠠⠇⠼⠃ ⠠⠎⠥⠏⠑⠗⠧⠊⠎⠑⠙
    ```

11. A file holds the machine form unchanged in the free-text field its format has:

    | Format | Field |
    |---|---|
    | MP3 (ID3v2.4) | A `TXXX` frame with the description `AI-Use` and the text after `AI-Use:` as its value |
    | Ogg, FLAC and Opus | A Vorbis comment, `AI-USE=<the text after AI-Use:>` |
    | WebVTT | A `NOTE` at the top of the file holding the whole line |
    | C2PA manifest | An assertion labelled `com.4thcltr.ai-use`. Its data has 1 key, `AI-Use`, with the text after `AI-Use:` as its value |

    A standard value can go beside it, such as an IPTC digital source type. That value describes the media and never stands for the Level. A platform's own AI label and a disclosure the law requires stay as they are. The tag is added to them.

    The ID3 frame, printed by `mid3v2 --list` (Mutagen 1.47.0) from a file tagged for this draft:

    ```
    IDv2 tag info for ep.mp3
    TXXX=AI-Use=L2 drafted undo (Claude Opus 5.5)
    ```

    The same frame from `mid3v2 --list-raw`:

    ```
    TXXX(encoding=<Encoding.UTF8: 3>, desc='AI-Use', text=['L2 drafted undo (Claude Opus 5.5)'])
    ```

    The Vorbis comment, printed by `mutagen-inspect` from a FLAC file tagged for this draft:

    ```
    -- ep.flac
    - FLAC, 1.00 seconds, 44100 Hz (audio/flac)
    AI-USE=L2 drafted undo (Claude Opus 5.5)
    ```

    A WebVTT file with its `NOTE` (written by hand, and no validator has read it):

    ```
    WEBVTT

    NOTE AI-Use: L2 drafted undo (Claude Opus 5.5)

    00:00:03.000 --> 00:00:04.000
    [AI use level cue: 2]

    00:00:04.000 --> 00:00:08.000
    AI use: level two, drafted, undo, Claude Opus 5.5.
    ```

    The C2PA assertion as JSON (written by hand and unsigned, and no C2PA tool has read it):

    ```json
    {
      "label": "com.4thcltr.ai-use",
      "data": {
        "AI-Use": "L2 drafted undo (Claude Opus 5.5)"
      }
    }
    ```

12. In plain text the level token is the mark: write `L2`. A terminal prints the tag as text, and colour is never the only thing that shows the Level.

    A terminal tool's output, with the token and then the line:

    ```
    L2
    AI-Use: L2 drafted undo (Claude Opus 5.5)
    ```

## Text to add to section 11, Known limits

- No listener has tested the level cues. A person who hasn't learned them won't know what a cue means. Rule 8.9 keeps a spoken or readable tag beside every cue. The beat lengths and the notes may change after a listening test. `spec.json` says so under `marksStatus`.
- The level cues were checked on paper against Morse and 9 other families of signals. Operating-system sounds weren't checked. No listener has compared them. `L3` is the closest to 2 alarm patterns.
- The chord is what keeps a cue out of Morse. On a speaker that plays it as 1 pitch, the 4 cues are the Morse letters T, N, D and B.
- A level cue for `L4` would have 5 notes. Earcon guidance caps a short motive at 4, so a new level may need a new cue design.

## Examples to add

| Where | Mark or cue | Full tag behind it |
|---|---|---|
| A podcast episode | L2 level cue, then the spoken tag in the intro | `AI-Use: L2 drafted undo (Claude Opus 5.5)` in the file's `TXXX` frame and the show notes |
| A video's opening credit | L3 mark with `L3` beside it | The spoken tag in the credit, captioned, and the machine form in the description |
| A command-line tool's output | `L2` | `AI-Use: L2 drafted undo (Claude Opus 5.5)` on the next line |

## What adoption changes

- `SPEC.md`: the version becomes 1.4. Rules 7 to 12 go in section 8, with the 4 new limits in section 11 and the 3 new examples.
- `spec.json`: the version becomes 1.4. Each mark gains a `cue` list and a `gapMs`. `marksStatus` gains a line that no listener has tested the cues.
- `spec.schema.json`: the `cue` and `gapMs` fields on a mark, and the new key under `marksStatus`. That object allows only `braille` and `unicode` today.
- `test/marks.test.mjs`, the count: each cue is 1 chord of 2 notes and as many pips as its level. The near-miss case is a cue with 1 pip too many.
- `test/marks.test.mjs`, Morse: no cue matches a Morse code. The test holds the ITU-R M.1677-1 table. It reads a cue as dots and dashes when every beat is a single note, at any pitch, and it looks that string up. The near-miss cases are the `L2` cue with its chord cut to either note. Each has to fail as the letter D.
- `CHANGELOG.md` and `CITATION.cff`: the 1.4 entry.
- `examples/examples.json` doesn't change. It mirrors section 7 only.
- No token changes, so `tokens-stable` is untouched.

## Decided

- The owner decided on 20 November 2026 that the level cue goes into this draft now, before a listening test.
- The owner confirmed `com.4thcltr.ai-use` as the C2PA assertion label on 20 November 2026.
- The owner put the alt-text change into 1.3 on 20 November 2026. Pull request 30 has it, and this draft no longer does.
- The owner asked on 20 November 2026 that the level cue not conflict with Morse or other known signals. The cue was redesigned around a chord, and the memo's part 2 has the check.

## Open questions for the owner

- None. The owner confirmed the redesign on 20 November 2026, with the chord and with no vibration form.
