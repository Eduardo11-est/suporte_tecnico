---
name: Technical Support System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: JetBrains Mono
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
  base: 4px
  container-max: 1440px
  gutter: 24px
  sidebar-width: 260px
  margin-sm: 16px
  margin-md: 24px
  margin-lg: 32px
---

## Brand & Style
The design system is engineered for a **Professional Integrated Technical Support Web App**, prioritizing clarity, efficiency, and trust. The target audience includes IT administrators, support engineers, and technical stakeholders who require immediate access to dense information without cognitive overload.

The style is **Corporate / Modern**, leaning into a systematic, utility-first aesthetic. It utilizes a structured hierarchy, high-quality typography, and purposeful whitespace to facilitate quick scanning of support tickets and system statuses. The interface remains understated to allow critical data—such as priority alerts and performance metrics—to remain the primary focus.

## Colors
The palette is rooted in a professional "Enterprise Blue" spectrum. 

- **Primary (#0f172a):** Reserved for high-level navigation (sidebar) and primary branding elements to establish a grounded, authoritative foundation.
- **Background (#f8fafc):** A cool, light gray that reduces eye strain during long working sessions.
- **Surface (#ffffff):** Used for cards, tables, and input areas to create clear contrast against the background.
- **Semantic Colors:** Used strictly for status indication. Critical (Red) and Warning (Amber) should be used sparingly to ensure they retain their psychological urgency.

## Typography
This design system utilizes **Inter** for all UI elements due to its exceptional legibility in data-heavy environments. 

- **Headlines:** Use Bold or SemiBold weights with slight negative letter-spacing to maintain a compact, "engineered" look.
- **Body:** The default size is 14px (`body-md`) for standard data density, while 16px is used for long-form documentation or ticket descriptions.
- **Labels:** Small, uppercase labels are used for table headers and section overviews to differentiate metadata from primary content.
- **Monospace:** For ticket IDs, IP addresses, or technical logs, a secondary monospace font (JetBrains Mono) is recommended for character distinction.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. The sidebar remains at a fixed width (260px), while the main content area expands to fill the remaining width up to a maximum of 1440px to ensure line lengths remain readable on ultrawide monitors.

- **Grid:** A 12-column grid is used for dashboard layouts. 
- **Rhythm:** An 8px/4px linear scale governs all padding and margins. 
- **Mobile Adaptation:** At the 768px breakpoint, the sidebar collapses into a hamburger menu or a bottom navigation bar, and horizontal padding reduces to 16px.

## Elevation & Depth
Hierarchy is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Level 0 (Background):** #f8fafc.
- **Level 1 (Cards/Surfaces):** White (#ffffff) with a 1px border (#e2e8f0).
- **Level 2 (Dropdowns/Modals):** White with a soft, neutral shadow (0 4px 6px -1px rgb(0 0 0 / 0.1)) to provide separation without breaking the flat professional aesthetic.
- **Interaction:** Hover states on interactive rows or cards should use a subtle tint change (Background #f1f5f9) rather than increasing elevation.

## Shapes
The shape language is **Soft** (0.25rem / 4px). This radius is applied to buttons, input fields, and status badges. Larger components like dashboard cards use 8px (`rounded-lg`) to provide a distinct structural container. The 4px radius strikes a balance between the precision of sharp corners and the modern feel of rounded UI, maintaining a tool-like appearance.

## Components
- **Buttons:** Primary buttons use the Secondary Blue (#3b82f6) with white text. Tertiary buttons are "Ghost" style (borderless) with blue or navy text to reduce visual noise in toolbars.
- **Status Badges:** Small, rounded-sm pills with a 10% opacity background of the semantic color and 100% opacity text of the same color (e.g., Red text on a pale pink background for "Critical").
- **Data Tables:** Clean rows with 1px bottom borders. No vertical borders. Headers use `label-md` typography with a subtle background tint.
- **Input Fields:** 1px #e2e8f0 border, 4px radius. Focus state uses a 2px blue ring with an offset.
- **Dashboard Cards:** White background, 1px border, 8px padding. Titles are always `headline-sm`.
- **Side Navigation:** Deep navy (#0f172a) background. Active states use a left-aligned 4px blue accent bar and a subtle background highlight. Icons should be "Line" style for clarity.
- **Searchable Headers:** A persistent top bar containing a global search input with a magnifying glass icon and user profile utility.