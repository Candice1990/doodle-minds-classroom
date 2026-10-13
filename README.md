# Doodle Minds classroom materials

Pumpkin Party is a collection of teacher-operated, story-led computer science lessons for children aged 5–7. Each lesson keeps its code, pictures, voice assets and printable worksheet together.

| Lesson | Concept | Source | Printable worksheet | Website selection |
|---|---|---|---|---|
| 1 | Sequence | `lesson-01/` | `output/pdf/lesson-01-sequence-worksheet.pdf` | Selected for publishing |
| 2 | Missing instruction | `lesson-02/` | `output/pdf/lesson-02-missing-instruction-worksheet.pdf` | Backup |
| 3 | Directions | `lesson-03/` | `output/pdf/lesson-03-directions-worksheet.pdf` | Backup |
| 4 | Debugging | `lesson-04/` | `output/pdf/lesson-04-debugging-worksheet.pdf` | Draft backup |

## Build and publish

Run `python3 tools/build-pages.py` to build the website under `docs/`. Only lessons with `published: true` in `courses.json` are included. The site preserves relative asset and PDF links, so it works under a GitHub Pages repository path.

On GitHub, enable Pages with GitHub Actions as the publishing source. The Pages workflow builds and deploys the selected lessons on every push to `main`. Each lesson has its own stable URL ending in `/lesson-01/`, `/lesson-02/`, and so on; the homepage lists published lessons.

## Complete a lesson

Verify the lesson logic, classroom layout, actual voice playback and worksheet PDF. Update the lesson files, regenerate and inspect its PDF, then update the catalogue and commit the changes. After deployment, open the public lesson URL and check its audio and PDF links before sharing.

The design and production guidance is backed up under `skills/children-story-lessons/`. Keep source changes and PDF exports in the same commit. Do not upload credentials, local environments, student data or unrelated personal files.
