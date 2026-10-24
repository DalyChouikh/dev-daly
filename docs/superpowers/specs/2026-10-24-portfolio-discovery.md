# Portfolio redesign discovery

Status: final Olive editorial page approved by the user; logo exploration in progress before implementation.

## Preview access

Final Olive-only review: https://dev-daly-c6ibiumdi-dalychouikhs-projects.vercel.app

Previous complete two-direction review: https://dev-daly-cqrwk1njp-dalychouikhs-projects.vercel.app

Original three-direction review: https://dev-daly-ro2lfyw1a-dalychouikhs-projects.vercel.app

Use this HTTPS preview instead of the local brainstorming server. The local server returned HTTP 200 inside the work environment, but the user's browser could not reach its localhost address. The hosted review is an isolated static Vercel preview and uses the project's existing Vercel sign-in protection. Its authenticated HTTP response was verified to return 200 and contain all three concepts.

The production domain still points to deployment `dpl_FEXomQBFhsRdso8a6Ps5U1nsfwqE`; publishing this preview did not replace it.

## Confirmed direction from the user

- Selected Olive editorial after reviewing the complete pages. Requested a final Olive-only mockup with a heavier wordmark and professional-experience company names before implementation approval.
- Primary audience: recruiters and engineering teams.
- Freedom to explore a new visual identity, including palette and the illustrated avatar.
- Work step by step, showing mockups and visualizations before rebuilding.
- Include purposeful animation and motion; consult the design, Hyperframes, and Remotion skills.
- Rewrite TapNShow's weak project bullets in the existing portfolio.

## First-pass audit

The current foundation remains useful: Next.js App Router, typed JSON with Zod validation, cached server content loaders, a secured admin publishing flow with GitHub revisions, and regression coverage. The redesign should preserve those strengths.

Measured with Chromium at 1440, 768, and 390 pixels:

| Width | Page height | Approximate viewport lengths | Raster pictures |
| --- | --- | --- | --- |
| 1440 | 9,594px | 10.7 | 1 |
| 768 | 11,296px | 11 | 1 |
| 390 | 17,536px | 20.8 | 1 |

The single raster picture is the illustrated avatar. Projects have no interface imagery on the current page. The inspector found no horizontal overflow at these widths. Its aesthetic flags are design heuristics, not security defects or accessibility conformance results; individual findings need visual judgment.

Confirmed code and content issues:

- `app/page.tsx` places projects after skills, experience, and education, and does not use `data/site.json`'s `sectionOrder`.
- The configured navigation includes About, but the public page has no About section.
- `Navbar.tsx` imports `getNavItems` from a constants module that imports server-oriented content loaders. Pass navigation data from a server component instead.
- Design values are repeated in `app/globals.css`, `lib/constants.ts`, and `DESIGN.md`.
- Reveal helpers initialize content at opacity zero and have no explicit reduced-motion policy.
- All projects receive the same text-card layout. The content model has no first-class media, case-study structure, featured selection, or technical-decision narrative.
- The generic admin editor combines fetching, save state, and recursive field rendering in one approximately 400-line file.

## The argument for the new portfolio

1. Identify Mohamed Ali Chouikh and his software/AI focus immediately, with a direct route to work and résumé.
2. Prove the claim through selected projects, real product interfaces, and specific engineering decisions.
3. Make the remaining work browsable without putting every full project description on the homepage.
4. Add concise career and education context, with the complete chronology available in the résumé.
5. Offer a clear contact path.

No project impact figures, customer logos, endorsements, or performance results will be invented. Missing case-study facts should be requested when developing the chosen direction.

## Three visual studies

The design skill dealt three directions with seed `1667249922`. Records and previews are saved in the local, ignored `.superpowers/brainstorm/13035-1792856090/` session.

| Concept | Direction | Type and palette | Tradeoff |
| --- | --- | --- | --- |
| A: Olive editorial | Name as a monument | Hanken Grotesk; bone and olive | Recommended starting point: clear identity, readable work, modest motion complexity |
| B: Carmine window | Pinned poster | Schibsted Grotesk; carmine, pink, and charcoal | More expressive; the project window needs careful mobile and reduced-motion treatment |
| C: Type & contrast | Type-only statement | Imbue / Albert Sans; blush and aubergine | More personal and unconventional; less immediate product imagery in the opening |

Subject-specific idea: the range from TapNShow's one-tap meeting responses to Within's AI-driven board actions becomes the material for the work showcase. Visitors see the actual interface each engineering story produced.

Redraws: A's original Fontshare type choice could not be downloaded because its CDN was unreachable, so its type slot was redrawn to Hanken Grotesk. B's original hero required a room photograph that does not belong to this subject; it was redrawn to a window that opens around actual product imagery. Other direction and palette choices were retained.

The prototypes use actual public TapNShow and Within captures. They are visual studies, not complete production pages or an approved redesign. The local board provides desktop/tablet/phone preview controls, proposed architecture, the motion plan, and audit findings.

## Proposed architecture, pending agreement

- Keep existing JSON files and publishing paths under `data/`; extend schemas for featured projects and case studies rather than changing the storage system during a visual redesign.
- Keep route files thin; use a public site layout for shared navigation/footer and the existing separate admin layout.
- Organize public project, profile/career, and contact components by feature. Split admin API hooks, editor state, and field primitives into bounded modules.
- Isolate session handling and GitHub, email, and AI integrations as server-only modules.
- Keep shared schemas usable by APIs and editors without importing server code into client components.
- Establish one source for color, typography, spacing, and motion tokens.
- Add a curated homepage, a work archive, and project case-study routes; agree the content fields and public URLs before implementation.

## Motion process

After choosing a direction, design the selected homepage and a representative case study, including the phone composition. Review a short, seekable Hyperframes HTML study for the hero-to-work transition and a frame-based Remotion React study for a project walkthrough or timing alternative. Do not export a video unless requested.

The website should use a small browser motion layer with deliberate entrances and clear control feedback. Hyperframes and Remotion are authoring/review tools here; loading both rendering frameworks into every portfolio page is not the default proposal. Preserve native scrolling, keyboard navigation, visible content without animation, and a complete reduced-motion layout.

Current visual prototypes use native browser/CSS motion only. Hyperframes/Remotion compositions have not yet been authored; that follows the visual-direction decision.

## TapNShow content update

The entry in `data/projects.json` now has a concrete tagline, the actual stack, and six action-led bullets covering the product, Gmail OAuth, its PostgreSQL outbox, database access controls, imports/exports, and PWA/Web Push reminders. The source is [TapNShow's current README](https://github.com/DalyChouikh/TapNShow/blob/main/README.md), SHA `05a6fb001e0b530015a8b011f7d3b8f833c67151`.

This is a local content update awaiting the next integration step. All 39 existing unit tests pass with the revised entry; no public application layout has been changed.

## Second review: complete Olive and Carmine studies

The user liked both Olive editorial and Carmine window and requested complete mockups before choosing. Both now include all four professional roles, two degrees, all seven skill groups, twelve projects (two featured and ten expandable archive entries), community work, both certifications, languages, contact details, and a contact form. Content comes from the existing JSON files; the previews normalize PDF line breaks and use past tense for the completed Savagesse internship without changing those source files.

- [Olive editorial, complete](https://dev-daly-cqrwk1njp-dalychouikhs-projects.vercel.app/files/olive-full.html)
- [Carmine window, complete](https://dev-daly-cqrwk1njp-dalychouikhs-projects.vercel.app/files/carmine-full.html)

The review board supports desktop, tablet, and phone previews, jumping to sections, and comparing section screenshots. The full-page links work directly on a phone. The contact forms demonstrate native validation and preview feedback; they make no email request. Project details use native expandable disclosures. Carmine retains the central Within window from the first study and provides a static reduced-motion version. Olive has a brief name reveal and restrained control feedback.

The user supplied `D:\Documents\options\brag-cinematic-v2.mp4`, accessible here at `/mnt/d/Documents/options/brag-cinematic-v2.mp4`. Both mockups include that original 43.2-second H.264/AAC, 1920×1080 film with native controls, inline playback, metadata preloading, a poster extracted at 40 seconds, and no autoplay. The 11,512,463-byte file was copied unchanged; SHA-256 is `170f2c50c7bfef20db85197de586756d3df87a2c5d4e35d9befa84eae1030fba`. Provenance and verification records are saved with the ignored review artifacts under `.superpowers/brainstorm/13035-1792856090/full-round/`.

Validation: Chromium at 1440×1000, 768×1024, and 390×844 confirmed no horizontal overflow, broken images, missing navigation anchors, or JavaScript errors. All required content counts passed. Video playback and seeking, project disclosures, mobile menus, review controls, form validation, absence of form POSTs, and reduced-motion visibility passed. The copied MP4 hash matches its source. Hosted board, both mockups, and CSS returned HTTP 200. A hosted video range request returned HTTP 206 with `Content-Type: video/mp4`, the correct total length, and bytes matching the original. Production still resolves to `dpl_FEXomQBFhsRdso8a6Ps5U1nsfwqE`.

The design inspector's final runs reported zero failures with three explicit heuristic exceptions: real dates/captions remain despite its eyebrow rule; the selected real screenshots and supplied film remain without adding imagery just to meet a quota; and complete motion choreography is deferred until the visual direction is selected. Remaining warnings are the broad prototype type scale and Carmine's rectangular image bounds overlapping the title's bounds despite the visual clip. The title fades before the expanding visible window reaches it. These are documented design-tool judgments, not assertions of accessibility conformance. The Next.js application has not been rebuilt as part of these mockups.

## Next review

The user approved the final Olive-only typography refinement. Both `daly.` wordmarks and all four experience company headings use native Hanken Grotesk weight 800. Company headings follow the requested larger scale: 70px on the tested desktop, 40px on tablet, and 43px on phone. The rest of the full-page content is preserved, including the original TapNShow film. No second direction is generated or included in the new artifact. Review files and verification are under `.superpowers/brainstorm/13035-1792856090/olive-final/`.

The focused browser check passed at 1440, 768, and 390 pixels: the intended font weight is loaded, every company name stays on one line, no horizontal overflow occurs, all original content counts are present, navigation works, and the final review's device controls work. The film hash is unchanged. The design inspector reported zero failures using the same documented prototype exceptions as the second review; its type-scale warning remains for the later token consolidation.

The user then requested a logo redesign with mockups. The installed logo-design skill is applied, with the public name Daly, audience, bold character, and olive/bone palette taken from the approved page. The current site's plain Daly navigation text and independent generic D favicon were inspected. Ten concept statements were considered; three distinct approaches were drawn as vector paths: A, a custom lowercase wordmark with a d-and-dot companion; B, an inset DC monogram; C, a D with a 45-degree cut and matching ascender cuts in the wordmark. The logo letters are hand-constructed paths rather than font-dependent text. Logo concept brief, iterations, test sheets, vector sources, and verification are under `.superpowers/brainstorm/13035-1792856090/logo-round/`.

The review shows each direction in the approved portfolio (header/footer/favicon), a browser tab with 16/24/32/64px sizes, a circular profile avatar, a résumé header, and a contact card. Portfolio content and the original TapNShow film remain intact. Six portfolio views and the interactive board at desktop/tablet/phone widths passed browser checks without horizontal overflow or JavaScript errors. The SVGs have no live text, raster, filters, or masks. The monogram was refined to open its internal gap; the wordmark's period spacing and y angles were refined after the first render. These are concept mockups; final chosen-logo exports and icon assets follow selection.

The portfolio layout is already approved and should not be re-submitted as an unresolved visual direction. After selecting/refining the logo, prepare its final assets and carry the approved page into the implementation plan, project-story structure, and Hyperframes/Remotion motion studies.
