# Approved Olive portfolio design

The user approved the final Olive page and selected logo A, Daly signature. This records the approved decisions for implementation; another visual-direction approval is not needed.

## Public experience

Use the final Olive editorial mockup as the visual reference: bone `#ecebe7`, olive `#38450f`, locally served Hanken Grotesk, a large two-line name, and bold company names. Use the selected custom `daly.` wordmark in navigation/footer and its d-and-dot companion for favicons and avatars. Preserve all current content sections and the secured admin workflow.

The homepage order is hero, selected work, experience, skills, education, other projects, about/community/certifications/languages, and contact. TapNShow and Within are featured. The other ten projects have native expandable engineering notes. Present all four professional roles and both degrees; sort ongoing work first, then completed roles newest first. Keep programming skills distinct from spoken languages. Normalize extracted PDF line breaks without inventing achievements.

Use the original 43.2-second TapNShow H.264/AAC film with poster, native controls, inline playback, metadata preload, and no autoplay. Preserve the original file bytes. Use the real TapNShow and Within screenshots from the review. The production contact form uses the existing API with native constraints, sending/success/failure feedback, a disabled pending state, and input retention on failure.

The mobile menu, project disclosures, video and form must work with keyboard and touch. Essential content is present in server HTML; motion enhances it. Reduced motion has no travel or hidden content. Preserve native scrolling and visible focus. Add bounded, once-per-section motion and useful hover/press feedback, and keep video authoring dependencies outside the Next.js bundle.

## Architecture

Keep `data/` publishing paths, existing API authorization, optimistic GitHub revisions, session security, and the admin editor. Add optional validated project presentation/media fields so the admin edits the data the public page renders. Site configuration defines the supported order, navigation, and featured selection. Project ordering and date parsing are pure typed helpers; the data module supplies validated server content and is never imported by browser components. Pass navigation/profile props from the server. Keep browser code limited to the mobile menu, contact submission, and motion enhancement. Existing public section files become focused server components rather than duplicating JSON or maintaining separate hardcoded project narratives.

Scope public design tokens to the public portfolio so the admin retains a usable existing theme. Maintain a single public CSS source for color/type/spacing, and a shared vector logo component backed by approved path geometry. Use Next.js file-based static icons as documented by the installed version. Serve images with explicit dimensions and deferred loading; keep the film metadata-only until playback.

## Delivery and verification

Finalize the selected logo as vector, one-color/reversed, small-size, raster, web-icon, and downloadable kit assets, with a compact usage guide. Build bounded Hyperframes/Remotion motion studies independently of the site runtime. Run meaningful helper/schema tests, all existing security tests, typecheck, lint, production build, and browser checks covering the public site plus protected admin flows. Check desktop/tablet/phone visuals against the approved mockup, keyboard navigation, reduced motion, video playback, and contact responses without sending real email.

Prepare an application preview for review. Production promotion is a separate integration step after the working preview, following the user's requested step-by-step process.
