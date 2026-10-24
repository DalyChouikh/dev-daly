# Daly — logo usage

The selected Daly signature is a custom lowercase wordmark with a detached period. Its d-and-dot symbol carries the same geometry into small spaces. All logo letterforms are filled paths and need no font.

## Choose a file

| Use | File |
| --- | --- |
| Header, résumé, profile | daly-wordmark.svg |
| Avatar or compact signature | daly-symbol.svg |
| Dark olive background | daly-wordmark-reversed.svg or daly-symbol-reversed.svg |
| One-colour reproduction | The -black.svg or -white.svg variants |
| Browser tab | favicon.svg (adaptive), favicon.ico, or png/favicon-16/32/48.png |
| Home-screen / app icon | daly-app-icon.svg or png/apple-touch-icon.png, icon-192.png, icon-512.png |
| Transparent raster artwork | png/daly-wordmark-2040.png (2040 × 864) or png/daly-symbol-2048.png |

Matching black, white and bone reversed transparent PNG masters are also in png/. The full kit is daly-logo-kit.zip.

## Colour

| Colour | HEX | RGB |
| --- | --- | --- |
| Olive | #38450f | 56, 69, 15 |
| Bone | #ecebe7 | 236, 235, 231 |
| Black | #000000 | 0, 0, 0 |
| White | #ffffff | 255, 255, 255 |

Use olive on bone or white, and bone or white on olive or black. The olive/bone pair has approximately 8.7:1 contrast. These are RGB digital masters; ask a printer to proof an appropriate CMYK or spot-colour conversion. No Pantone match is specified.

## Space and size

Keep at least one dot diameter of clear space around the visible artwork: 32 source units, or 4.7% of the wordmark canvas width. The standard viewBoxes retain the approved optical position. Add surrounding space where the built-in margin is smaller.

Use the wordmark at 96 px wide or larger on screens and about 25 mm wide or larger in print. Use the standard symbol from 24 px; use daly-symbol-small.svg for 16–23 px. Its tighter 232 × 232 crop preserves the original paths and the symbol's slightly elevated optical position. Favicons have been checked at 16, 32 and 48 px; the tab icon uses olive on a bone fallback tile, and the SVG automatically switches to bone for dark browser chrome.

## Keep the signature intact

Scale proportionally. Keep the d and dot together. Use the supplied paths instead of typing the name. Keep the original spacing and proportions; place the mark on a calm, high-contrast background. Avoid shadows, outlines, gradients, stretching or rotating the artwork.

The React BrandLogo component accepts variant (wordmark or symbol), className and label. It inherits the current text colour. Its default accessible label is Daly; use an empty label only when an adjacent name already labels the same link.

## Delivery notes

Approved geometry: selected A (Daly signature). Reversed files retain that exact geometry; their colour changes to bone. The small-size source changes the crop only. The app icon uses the same symbol at 82% scale inside an opaque olive square. Transparent PNG masters include the same padding as their SVG sources.

The logo needs no font licence. The site typography is a separate choice. SVG masters are the editable source; PDF, AI, EPS and a legal trademark clearance are not included.
