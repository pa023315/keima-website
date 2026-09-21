# KEIMA Typography and Layout Refinement

Date: 2026-09-21  
Status: Approved direction — awaiting written-spec review  
Selected direction: C — restrained consultancy

## Goal

Refine the existing bilingual, single-page KEIMA website so it reads as a precise digital consultancy brand. The work focuses on typography, type scale, spacing, alignment, and responsive composition. Existing copy, section order, brand colors, logo assets, links, and motion behavior remain unchanged. Reveal wrappers may receive spacing-only CSS adjustments to prevent clipping.

## Design diagnosis

The current page gives too many English display headings equal visual priority. The About and Philosophy headings dominate their sections, body copy is comparatively faint, and several desktop grids do not share a consistent baseline. The profile section also splits visual weight unevenly between its heading and biography. On mobile, navigation labels and metadata are too small while display headings remain disproportionately large.

## Visual direction

Use a restrained editorial-consultancy system: calm, deliberate, and highly legible, while preserving the existing asymmetrical grid, black/paper/cyan palette, diagonal geometry, and geometric logo.

The page should feel designed through proportion rather than decoration. Strong contrast remains at the hero, philosophy, and contact moments; informational sections use quieter hierarchy and more consistent rhythm.

## Typography system

- Retain Instrument Sans for Latin text and Noto Sans TC for Traditional Chinese. These fonts already align with the logo's geometric character and provide reliable bilingual metrics.
- Reduce the maximum display-heading sizes by 25 percent in About, Philosophy, Profile, and Contact, with fluid scaling between mobile and desktop breakpoints.
- Use fewer extreme weights. Display headings should remain assertive without appearing compressed into a solid block; body copy should use regular or medium weight.
- Body text should use 17–20 px on desktop, with a line height of 1.7–1.85 and a readable line length of 28–34 Chinese characters.
- Eyebrows, indices, metadata, and navigation should share one small-text system with consistent weight, tracking, and casing.
- Explicit line breaks may be used for English display copy where they create a deliberate composition; responsive widths must not produce isolated words or awkward widows.

## Layout and spacing

### Header and hero

- Keep the fixed header and centered navigation.
- Slightly tighten navigation tracking while maintaining accessible hit areas.
- Keep the logo as the hero focal point and preserve the diagonal black field.
- Reduce vertical gaps between the logo, Chinese statement, English supporting line, and discipline list so the hero reads as one composed unit.

### Positioning

- Reduce the English display statement so it occupies a controlled left column rather than overwhelming the viewport.
- Align the Chinese introduction with the lower third of the display heading.
- Increase body-copy contrast and keep the belief statement separated by a clear rule.

### Approach and In Motion

- Use the same row grid in both sections.
- Align index, English title, Chinese label, description, and action arrow on consistent columns and baselines.
- Reduce row-title size and preserve generous but controlled vertical padding.
- Ensure descriptions remain clearly subordinate without becoming faint.

### Philosophy

- Keep the black full-width brand moment.
- Reduce the display heading and use a deliberate three-line composition at widths of 1024 px and above; allow natural responsive wrapping below that breakpoint.
- Maintain generous negative space around the symbol and Chinese statement.

### Profile

- Keep the heading in the left column and personal information in the right column.
- Treat role, name, fields, and biography as four distinct levels.
- Reduce the name scale and give the biography a stable reading width.
- On tablet and mobile, stack the heading above the profile card with a compact gap rather than a large empty interval.

### Contact and footer

- Reduce the contact display heading so the email action remains visible within the section's initial viewport.
- Strengthen the relationship between invitation copy and email link.
- Keep footer content secondary and aligned with the main grid.

## Responsive behavior

- Desktop: preserve the 12-column editorial grid and asymmetry.
- Tablet: collapse to six columns. Section headings span the first three columns and supporting copy spans the final three; row-based sections use three columns. At widths below 768 px, all sections stack into one reading flow.
- Mobile: use a four-column structure and a single reading flow.
- Raise mobile navigation text from its current undersized treatment, tighten labels where needed, and preserve six equal tap zones.
- Display headings must scale down more aggressively than body copy.
- No section may create horizontal overflow at 360, 390, 768, 1024, or 1440 px widths.

## Accessibility and motion

- Preserve semantic heading order, focus states, reduced-motion behavior, and minimum 44 px interactive targets.
- Improve secondary-text contrast rather than relying on very light gray.
- Typography changes must not introduce layout shifts after font loading.
- Existing motion remains, but spacing changes must not cause reveal elements to overlap or appear clipped.

## Verification

- Add end-to-end checks for the new typographic hierarchy and responsive geometry before changing production CSS.
- Validate at desktop, tablet, and mobile viewports.
- Confirm no horizontal overflow, clipped headings, overlapping rows, or undersized mobile navigation.
- Run unit tests, type checking, linting, production build, and the complete Playwright suite.
- Complete a visual pass in the local browser for Traditional Chinese and English pages.

## Out of scope

- Rewriting approved copy
- Changing the information architecture or section order
- Adding a form, CMS, new imagery, social links, or legal content
- Replacing the logo or brand palette
- Redesigning the motion system beyond adjustments required by the refined layout
