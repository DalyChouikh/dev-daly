---
name: Stardust Professional
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#bccbb9'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#869585'
  outline-variant: '#3d4a3d'
  surface-tint: '#4ae176'
  primary: '#4be277'
  on-primary: '#003915'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#006e2f'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#bac8e1'
  on-tertiary: '#233144'
  tertiary-container: '#9eadc5'
  on-tertiary-container: '#334155'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  section-padding-lg: 120px
  section-padding-sm: 64px
---

## Brand & Style

This design system is crafted for a high-end personal brand that bridges the gap between technical expertise and creative innovation. The aesthetic is "Cosmic Glassmorphism"—a sophisticated blend of deep space motifs and modern UI patterns. 

The brand personality is **visionary, technical, and premium**. It utilizes a "stardust" backdrop to evoke a sense of infinite scale, while grounded by sharp, functional UI elements. The style leverages deep dark canvases, vibrant accents for focal points, and translucent layers to create a multi-dimensional digital environment.

**Key Stylistic Pillars:**
- **Glassmorphism:** Use of backdrop blurs and subtle white borders to define interactive surfaces.
- **Vibrant Precision:** The use of #22C55E is intentional and sparse, reserved for high-value actions and critical status indicators.
- **Atmospheric Depth:** Layering elements through z-index and varied blur intensities to simulate physical distance.

## Colors

The palette is anchored by a deep obsidian background, allowing the primary emerald green to pop with maximum luminance. 

- **Primary (#22C55E):** The "action" color. Used for primary buttons, active navigation states, and highlighting key technical skills.
- **Surface (Dark/Glass):** A series of semi-transparent slates (`rgba(15, 23, 42, 0.6)`) that provide the glass effect when layered over the stardust background.
- **Accents:** Subtle green glows are used as underlays for cards and section transitions to maintain the "energy" of the brand.
- **Text:** High-contrast white for headings to ensure readability against dark backgrounds, with muted slate-gray for secondary metadata.

## Typography

The typography system balances modern sans-serif fonts for professional impact with monospaced fonts for technical credibility.

- **Headlines:** Use **Hanken Grotesk** for its sharp, contemporary geometry. Tighten letter spacing on large display text to create a more impactful, editorial feel.
- **Body:** **Inter** is the workhorse for readability. Its neutral character ensures that the focus remains on the content.
- **Technical/Labels:** **JetBrains Mono** is used for the timeline dates, technical stacks, and metadata to reinforce the Software/AI Engineer persona.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Rhythm:** All spacing is derived from a 4px base unit. 
- **Breathing Room:** Significant vertical padding (`section-padding-lg`) is used between portfolio sections to allow the stardust background to "breathe" and prevent visual clutter.
- **Containment:** Content is centered within a 1280px max-width container, while background elements and glass navigation bars may stretch to the full viewport width.

## Elevation & Depth

Elevation is achieved through translucency and light rather than traditional drop shadows.

1.  **Level 0 (Background):** The stardust gradient with a grain/noise overlay.
2.  **Level 1 (Cards/Containers):** `rgba(255, 255, 255, 0.03)` fill with a `20px` backdrop-blur. A `1px` border of `rgba(255, 255, 255, 0.1)` defines the edge.
3.  **Level 2 (Hover States):** When a card or button is hovered, increase border opacity to `rgba(34, 197, 94, 0.4)` and add a subtle `0px 0px 30px rgba(34, 197, 94, 0.15)` outer glow.
4.  **Floating Elements:** Social icons and navigation bars use higher backdrop blur (`40px`) to appear visually "closer" to the user.

## Shapes

The shape language is consistently **Rounded**.

- **Standard Elements:** Cards, input fields, and standard buttons use a `0.5rem` (8px) radius.
- **Large Components:** Sections like the "View Resume" button in the header or large project containers use `rounded-xl` (24px) to feel more inviting.
- **Navigation:** The global navigation bar uses a fully pill-shaped design (`rounded-full`) to emphasize its floating, glass-like quality.

## Components

### Buttons
- **Primary:** Solid #22C55E background with white or dark slate text. Includes a slight scale-up (1.02x) on hover.
- **Secondary/Outline:** Transparent background with a 1px white border (30% opacity). On hover, the border turns #22C55E and a subtle green glow appears.
- **Ghost:** No border or background, green text, used for less prominent actions.

### Cards (Project/Experience)
Cards feature a glassmorphism base. Upon hover, a green gradient "border-beam" or subtle glow should activate, highlighting the card's boundaries. The inner content should remain legible with a clear hierarchy between titles (Hanken Grotesk) and descriptions (Inter).

### Custom Timeline Component
- **Line:** A 2px vertical line with a gradient transition from transparent to #22C55E.
- **Nodes:** Pulsing green circles that act as anchors for specific years or roles.
- **Labels:** Dates should be set in JetBrains Mono for a technical, data-driven look.

### Input Fields
Dark, semi-transparent backgrounds with #22C55E focus rings. Labels should be small and positioned above the field in Inter Medium.