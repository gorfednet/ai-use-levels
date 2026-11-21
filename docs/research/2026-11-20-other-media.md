# AI Use Levels in audio and other media

Research memo, 20 November 2026. Status: a proposal for 1.4. Nothing here is in the spec yet.

The owner asked how a use tag could be shown in audio and other media beyond braille. This memo covers 7 media. Each part says what exists, what the sources say, which open libraries can render it, and which form is recommended. The draft spec text is in [2026-11-20-other-media-spec-draft.md](2026-11-20-other-media-spec-draft.md).

## Summary

- Words stay the tag in every medium. The spoken form in SPEC.md section 2 already works for audio, video and screen readers.
- The draft adds 1 new thing, a level cue. The owner decided on 20 November 2026 that it goes into the draft now.
- The cue is a 2-note chord for the work, then 1 short pip per level. It's sound only.
- The chord keeps the cue out of Morse. Part 2 checks each level against Morse and 9 other families of known signals. Operating-system sounds weren't checked.
- The level cue never stands alone. Untrained listeners identified about 10% of earcons in the study the handbook cites [1].
- Files carry the machine form `AI-Use:` unchanged, in the field each format already has for free text.
- Nobody has tested the level cue or the raised marks with listeners or readers. Section "Limits of this memo" lists what else is unproven.

## How the sources were read

- 42 sources and 9 library pages are listed at the end. Each was opened on 20 November 2026.
- The list says how much of each was reached: the full text, an abstract or a catalogue record.
- 9 sources or groups of sources failed to open and are named under "Not opened". Nothing in this memo rests on them.
- The scheme has 4 levels, `L0` to `L3`. Every design below is sized for 4. All but the level cue leave room for `L4` (part 2).

## 1. Spoken audio and screen readers

What exists:

- SPEC.md section 2 gives the spoken tag: "level two, made, undo, Claude Code". Section 8 gives each mark a spoken form: "AI use level two, Supervised".
- WCAG 1.1.1 asks that non-text content has "a text alternative that serves the equivalent purpose" [7]. The marks meet it through alt text and the SVG `<title>`.
- The ARIA practices guide prefers visible text for a name. It warns that paragraphs and list items "should not be named with `aria-label`" [10].
- SSML 1.1 is a W3C Recommendation for marking up synthetic speech [11]. Its `sub` element replaces written text with a spoken alias.
- Article 50 of the EU AI Act requires disclosure of deepfakes "in a clear and distinguishable manner" [22]. It sets no wording and no scale.
- No source was found on how screen readers announce a badge. No platform rule for spoken AI disclosure in podcasts was found either.

Recommended form:

- Say the full tag once where the credits are. Use the work's own language. For a podcast that's the intro or the outro.
- Use the existing spoken forms. Add no new words for audio.
- On a page, keep the tag as visible text beside the mark. Where there's no room the mark's alt text holds the label (section 8 rule 3).
- In SSML, write `<sub alias="level two">L2</sub>` so a voice doesn't spell the token.

Reasoning: speech needs no learning, and the spec already defines it. Captions pick it up with no extra work (part 5).

Limits:

- A spoken tag costs 2 to 4 seconds. A listener who skips the intro misses it, so the file's metadata has it too (part 6).
- Nobody has tested whether listeners understand the spoken tag on first hearing.

Libraries: the Web Speech API in browsers [L3], eSpeak NG (GPL 3 or later, partial SSML) [L4], Piper (GPL 3.0) [L5].

## 2. Earcons and sonification

What exists:

- Blattner, Sumikawa and Greenberg named earcons in 1989 [3]. Only the catalogue record opened, so nothing is quoted from it.
- McGookin and Brewster's handbook chapter reviews the earcon studies up to 2011 [1]. Its guidance is the basis for this part.
- Pitch is a weak carrier. "If listeners must make absolute judgments, then register should not be used" [1]. Loudness is worse: "Listeners are poor at making judgments in loudness" [1].
- Rhythm is the strong carrier. Brewster's guidelines say "Putting different numbers of notes in each rhythm is very effective" [6].
- Earcons have to be learned. "Earcons, without training, had recognition rates of around 10%" [1]. "After around 5 minutes of training, identification performance was around 80%" [1].
- Spearcons are speech sped up until it's a cue. They gave "faster performance" than auditory icons and earcons "with significantly less training required" [1].
- Timing guidance: "gaps of at least 0.1 second" between the parts of a compound earcon [1].
- No study in these sources tests counting 0 to 3 short tones.

Recommended form, the level cue:

| Level | Cue | Sound, in milliseconds |
|---|---|---|
| `L0` | chord | chord 400 |
| `L1` | chord, pip | chord 400, gap 150, pip 100 |
| `L2` | chord, pip, pip | chord 400, gap 150, pip 100, gap 150, pip 100 |
| `L3` | chord, pip, pip, pip | chord 400, then gap 150 and pip 100, 3 times |

- The chord is 2 notes sounded together, a perfect fourth apart. It stands for the work, as the circle does.
- Each pip is 1 short note at the chord's upper pitch. The number of pips is the level.
- The suggested notes are C♯5 (554 Hz) and F♯5 (740 Hz), in 1 musical timbre.
- The cue plays once and never repeats.
- Using a level cue is optional. It plays just before the spoken tag or alongside the visible one.
- A music track with no speech has the tag in its metadata.

Reasoning:

- Counting avoids absolute pitch and loudness, which the handbook warns against.
- Each level has a different number of notes, which the guidelines call very effective [6].
- A rising pitch for a higher level would also suggest "better" or "worse". The tag doesn't rank work that way.
- A cue that mirrored the dot's position (before, on, inside) was considered. Hearing that order is harder than counting beats.
- The chord is there because of Morse (next part).
- `L4` would be a chord and 4 pips. Blattner's limit for a motive is 4 notes [1], and `L4` would have 5.

### Check against Morse and other known signals

The owner asked on 20 November 2026 that the cue not conflict with Morse or other known audio signals. The first design did. It was 1 long tone and then 1 short tone per level, all at 1 pitch. In Morse that's T, N, D and B.

Rhythm can't fix it:

- Morse is 1 tone keyed on and off. A dash is 3 dots long [30].
- 30 patterns exist with 1 to 4 beats in 2 lengths. 26 of them are the letters A to Z in the ITU table [30].
- The other 4 are Ä, Ö, Ü and CH in national use [32].
- So every short pattern of long and short beats at 1 pitch is a Morse letter.

The new design leaves Morse by adding a second pitch. A chord sounds 2 notes at once, and a keyed single tone can't make one. The interval and the notes were then chosen against the other signals:

| Signal family | Its pattern | `L0` | `L1` | `L2` | `L3` | How the cue differs |
|---|---|---|---|---|---|---|
| Morse letters, figures and signs | 1 tone, dots and dashes [30] | no match | no match | no match | no match | Every cue opens with 2 pitches at once |
| Morse prosigns and SOS | 1 tone. SOS is 3 dots, 3 dashes, 3 dots [31][32] | no match | no match | no match | no match | Same |
| Fire alarm, temporal-3 | 3 pulses of 0.5 seconds, a pause of 1.5 seconds, repeated for 180 seconds or more [38] | no match | no match | no match | no match | Pips are 0.1 seconds, and the cue plays once |
| Carbon monoxide alarm, temporal-4 | 4 pulses of 100 ms on and 100 ms off, then 5 seconds off, repeated [37] | no match | no match | no match | closest | `L3` has 4 sounds, and the first is a 400 ms chord. It plays once |
| Medical alarms, IEC 60601-1-8 | A pointer of 5 fast pulses for high priority, 3 slower pulses for medium [41] | no match | no match | no match | closest | `L3` has 3 pips after a chord. Rule: no cue on equipment that sounds alarms |
| Telephone dial, ringing, busy and reorder | 2 tones together: 350 and 440 Hz, 440 and 480 Hz, 480 and 620 Hz. Continuous or repeating [36] | no match | no match | no match | no match | A different interval and different notes. One 400 ms chord |
| Broadcast time pips | 5 pips of 0.1 seconds and a last one of 0.5 seconds, 1 second apart, at 1 kHz [35] | no match | no match | no match | no match | At most 3 pips, 0.25 seconds apart, at 740 Hz. The long sound comes first |
| US emergency alert tone | 853 and 960 Hz together for 8 to 25 seconds [33] | no match | no match | no match | no match | 0.4 seconds, other notes |
| NOAA Weather Radio tone | 1,050 Hz [42] | no match | no match | no match | no match | Other notes, and a chord |
| Canadian alert tone | 8 seconds of half-second tones. One group is 440, 659.26 and 3,135.96 Hz [34] | no match | no match | no match | no match | 440 and 659.26 Hz are a perfect fifth, so the chord is a fourth on other notes |
| Reversing beeper | Pure-tone beeps at about 1,000 Hz [39] | no match | no match | no match | no match | Musical timbre at 554 and 740 Hz, played once |
| Operating-system sounds | Not checked. No vendor page that documents the notes was opened | unknown | unknown | unknown | unknown | Unknown. A short chord could resemble a notification sound |

How the interval was chosen:

- A major second is the US alert tone (853 and 960 Hz).
- A major third is the dial tone (350 and 440 Hz).
- A perfect fifth is in the Canadian alert tone (440 and 659.26 Hz).
- A perfect fourth is in none of the signals above.
- 554 and 740 Hz are at least 60 Hz from every frequency in the table.

Limits:

- Untested. The 10% figure says a first-time listener won't know what it means.
- "No match" means the patterns differ on paper. No listener has compared them.
- `L3` is the closest to 2 alarm patterns. The draft's rule keeps cues off equipment that sounds alarms.
- On a speaker that plays the chord as 1 pitch, the cue is T, N, D or B again.
- ISO 8201, IEC 60601-1-8 and SAE J994 weren't opened. Their patterns here come from secondary sources.
- Operating-system sounds weren't checked.
- The durations are a starting point taken from the 0.1 second rule. A listening test should set them.

Libraries: the Web Audio API's `OscillatorNode` [L2], Tone.js (MIT) [L1]. SSML's `audio` element can place a recorded cue ahead of the spoken tag [11].

## 3. Haptics and vibration

What exists:

- Brewster and Brown proposed Tactons in 2004: "structured, abstract messages that can be used to communicate messages non-visually" [2]. The paper is a design proposal with no experiment of its own.
- It calls rhythm "a very powerful cue in both sound and touch" [2].
- Intensity is limited: "no more than four different intensities should be used" [2]. Absolute identification gives "much fewer discriminable values" than comparison [2].
- A pulse shorter than 0.1 seconds is felt as a tap [2].
- Tactons must be learned too, and the paper leaves learnability to later work [2].
- The W3C Vibration API takes a list of on and off times. It allows 10 entries and has no intensity control [14].
- Its own status section says it "is not expected to advance to W3C Recommendation in its current form". WebKit opposes it and Firefox removed it in version 129 [14].
- Android's `VibrationEffect` has 4 predefined effects and custom waveforms with amplitudes [28].
- MPEG-I part 31 is a coding standard for haptic signals [16]. Only its catalogue page opened.
- The Apple Core Haptics page didn't open, so iOS isn't covered.

Recommended form: no vibration cue for now.

- The first design used the same rhythm for sound and touch. The Morse check ends that.
- A vibration motor on the web is on or off. It has no second pitch.
- Every on and off pattern of 1 to 4 beats is a Morse letter (part 2). A vibrating cue would be T, N, D and B.
- A device that vibrates shows the tag as text, or says it.

Limits:

- A native API with amplitude or texture could make a cue that isn't Morse. No source here tests one.
- No open haptics library was found.

## 4. Tactile print beyond braille

What exists:

- SPEC.md section 8 rule 6 already defines the braille token and name beside a raised mark.
- The BANA tactile graphics guidelines put words first [15]. "A reader can discern information more efficiently when words are used rather than when symbols or keys are added."
- They cap a graphic at "five different types of point symbols" [15]. The 4 marks fit.
- A point symbol's "minimum diameter must be at least 1/4 inch (6 millimeters)", with 3 mm of clear space around it [15].
- ISO 24503 covers single tactile dots and bars on consumer products [17]. Only its catalogue page opened.
- No study was found on telling apart symbols that differ only in where a dot is.

Recommended form:

- The braille token is the label. The raised mark is an extra.
- Emboss the circle at 6 mm or more, with 3 mm clear on every side. That clear space includes the `L1` dot.
- Don't make a tactile code from the level cue. Braille and the mark are enough.

Reasoning: the braille token is a word. BANA ranks a word above a keyed symbol.

Limits:

- `L1`, `L2` and `L3` differ only in the dot's place. Whether a finger can tell them apart at 6 mm is unknown.
- A braille reader hasn't checked the strings yet, as `marksStatus` in `spec.json` says.

Libraries: liblouis translates braille (LGPL 2.1 or later for the library) [L6]. No open tool for tactile models was opened.

## 5. Video and captions

What exists:

- WCAG's guide to 1.2.2 says captions cover speech and "non-speech information conveyed through sound, including meaningful sound effects" [9]. That page is informative.
- WebVTT has `NOTE` comments and metadata cues. Metadata cues "are only useful for scripted applications" [13], so a viewer never sees either.
- YouTube requires creators "to disclose AI-generated or altered content that seems realistic" [24]. It's a yes or no, and the platform chooses where the label shows.
- The European Commission's code of practice is voluntary. It says the EU made "a set of icons" for labelling AI-generated content [23]. The code's text wasn't opened.
- A PsyArXiv preprint tested 9 label terms with over 5,000 people in 5 countries [4]. People tied "AI Generated" and "Generated with an AI tool" to AI-made content. They tied "Deepfake" and "Manipulated" to misleading content, with or without AI.
- An MIT review found "little direct evidence regarding the effectiveness of labeling" AI-generated media [5]. Only its abstract opened.

Recommended form:

- Show the mark on screen with the level token beside it, in the opening or the credits.
- Say the full tag there, or show it as text for long enough to read.
- A spoken tag is captioned as speech. A level cue is captioned as a sound, for example `[AI use level cue: 2]`.
- Put the machine form in the video's description. In a WebVTT file it can also go in a `NOTE` at the top.
- A platform's own AI label stays on. The tag adds to it and never replaces it.

Reasoning: every part reuses a form the spec has. The captions follow from the speech with no new rule.

Limits:

- A `NOTE` is for machines only, and players ignore it.
- The preprint's result is a warning. A viewer may read any AI label as "misleading", which the tag doesn't say.
- No study has tested a graded label on video.

Libraries: none needed beyond a text editor for WebVTT. Browsers parse it natively [13].

## 6. Alt text and metadata

What exists:

- The W3C alt decision tree treats alt text as a description of what the image adds to the page [12]. It has no branch for provenance or credit.
- IPTC's Digital Source Type has 20 terms [19]. `trainedAlgorithmicMedia` is media "created algorithmically using an Artificial Intelligence model". `compositeWithTrainedAlgorithmicMedia` covers edits "using a Generative AI model".
- C2PA 2.2 lets an action carry a `digitalSourceType` from the IPTC list [18]. Its manifests embed in images, video and audio, and MP3 and FLAC go through ID3.
- C2PA allows custom assertions under an entity's own domain, written like a Java package [18].
- schema.org has `digitalSourceType` on `CreativeWork` [20]. Its enumeration has 17 members and trails IPTC's 20.
- ID3v2.4 has `TXXX`, a user-defined text frame with a description and a value [21]. Vorbis comments allow free field names such as `ARTIST=me` [25].
- Article 50 requires marking synthetic output "in a machine-readable format" from 2 August 2026 [22][23].

Recommended form: the same `AI-Use:` line, unchanged, in each format's free-text field.

| Format | Where the tag goes | Standard value beside it |
|---|---|---|
| MP3 (ID3v2.4) | A `TXXX` frame: description `AI-Use`, value `L2 made undo (Suno)` | none |
| Ogg, FLAC, Opus | A Vorbis comment: `AI-USE=L2 made undo (Suno)` | none |
| Image or video with XMP | The sidecar or packet line SPEC.md section 2 already names | IPTC Digital Source Type |
| C2PA manifest | A custom assertion labelled `com.4thcltr.ai-use`, holding the same line | `digitalSourceType` on the action |
| Web page | `<meta name="AI-Use">`, as today | schema.org `digitalSourceType` in JSON-LD |

- Hand maps loosely to IPTC. `made` is close to `trainedAlgorithmicMedia`. `drafted` and `touched` are close to `compositeWithTrainedAlgorithmicMedia`.
- Level, Door and the flag have no IPTC term. That gap is the case for the IPTC proposal in SPEC.md section 12.
- For a content image, put the tag in a caption or the sidecar. Alt text describes the picture.

Reasoning: 1 string in every container means 1 parser. The standard values go beside it so existing tools still read something.

Limits:

- Platforms often strip metadata on upload. Players don't show a `TXXX` frame.
- A signed C2PA manifest proves who made the claim. It doesn't prove the tag is true.
- The owner confirmed the `com.4thcltr.ai-use` label on 20 November 2026. No manifest uses it yet.
- SPEC.md section 8 has an example that puts the full tag in a generated image's alt text. The alt decision tree argues against it. Pull request 30 changes that example in 1.3.

Libraries: c2pa-rs (MIT and Apache 2.0) [L9], ExifTool for XMP and IPTC [L8], Mutagen for ID3 and Ogg (GPL 2 or later) [L7].

## 7. Plain text and terminals

What exists:

- The machine form is already plain ASCII: `AI-Use: L2 made undo (Claude Code)`.
- Git trailers are "a key-value pair with a colon as a separator" [26]. `AI-Use` follows that form.
- REUSE requires a one-line `SPDX-License-Identifier` tag in each file [27]. It's the closest precedent for a short machine-readable line in text.
- NO_COLOR asks command-line software that adds colour to check for a `NO_COLOR` variable [29].

Recommended form:

- In plain text the level token is the mark. Write `L2`.
- A terminal tool prints the tag as text first. Colour is an extra, and the tool honours `NO_COLOR`.
- A source file can hold the line in a comment, as it holds an SPDX tag.

Reasoning: section 8 withdrew the robot emoji because it was no shorter than `L2`. The same holds for any drawn substitute.

Limits: none new. A check can read the line's form, and it still can't tell whether the tag is true.

Libraries: none needed. `scripts/check-trailers.mjs` already parses the line.

## Not recommended

- A vibration cue. On and off patterns this short are Morse letters (part 2).
- A sound as the only tag. Nobody has learned it. WCAG 1.3.3 makes the same point for instructions that rely on sound [8].
- Pitch or loudness to show the level.
- Separate cues for Hand, Door, the flag or the Tool. Earcon studies cap a family at about 3 values per attribute [1].
- A level that means "synthetic voice". The tag rates how the work was made, whatever the voice.
- An inaudible watermark as the tag. A watermark helps detection, and a person can't read it. No watermark source was opened for this memo.
- The tag in the alt text of a content image.
- Unicode shapes or emoji that look like the marks. A screen reader reads their Unicode names.
- A tag in place of a platform label or a legal disclosure.
- A claim that an IPTC term equals a level.

## Limits of this memo

- No listener, reader or viewer tested anything proposed here.
- Peer-reviewed evidence is thin. 2 journal articles on medical alarms were read in part, and 1 on earcons by its record only. 1 conference paper and 1 handbook chapter were read in full, and neither copy states its review.
- 8 rows of the signal table rest on Wikipedia or a trade article. The standards behind them weren't opened.
- Sources 22 and 23 are a secondary copy and a summary page. The Official Journal text of Article 50 didn't open.
- The C2PA version read was 2.2. The site lists versions up to 2.5.
- iOS haptics, TikTok's label, the XMP specification and ISO's haptic guidance (9241-910 and 9241-920) weren't opened.

## Sources

Kinds:

- **J**: article in a peer-reviewed journal
- **C**: conference paper
- **B**: chapter in an edited book
- **P**: preprint with no peer review
- **S**: standard or specification
- **G**: official guidance or documentation
- **O**: other

Only J is confirmed peer-reviewed. The opened copies of C and B don't state their review.

| # | Source | Kind | Reached |
|---|---|---|---|
| 1 | McGookin and Brewster, "Earcons", chapter 14 of *The Sonification Handbook*, Logos, 2011. https://sonification.de/handbook/download/TheSonificationHandbook-chapter14.pdf | B | Full text |
| 2 | Brewster and Brown, "Tactons: Structured Tactile Messages for Non-Visual Information Display", AUIC 2004. https://eprints.gla.ac.uk/3443/ | C | Full text |
| 3 | Blattner, Sumikawa and Greenberg, "Earcons and Icons: Their Structure and Common Design Principles", *Human-Computer Interaction* 4(1), 1989. https://doi.org/10.1207/s15327051hci0401_1 | J | Catalogue record only |
| 4 | "What label should be applied to content produced by generative AI?", PsyArXiv, 28 July 2023. https://doi.org/10.31234/osf.io/v4mfz | P | Abstract, through the OSF record |
| 5 | "Labeling AI-Generated Content: Promises, Perils, and Future Directions", MIT Media Lab, 28 November 2023. https://www.media.mit.edu/publications/labeling-ai-generated-content-promises-perils-and-future-directions/ | O | Abstract only |
| 6 | Brewster, Wright and Edwards, "Guidelines for the Creation of Earcons". https://www.dcs.gla.ac.uk/~stephen/earcon_guidelines.shtml | O | Full page |
| 7 | W3C, Understanding SC 1.1.1 Non-text Content (WCAG 2.2). https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html | G | Full page |
| 8 | W3C, Understanding SC 1.3.3 Sensory Characteristics (WCAG 2.2). https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html | G | Full page |
| 9 | W3C, Understanding SC 1.2.2 Captions (Prerecorded) (WCAG 2.2). https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html | G | Full page |
| 10 | W3C, ARIA Authoring Practices Guide, Providing Accessible Names and Descriptions. https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/ | G | Full page |
| 11 | W3C, Speech Synthesis Markup Language (SSML) 1.1, Recommendation, 2010. https://www.w3.org/TR/speech-synthesis11/ | S | First half |
| 12 | W3C WAI, An alt Decision Tree. https://www.w3.org/WAI/tutorials/images/decision-tree/ | G | Full page |
| 13 | W3C, WebVTT: The Web Video Text Tracks Format. https://www.w3.org/TR/webvtt1/ | S | First third |
| 14 | W3C, Vibration API. https://www.w3.org/TR/vibration/ | S | Full page |
| 15 | Braille Authority of North America, Guidelines and Standards for Tactile Graphics, 2010. https://www.brailleauthority.org/tg/web-manual/tgmanual.html | S | Through section 6.4 |
| 16 | MPEG-I part 31, Haptics coding (ISO/IEC 23090-31). https://www.mpeg.org/standards/MPEG-I/31 | S | Catalogue page only |
| 17 | ISO 24503:2011, Tactile dots and bars on consumer products. https://www.boutique.afnor.org/en-gb/standard/iso-245032011/ergonomics-accessible-design-using-tactile-dots-and-bars-on-consumer-produc/xs118364/117309 | S | Catalogue page only |
| 18 | C2PA, Content Credentials technical specification 2.2. https://spec.c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html | S | About two thirds |
| 19 | IPTC, Photo Metadata User Guide, with the Digital Source Type vocabulary. https://www.iptc.org/std/photometadata/documentation/userguide/ and https://cv.iptc.org/newscodes/digitalsourcetype/ | S | Guidance section |
| 20 | schema.org, `digitalSourceType` and `IPTCDigitalSourceEnumeration`. https://schema.org/digitalSourceType | S | Full pages |
| 21 | ID3v2.4.0 native frames, Mutagen's mirror of the id3.org text. https://mutagen-specs.readthedocs.io/en/latest/id3/id3v2.4.0-frames.html | S | Frame definitions |
| 22 | Regulation (EU) 2024/1689, Article 50, unofficial copy. https://artificialintelligenceact.eu/article/50/ | O | Full page |
| 23 | European Commission, Code of Practice on transparency of AI-generated content. https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content | G | Policy page only |
| 24 | YouTube Help, Disclosing use of altered or synthetic content. https://support.google.com/youtube/answer/14328491 | G | Full page |
| 25 | Xiph.Org, Ogg Vorbis comment field specification. https://xiph.org/vorbis/doc/v-comment.html | S | Full page |
| 26 | Git, git-interpret-trailers. https://git-scm.com/docs/git-interpret-trailers | G | Full page |
| 27 | FSFE, REUSE Specification 3.3. https://reuse.software/spec-3.3/ | S | Relevant sections |
| 28 | Android, `VibrationEffect` reference. https://developer.android.com/reference/android/os/VibrationEffect | G | Full page |
| 29 | NO_COLOR. https://no-color.org/ | O | Full page |
| 30 | ITU-R, Recommendation M.1677-1, International Morse code, 2009. https://www.itu.int/rec/R-REC-M.1677-1-200910-I/en | S | Full text, decoded from the PDF. The @ row didn't decode |
| 31 | Wikipedia, "Prosigns for Morse code". https://en.wikipedia.org/wiki/Prosigns_for_Morse_code | O | Full article |
| 32 | Wikipedia, "Morse code". https://en.wikipedia.org/wiki/Morse_code | O | First two thirds |
| 33 | 47 CFR 11.31, EAS protocol, Cornell Law School copy. https://www.law.cornell.edu/cfr/text/47/11.31 | S | Full text |
| 34 | Wikipedia, "Alert Ready". https://en.wikipedia.org/wiki/Alert_Ready | O | Full article |
| 35 | Wikipedia, "Greenwich Time Signal". https://en.wikipedia.org/wiki/Greenwich_Time_Signal | O | Full article |
| 36 | Wikipedia, "Precise tone plan". https://en.wikipedia.org/wiki/Precise_tone_plan | O | Full article |
| 37 | Electronic Security Association, "Carbon Monoxide: The Invisible Life Safety Risk", quoting NFPA 72. https://esaweb.org/carbon-monoxide-the-invisible-life-safety-risk/ | O | Full article |
| 38 | Wikipedia, "Fire alarm notification appliance". https://en.wikipedia.org/wiki/Fire_alarm_notification_appliance | O | Coding section |
| 39 | Wikipedia, "Back-up beeper". https://en.wikipedia.org/wiki/Back-up_beeper | O | Full article |
| 40 | Ribeiro Ferreira and others, "Capturing the attentional response to clinical auditory alarms: An ERP study on priority pulses", *PLOS ONE*, 2023. https://europepmc.org/article/PMC/PMC9934403 | J | Passages on the pointers |
| 41 | "Improved pointer in auditory alarms enhances response accuracy", *BJA Open*, 2025. https://europepmc.org/article/PMC/PMC11952019 | J | Passages on the pointers |
| 42 | Wikipedia, "Emergency Alert System". https://en.wikipedia.org/wiki/Emergency_Alert_System | O | First part |

Libraries and tools:

| # | Library | Licence the page states | Use |
|---|---|---|---|
| L1 | Tone.js. https://github.com/Tonejs/Tone.js | MIT | Level cue in a browser |
| L2 | Web Audio API. https://www.w3.org/TR/webaudio/ | W3C specification | Level cue with `OscillatorNode` |
| L3 | Web Speech API. https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API | Browser API | Spoken tag |
| L4 | eSpeak NG. https://github.com/espeak-ng/espeak-ng | GPL 3 or later | Spoken tag, partial SSML |
| L5 | Piper. https://github.com/OHF-Voice/piper1-gpl | GPL 3.0 | Spoken tag, neural voice |
| L6 | liblouis. https://github.com/liblouis/liblouis | LGPL 2.1 or later (library) | Braille strings |
| L7 | Mutagen. https://mutagen.readthedocs.io/en/latest/ | GPL 2 or later | ID3 and Ogg tags |
| L8 | ExifTool. https://exiftool.org/ | Same terms as Perl | XMP and IPTC |
| L9 | c2pa-rs. https://github.com/contentauth/c2pa-rs | MIT and Apache 2.0 | C2PA manifests |

Not opened, so not used:

- Gaver 1986, "Auditory icons: using sound in computer interfaces". The publisher and ACM pages refused the request.
- Walker, Nance and Lindsay 2006 on spearcons. 4 hosts refused. The handbook chapter's summary of it is quoted in its place.
- Brown, Brewster and Purchase 2005, and Brown and Brewster 2006, on Tacton identification rates. These are the most likely sources for touch data.
- Apple Core Haptics documentation.
- ISO's own pages for 24503, 11683 and 9241-910.
- The Official Journal text of the EU AI Act.
- ISO 8201, IEC 60601-1-8, SAE J994 and ITU-T E.180. Each is behind a paywall or didn't open.
- The Canadian alert tone's own guidance page, which refused the connection.
- Any vendor page that documents an operating system's sounds note by note.
