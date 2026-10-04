---
name: PrestaShop
description: Corporate PrestaShop deck — flat pastel or black canvases, all-caps Arial Black headlines, wordmark header and confidentiality footer.
mode: light
---

# PrestaShop

Extracted from the "Template Corporate PrestaShop" Google Slides master.

## Palette

| Role     | Value     | Notes                                                       |
| -------- | --------- | ----------------------------------------------------------- |
| bg       | `#A4DBE8` | signature light blue — default canvas for covers and content |
| text     | `#000000` | all copy on pastel and white canvases                       |
| accent   | `#A4DBE8` | key numbers and highlights on black canvases                |
| muted    | `#9E9E9E` | secondary copy, chart gridlines                             |
| ink      | `#000000` | alternate canvas (inverted pages), table headers, buttons   |
| paper    | `#FFFFFF` | alternate canvas, cards on pastel pages                     |
| mint     | `#BDE9C9` | chapter / section canvas                                    |
| sand     | `#F8E08E` | chapter / section canvas                                    |
| lavender | `#DECDE7` | chapter / section canvas                                    |
| green    | `#50A684` | data series, success                                        |
| orange   | `#FFBF3F` | data series, warning                                        |
| violet   | `#8659B5` | data series                                                 |
| line     | `#D9D9D9` | hairlines, table borders on white                           |

Canvas rule: one flat colour per page, never a gradient. Rotate `bg`, `mint`, `sand`, `lavender` for section dividers; use `ink` for emphasis pages (key figures, quotes) with white text and `accent` numbers.

## Typography

- Display font: `'Arial Black', 'Archivo Black', Arial, sans-serif` — weight 900, **always uppercase**, tight line-height (1.0).
- Body font: `Arial, Helvetica, sans-serif` — weight 400; weight 700 for the lead paragraph ("level 1").
- No webfont needed: Arial and Arial Black are system fonts.
- Type scale (1920 × 1080):
  - Hero title (cover): 132 px, line-height 1.0.
  - Chapter title: 104 px, preceded by its number (`1.`) on its own line.
  - Slide heading: 48 px.
  - Subtitle: 48 px on covers, 30 px under slide headings, weight 400, sentence case.
  - Lead text (level 1): 30 px bold. Body (level 2): 28 px. Bullets (level 3): 22 px.
  - Key figure: 168 px display font in `accent`.
  - Header wordmark: 20 px display font; header deck label: 16 px uppercase.
  - Footer copyright: 13 px; page number: 16 px.

## Layout

- Content padding: 80 px left/right. Header sits 36 px from the top, footer 36 px from the bottom.
- Alignment: left-aligned, single column. Covers and chapters are vertically centred; content pages stack heading + subtitle at the top (top 150 px) and body below.
- Every page except the closer carries the header (wordmark left, `TITLE — MONTH YEAR` label at the horizontal centre) and the footer (confidentiality line centred, page number right).
- Cards on pastel pages are flat white rectangles, no radius, no shadow. Tables use black header cells with white uppercase text.

## Fixed components

### Header

```tsx
const Header = ({ label = 'TITLE — MONTH YEAR', color = '#000000' }: { label?: string; color?: string }) => (
  <div
    style={{
      position: 'absolute',
      top: 36,
      left: 80,
      right: 80,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'baseline',
      color,
    }}
  >
    <span style={{ fontFamily: "'Arial Black', 'Archivo Black', Arial, sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: '0.02em' }}>
      PRESTASHOP
    </span>
    <span style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, textTransform: 'uppercase' }}>{label}</span>
    <span />
  </div>
);
```

### Footer

Pull the page number from `useSlidePageNumber()` — never hardcode it.

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const Footer = ({ color = '#000000' }: { color?: string }) => {
  const { current } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        bottom: 36,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'baseline',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color,
      }}
    >
      <span />
      <span style={{ fontSize: 13 }}>
        © 2026 PrestaShop - a Fortidia Company. This document contains confidential information. Reproduction and distribution are not authorized.
      </span>
      <span style={{ fontSize: 16, textAlign: 'right' }}>{current}</span>
    </div>
  );
};
```

### Title

```tsx
const Title = ({ children, size = 132, color = '#000000' }: { children: React.ReactNode; size?: number; color?: string }) => (
  <h1
    style={{
      fontFamily: "'Arial Black', 'Archivo Black', Arial, sans-serif",
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1,
      textTransform: 'uppercase',
      margin: 0,
      color,
    }}
  >
    {children}
  </h1>
);
```

Use `size={48}` for slide headings and `size={104}` for chapter titles.

### Subtitle

```tsx
const Subtitle = ({ children, size = 30, color = '#000000' }: { children: React.ReactNode; size?: number; color?: string }) => (
  <p style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: size, lineHeight: 1.3, margin: '12px 0 0', color }}>
    {children}
  </p>
);
```

### KeyFigure

```tsx
const KeyFigure = ({ value, label, children }: { value: string; label: string; children: React.ReactNode }) => (
  <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#FFFFFF' }}>
    <div style={{ fontFamily: "'Arial Black', 'Archivo Black', Arial, sans-serif", fontWeight: 900, fontSize: 168, lineHeight: 1, color: '#A4DBE8' }}>
      {value}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: '#A4DBE8', marginTop: 20 }}>{label}</div>
    <div style={{ fontSize: 26, lineHeight: 1.35, marginTop: 6 }}>{children}</div>
  </div>
);
```

## Motion

- Philosophy: **static**. The corporate template has no animation; pages cut. Use `<Steps>` for progressive reveal when needed, never decorative motion.

## Aesthetic

Bold, flat, corporate-confident. Big all-caps Arial Black headlines on full-bleed pastel colour fields (blue, mint, sand, lavender) or on black, with plain Arial body copy. No gradients, no rounded corners, no shadows, no photos as backgrounds except deliberate full-bleed images. Every page carries the PRESTASHOP wordmark and the confidentiality footer. Avoid mixing more than one pastel per page and avoid lowercase headlines.

The header wordmark is typeset text standing in for the official PrestaShop logo; swap in the logo asset when one is available in `assets/`.

## Example usage

```tsx
const Cover: Page = () => (
  <div style={{ width: '100%', height: '100%', background: '#A4DBE8', position: 'relative', padding: '0 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Header />
    <Title>Title of the<br />presentation</Title>
    <Subtitle size={48}>Subtitle</Subtitle>
    <Footer />
  </div>
);
```
