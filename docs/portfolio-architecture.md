# Portfolio architecture

## Public rendering

`app/page.tsx` reads the validated content through `lib/data.ts` and composes typed server components. `lib/portfolio.ts` owns featured selection, stable career ordering, supported section ordering, and PDF text normalization. The page order comes from `data/site.json`; missing required public sections are appended so published configuration cannot accidentally remove career or contact content.

The public section components receive their data as props. Navigation does not import the complete content store into a client component. Community, certifications, and spoken languages are grouped within About; all twelve projects remain available between Selected work and Other projects.

Only three public components require JavaScript:

- `MobileNav` adds Escape and close-on-navigation behavior to native `<details>`.
- `ContactForm` validates native inputs, blocks duplicate submissions, disables pending fields, checks the service response, and preserves the draft on failure.
- `PortfolioMotion` applies once-only native reveal animations to already-visible HTML. It disconnects observers and cancels animations on cleanup or a reduced-motion preference change.

The hero uses a bounded CSS animation. Reduced motion disables travel and smooth scrolling. Content and native project disclosures work without JavaScript; sending the contact form requires JavaScript and an email provider configured on the server.

`app/portfolio.css` scopes the Olive design to `.portfolio-shell`; admin pages retain their existing theme. Hanken Grotesk and the admin fonts load locally through `next/font/local`. The previous public animation wrappers, glass-card components, duplicated design constants, and unused Framer Motion dependency have been removed.

## Content and media

Continue editing the existing `data/*.json` through Git or `/admin`. Optional presentation fields preserve compatibility with existing projects and generated drafts:

- Profile: `displayName`, `introduction`, and `bio` paragraphs.
- Project: `displayTitle`, `category`, `engineeringIntro`, `featured`, `media`, and `gallery`.
- Site: `featuredProjectIds`, an ordered array of existing project IDs. An empty array uses optional project `featured` flags. Unselected projects remain in the archive, sorted by year.

An image media object contains `type: "image"`, a rooted `src`, descriptive `alt`, and positive integer `width`/`height`. Video uses `type: "video"` and requires a rooted `poster` as well. Galleries contain image objects. These paths refer to files under `public/`; publishing JSON does not upload the underlying image or video file. Add new media to Git before referencing it through the admin. External, protocol-relative, query/hash, and traversal media paths are rejected by the publishing schema.

The original TapNShow film is stored at `public/media/projects/tapnshow-launch.mp4`. It uses native controls, inline playback, metadata preload, and a poster; it never autoplays. Its SHA-256 is `170f2c50c7bfef20db85197de586756d3df87a2c5d4e35d9befa84eae1030fba`.

`public/brand/` contains the selected A logo system, downloadable kit, usage guide, and sharing image. `components/brand/BrandLogo.tsx` renders the same path geometry with `currentColor`; the mark does not depend on a font. App icons use Next.js file conventions.

## Admin and delivery

The signed-session, route authorization, schema validation, and optimistic GitHub revision workflow remain in place. Every optional display field must survive `SectionDataSchemas` parsing before it can be published. A failed deployment does not replace the editor’s latest GitHub content with older bundled JSON.

`/api/contact` remains the delivery service. Browser tests intercept successful and failed delivery responses, so they verify UI behavior without sending email. Real delivery requires the provider credentials described in the root README.

## Motion studies

`docs/motion/olive/` holds standalone Hyperframes and Remotion studies. Their dependencies, preview commands, and validation evidence belong to those isolated packages. They are excluded from the application TypeScript and ESLint projects and are not shipped in the website’s JavaScript. The website uses native CSS and Web Animations for its interactive motion.

## Verification

Run `bun run typecheck`, `bun run lint`, `bun test tests`, `bun run build`, and `bun run test:e2e`. The browser suite covers the published content, complete archive details, desktop/tablet/phone layouts, navigation, contact outcomes, video playback/seeking, no-JavaScript rendering, and the existing admin security workflow. Run `bun audit` for the application dependency tree. Motion packages have their own commands and lockfiles.
