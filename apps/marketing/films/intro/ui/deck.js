import { h } from '#lib/dom.js';
import { FONT } from '#theme';

// "Aurora", the sample keynote the agent writes in the film. 1920 × 1080 slide
// pixels; every accent reads `--accent` so a hot reload can recolor it.
export const ACCENT = '#ff5a1f';
export const ACCENT_2 = '#7c5cff';
const BG = '#0b0b10';
const FG = '#f5f5f7';
const MUTED = 'rgb(245 245 247 / 0.55)';
const A = 'var(--accent)';

const abs = (style, ...children) => h('div', { style: `position:absolute;${style}` }, ...children);

const eyebrow = (text, y = 140) =>
  abs(
    `left:140px;top:${y}px;font-family:${FONT.mono};font-size:28px;letter-spacing:0.28em;color:${A};white-space:nowrap`,
    text,
  );

const display = (lines, style) =>
  abs(
    `font-family:${FONT.sans};font-weight:800;letter-spacing:-0.05em;line-height:0.95;color:${FG};white-space:nowrap;${style}`,
    lines.flatMap((l, i) => (i ? [h('br'), l] : [l])),
  );

const folio = (n) =>
  abs(
    `right:140px;bottom:110px;font-family:${FONT.mono};font-size:24px;letter-spacing:0.1em;color:${MUTED}`,
    `${String(n).padStart(2, '0')} / 08`,
  );

const orb = (style) =>
  abs(
    `border-radius:50%;background:radial-gradient(circle at 34% 30%, #ffe2b0 0%, color-mix(in oklch, ${A} 85%, #ffd08a) 26%, ${A} 52%, color-mix(in oklch, ${A} 40%, transparent) 70%, transparent 72%);filter:saturate(1.1);${style}`,
  );

const PAGES = [
  () => [
    orb('left:1060px;top:120px;width:840px;height:840px'),
    eyebrow('KEYNOTE · 2026'),
    display(['Aurora'], 'left:128px;top:360px;font-size:300px'),
    abs(
      `left:140px;top:720px;font-family:${FONT.sans};font-size:64px;font-weight:500;letter-spacing:-0.03em;color:${MUTED};white-space:nowrap`,
      'Light, for every room.',
    ),
  ],
  () => [
    eyebrow('THE PROBLEM'),
    display(['Most rooms', 'are lit wrong.'], 'left:136px;top:330px;font-size:170px'),
    abs(`left:140px;top:760px;width:260px;height:12px;border-radius:6px;background:${A}`),
  ],
  () => [
    eyebrow('EFFICIENCY'),
    abs(
      `left:110px;top:170px;font-family:${FONT.sans};font-size:620px;font-weight:800;letter-spacing:-0.07em;line-height:1;color:${A}`,
      '3×',
    ),
    display(['brighter,', 'at half the', 'power.'], 'left:1080px;top:380px;font-size:110px'),
  ],
  () => [
    eyebrow('ADOPTION'),
    display(['Growing every', 'quarter.'], 'left:136px;top:230px;font-size:110px'),
    abs(
      'left:140px;right:140px;bottom:170px;height:420px;display:flex;align-items:flex-end;gap:36px',
      [22, 34, 41, 55, 68, 100].map((v, i, all) =>
        h('div', {
          style: `flex:1;height:${v}%;border-radius:18px 18px 6px 6px;background:${i === all.length - 1 ? A : 'rgb(245 245 247 / 0.16)'}`,
        }),
      ),
    ),
  ],
  () => [
    abs(
      `left:140px;top:150px;font-family:${FONT.sans};font-size:260px;font-weight:800;line-height:1;color:${A}`,
      '“',
    ),
    display(['It feels like', 'morning, all day.'], 'left:136px;top:380px;font-size:150px'),
    abs(
      `left:140px;top:760px;font-family:${FONT.sans};font-size:48px;font-weight:500;color:${MUTED}`,
      '— Early tester',
    ),
  ],
  () => [
    eyebrow('HOW IT WORKS'),
    abs(
      'left:140px;right:140px;top:300px;height:600px;display:flex;gap:44px',
      ['Sense.', 'Adapt.', 'Glow.'].map((w, i) =>
        h(
          'div',
          {
            style: `position:relative;flex:1;border-radius:36px;background:rgb(245 245 247 / 0.06);box-shadow:inset 0 0 0 2px rgb(245 245 247 / 0.08);overflow:hidden`,
          },
          h('div', {
            style: `position:absolute;left:0;right:0;top:0;height:14px;background:${A};opacity:${1 - i * 0.25}`,
          }),
          h('div', {
            text: `0${i + 1}`,
            style: `position:absolute;left:56px;top:80px;font-family:${FONT.mono};font-size:40px;color:${MUTED}`,
          }),
          h('div', {
            text: w,
            style: `position:absolute;left:52px;bottom:70px;font-family:${FONT.sans};font-size:120px;font-weight:800;letter-spacing:-0.05em;color:${FG}`,
          }),
        ),
      ),
    ),
  ],
  () => [
    eyebrow('ROADMAP'),
    display(['What’s next.'], 'left:136px;top:250px;font-size:150px'),
    abs('left:140px;right:140px;top:700px;height:4px;background:rgb(245 245 247 / 0.2)'),
    ...['Prototype', 'Beta', 'Launch', 'Scale'].map((label, i) =>
      abs(
        `left:${140 + i * 520}px;top:676px`,
        h('div', {
          style: `width:52px;height:52px;border-radius:50%;background:${i === 2 ? A : BG};box-shadow:inset 0 0 0 6px ${i === 2 ? A : 'rgb(245 245 247 / 0.5)'}`,
        }),
        h('div', {
          text: `Q${i + 1}`,
          style: `margin-top:40px;font-family:${FONT.mono};font-size:34px;color:${MUTED}`,
        }),
        h('div', {
          text: label,
          style: `margin-top:8px;font-family:${FONT.sans};font-size:58px;font-weight:700;letter-spacing:-0.03em;color:${FG}`,
        }),
      ),
    ),
  ],
  () => [
    orb('left:560px;top:-260px;width:800px;height:800px;opacity:0.9'),
    display(['Thank you.'], 'left:0;right:0;top:470px;text-align:center;font-size:250px'),
  ],
];

export const PAGE_COUNT = PAGES.length;

export function auroraPage(i, { accent = ACCENT } = {}) {
  return h(
    'div',
    {
      style: `position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;background:${BG};--accent:${accent}`,
    },
    PAGES[i](),
    i > 0 && i < PAGES.length - 1 ? folio(i + 1) : null,
  );
}

// A page scaled into a w-wide card.
export function auroraCard(i, w, { accent = ACCENT, radius = 12, shadow = true } = {}) {
  const page = auroraPage(i, { accent });
  page.style.transformOrigin = '0 0';
  page.style.transform = `scale(${w / 1920})`;
  const el = h(
    'div',
    {
      style: `position:absolute;left:0;top:0;width:${w}px;height:${(w * 9) / 16}px;overflow:hidden;border-radius:${radius}px;background:${BG};${shadow ? 'box-shadow:0 0 0 1px rgb(255 255 255 / 0.06), 0 30px 60px -20px rgb(0 0 0 / 0.45)' : ''}`,
    },
    page,
  );
  return { el, page };
}
