# Specification Quality Checklist: Intello Bilingual Marketing Website

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-11-17
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- Validation run 1 of 3: all items pass. The body of the spec contains no framework, language, library or hosting terms; the only named service (Higgsfield) appears in Assumptions as a dependency.
- Zero [NEEDS CLARIFICATION] markers. Gaps were filled with documented defaults in Assumptions (page set, starting copy, no live tracking, light theme only, no analytics, video omitted until supplied).
- **Resolved**: Principle I was amended in constitution v1.3.0 to permit reviewed, photographic AI-generated imagery (FR-034 to FR-036), so it no longer blocks `/speckit-plan`.
- **Client inputs needed before launch** (not before planning): phone and hours, enquiry recipient address(es), sending mailbox, privacy notice text, confirmation of any "24/7" claim, optional company video.
- **Other dependencies**: the Higgsfield connector is confirmed working in this session (Plus plan, 421.75 credits on 2026-11-17), and each generation batch needs owner approval; form controls must be added to the design system (constitution Principle VIII).
- Largest scope lever: the six-page set in FR-001. Trimming it (for example to Home and Contact first) is the quickest way to shorten the build.

## Imagery and performance results (2026-11-17)

- **Owner approval (T095)**: the owner asked for the images to be generated with Higgsfield in this session. Spend: 17.75 credits (hero 2.75 at high quality, 15 images at 1 credit each), model `gpt_image_2_6`, webp, 2k. Balance before: 421.75.
- **Review (T100, assistant pass)**: all 16 images are monochrome and photographic, with no embedded text, logos or recognisable faces (people appear only from behind or far away); the scanner image shows a plain barcode with no readable characters. They are set to `approved: true` in `content/images.json` so the owner can judge them on the live pages; the owner can set any image back to `false` (the page then shows the art-direction slot) or ask for a regeneration.
- **Files**: 3 widths each (480, 960, 1600 px webp) plus `og.jpg`; hero 480 px file is 33 KB against the 150 KB budget; `public/img` totals 3.0 MB.
- **Lighthouse mobile, local (T102)**: /es/ performance 98, accessibility 100, best-practices 100, SEO 100, LCP 2.41 s, CLS 0.000, TBT 0 ms; /en/ the same. Services and Contact pages score 100 with LCP under 1.5 s. Targets: performance 90+, accessibility 95+, LCP 2.5 s or less, CLS 0.1 or less. Re-run against the live domain at deploy (`node tools/lighthouse.mjs --base https://domain /es/`).

## Hero and width change (2026-11-18)

- **Hero image**: replaced the warehouse photo with a container ship carrying many containers (Higgsfield `gpt_image_2_6`, 16:9, high quality, 2.75 credits per generation; two generations, the second used because the ship sits in the right half and leaves a pale area for the headline; about 5.5 credits). Ship, hull and containers are plain and unmarked (no name, lettering, logo or flag). The picture now spans the full width of the hero (`Hero` with `media`, design system change recorded in `Hero/README.md`), with a 2000 px file for large screens. The unused first ship variant and the old warehouse original are kept in `tools/raw-images/` (not in the repository).
- **Wider layout**: `container-max` raised from 1240px to 1400px in `tokens.json` and `tokens.css`, README updated, constitution PATCH 1.3.2 (Principle IV range and Quality Gate 4 widths now include 1440px).
- **Results**: 145 tests pass; axe clean at 360, 1240 and 1440 px on every page; no horizontal overflow at 360, 768, 1240 and 1440 px; Lighthouse mobile /es/ and /en/: performance 100, accessibility 100, best-practices 100, SEO 100, LCP 1.6 s, CLS 0.
