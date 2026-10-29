---
name: Academic Review & Specification Studio
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444651'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006a63'
  on-secondary: '#ffffff'
  secondary-container: '#99efe5'
  on-secondary-container: '#006f67'
  tertiary: '#1d2b3d'
  on-tertiary: '#ffffff'
  tertiary-container: '#334154'
  on-tertiary-container: '#9eadc4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#9cf2e8'
  secondary-fixed-dim: '#80d5cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#00504a'
  tertiary-fixed: '#d5e3fc'
  tertiary-fixed-dim: '#b9c7df'
  on-tertiary-fixed: '#0d1c2e'
  on-tertiary-fixed-variant: '#3a485b'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  tabular-data:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system is tailored for university faculty, curriculum chairs, and accreditation review panels who handle dense, structured course documentation. The aesthetic merges the calm clarity of modern document workspaces with the precision of technical review software.

### Tone & Personality
- **Authoritative & Scholarly:** Grounded, unhurried, and precise without feeling bureaucratic or antiquated.
- **Cognitively Calm:** Reduces visual exhaustion during prolonged grading and curriculum audits by prioritizing neutral white paper surfaces, deliberate negative space, and disciplined typographic weight.
- **Instrument-Grade Clarity:** Crisp boundary definitions, robust table structures, and semantic indicators engineered for instant scannability.

### Visual Style
- **Modern Institutional Utility:** A synthesis of editorial minimalism and modular data tooling.
- **Surface Strategy:** Layered off-white foundations with crisp pure-white documentation sheets, hairline borders, and zero ornamental gradients.
- **Visual Restraint:** Avoids illustrative fluff, stock imagery, or saturated multi-tone decorative fills. Hierarchy is established exclusively through typographic scale, border precision, and intentional status accents.

## Colors

The palette establishes an academic environment through high-contrast structural neutrals and clear semantic signals.

### Core Swatches
- **Primary Navy (`#1E3A8A`):** Anchors high-priority actions, active navigation states, primary buttons, and focal curriculum selections.
- **Secondary Deep Pine (`#0F766E`):** Used for verified outcome nodes, syllabus alignment metrics, and secondary analytical markers.
- **Neutral Slate (`#0F172A`):** The primary foreground text color, engineered for optimal contrast against light surfaces.
- **Muted Body (`#475569`):** Subordinate descriptors, metadata labels, and secondary supporting copy.

### Canvas & Structural Panels
- **App Canvas Base:** Warm Slate 50 (`#F8FAFC`) across shell views; Cool Slate 100 (`#F1F5F9`) for peripheral rails and tool gutters.
- **Document & Tile Surfaces:** Solid White (`#FFFFFF`).
- **Dividers & Structural Borders:** Precise Slate 200 (`#E2E8F0`); subtle interactive borders at Slate 300 (`#CBD5E1`).

### Semantic Status Indicators
Each semantic role relies on paired foreground text and pastel container surfaces:
- **Verified / Aligned:** Text `#15803D` on `#DCFCE7` surface (borders: `#BBF7D0`).
- **Under Review / Caution:** Text `#D97706` on `#FEF3C7` surface (borders: `#FDE68A`).
- **Deficient / Discrepancy:** Text `#B91C1C` on `#FEE2E2` surface (borders: `#FECACA`).
- **Processing / Notice:** Text `#0284C7` on `#E0F2FE` surface (borders: `#BAE6FD`).

## Typography

The type scale relies entirely on Inter to ensure clean rendering on dense matrices, rubric tables, and long-form syllabus text.

### Implementation Guidelines
- **Tabular Alignment:** All numerical outputs, credit tallies, bloom taxonomy levels, and matrix tables must activate OpenType tabular numbers (`font-feature-settings: "tnum" 1, "cv05" 1`).
- **Uppercase Labels:** The `label-sm` token is used for section eyebrows, table headers, and category indicators; pair it with `text-transform: uppercase`.
- **Editorial Legibility:** Body copy (`body-md` and `body-lg`) maintains an optimal line length of 65–78 characters in specification prose panels to preserve reading focus.

## Layout & Spacing

The layout is built for 1366px laptop displays and wider workstation screens. It balances high data density with visual breathing room.

### Shell Architecture
- **Global Header:** Fixed 56px height across the top viewport edge.
- **Left Navigation Rail:** Persistent width of 240px (collapsible to 64px icon-only state for split-view audits).
- **Primary Content Viewport:** Center-staged, fluid document canvas bounded by 1440px maximum reading width for continuous prose, or full-width fluid layouts for multi-column CO-PO mapping matrices.
- **Inspector / Review Sidebar (Right):** Optional 360px contextual panel for validation warnings, comment threads, and compliance rubrics.

### Spacing Engine
- Everything aligns strictly to an 8px base rhythm, with 4px (`space-xs`) reserved for tight internal component padding (badges, compact table cells, dropdown rows).
- Page templates use `margin-desktop` (32px) around primary surfaces to preserve boundary clarity between navigation chrome and editable document whiteboards.

## Elevation & Depth

Depth is established primarily through hairline borders and delicate, low-diffusion shadows, avoiding dramatic skeuomorphism or murky ambient drop shadows.

### Elevation Hierarchy
- **Level 0 (Flat Canvas):** Used for background canvas (`#F8FAFC`). No shadow, no outline.
- **Level 1 (Structural Containers):** Used for cards, panels, document canvases, and tables. Border of `1px solid #E2E8F0` coupled with a subtle shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`.
- **Level 2 (Interactive Floating / Active Cards):** Used for hover states, floating toolbars, and active rubric drawers. Border of `1px solid #CBD5E1` with shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Overlays & Menus):** Role switchers, context menus, and review dropdowns. Shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.

## Shapes

This design system uses a controlled soft-corner visual language (`roundedness: 1`), keeping the interface crisp, compact, and aligned with standard technical software.

### Corner Radii Guidelines
- **Micro Radii (4px / `0.25rem`):** Checkboxes, radio items, status pill containers, tag elements, and contextual toolbar buttons.
- **Standard Radii (6px / `0.375rem`):** Form controls, text input boxes, dropdown selectors, standard buttons, and navigation menu links.
- **Panel Radii (8px / `0.5rem`):** Specification cards, rubric review panes, modal dialogues, and document canvas wrappers.
- **Circular (Full Pill):** Exclusively reserved for status badge pills and user role avatars.

## Components

### Buttons
- **Primary:** Filled `#1E3A8A` background, white text, 6px border radius, 36px standard height (`px: 16px`). Hover: `#172554`. Focus: 2px ring `#93C5FD` offset by 2px.
- **Secondary / Outline:** White surface, border `1px solid #CBD5E1`, text `#0F172A`. Hover: `#F8FAFC` background with border `#94A3B8`.
- **Ghost:** Transparent background, text `#475569`. Hover: background `#F1F5F9`, text `#0F172A`. Used across document navigation actions and icon buttons.
- **Critical:** Filled `#B91C1C` background, white text. Reserved for destructive actions such as course rejection or document purging.

### Chips & Status Badges
- **Dimensions:** Height 22px, padding 2px 8px, font size 11px, weight 600, uppercase letter-spacing.
- **Structure:** 1px border matching the accent tint, accompanying solid 6px indicator dot on the left, followed by the status label.
- **Variants:** Aligned/Approved (`#15803D`), Needs Revision (`#D97706`), Missing Mapping (`#B91C1C`), Draft (`#0284C7`), Archived (`#64748B`).

### Data Tables & Alignment Grids
- **Header Cells:** Background `#F8FAFC`, bottom border `1px solid #E2E8F0`, typography `label-sm` in `#64748B`, height 38px.
- **Data Rows:** Height 44px (default) or 36px (compact density mode). Solid white background, alternating row background optional. Row divider `1px solid #F1F5F9`. Hover row: `#F8FAFC`.
- **Rubric Matrix Cells:** Tabular numerals centered horizontally, interactive dropdowns or numeric inputs styled flush without default drop shadows until focused.

### Form Inputs & Dropdowns
- **Text Inputs:** Height 36px, background `#FFFFFF`, border `1px solid #CBD5E1`, text `body-md` in `#0F172A`, placeholder in `#94A3B8`. Focus: border `#1E3A8A`, outline ring `2px solid rgba(30, 58, 138, 0.15)`.
- **Role Switcher Dropdown:** Embedded inside top bar. Surface `#FFFFFF`, border `1px solid #E2E8F0`, pill badge indicating active view permissions (e.g., "HOD", "Reviewer", "Course Author").

### Navigation Rail
- **Layout:** Vertical column 240px wide, surface `#F8FAFC`, right border `1px solid #E2E8F0`.
- **Item States:** Rest: text `#475569`, icon `#64748B`. Hover: background `#F1F5F9`, text `#0F172A`. Active: background `#EFF6FF`, text `#1E3A8A`, icon `#1E3A8A`, weight 600, accompanied by a 3px vertical accent bar on the left edge.

### Document Specification Cards
- **Structure:** Surface `#FFFFFF`, 1px border `#E2E8F0`, radius 8px, shadow Level 1.
- **Header:** Includes course code tag, revision number, last modified date, and current review status badge.
- **Body:** Course Learning Outcomes (CLOs) linked with Program Outcomes (POs) with visual link indicators.