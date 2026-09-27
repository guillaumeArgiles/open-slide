import { h } from '#lib/dom.js';
import { DARK as P, FONT } from '#theme';
import { icon } from '#ui/icons.js';
import { auroraCard } from './deck.js';

// Recreation of core's presenter route (routes/presenter.tsx), laid out at a
// fixed 1600 × 800.
export const PRESENTER = { w: 1600, h: 800, pad: 28, head: 64, foot: 64, cur: 1000, next: 500 };

const eyebrow = (label) =>
  h('div', {
    class: 'mono',
    text: label,
    style: `font-size:15px;letter-spacing:0.14em;text-transform:uppercase;color:${P.mutedFg}`,
  });

const glyph = (name) =>
  name === 'square'
    ? h('span', {
        style: 'width:14px;height:14px;margin:0 2px;border-radius:2px;background:currentColor',
      })
    : icon(name, { size: 18 });

const btn = (iconName, label, trailing = false) =>
  h(
    'div',
    {
      style: `height:40px;padding:0 16px;border-radius:8px;border:1px solid ${P.border};display:flex;align-items:center;gap:8px;font-size:17px;font-weight:500;color:${P.fg}`,
    },
    trailing ? null : glyph(iconName),
    label,
    trailing ? glyph(iconName) : null,
  );

export function presenterView({ pages, notes }) {
  const { w, h: hh, pad, head, foot, cur, next } = PRESENTER;
  const counter = h('span', { text: '03' });
  const timer = h('span', { class: 'nums', text: '00:00' });
  const header = h(
    'div',
    {
      style: `position:absolute;left:0;top:0;width:${w}px;height:${head}px;display:flex;align-items:center;justify-content:space-between;padding:0 ${pad}px;border-bottom:1px solid ${P.hairline}`,
    },
    h(
      'div',
      { style: 'display:flex;align-items:center;gap:16px' },
      eyebrow('Presenter'),
      h('span', { text: 'Aurora', style: 'font-size:20px;font-weight:600;letter-spacing:-0.01em' }),
      h('span', { style: `color:${P.mutedFg};display:flex` }, icon('chevron-down', { size: 16 })),
    ),
    h(
      'div',
      { style: `display:flex;align-items:center;gap:36px;font-family:${FONT.mono}` },
      h(
        'div',
        { style: 'display:flex;align-items:center;gap:12px;font-size:22px' },
        h('span', { style: `color:${P.mutedFg};display:flex` }, icon('timer', { size: 20 })),
        timer,
      ),
      h(
        'div',
        { style: 'font-size:24px' },
        counter,
        h('span', { text: ' / ', style: 'color:oklch(0.93 0 0 / 0.3)' }),
        h('span', { text: '08', style: `color:${P.mutedFg}` }),
      ),
    ),
  );

  const stack = (width, ids) => {
    const cards = ids.map((i) => auroraCard(i, width, { radius: 10, shadow: false }));
    const el = h(
      'div',
      {
        style: `position:relative;width:${width}px;height:${(width * 9) / 16}px;border-radius:10px;overflow:hidden;background:#000;box-shadow:0 0 0 1px ${P.border}`,
      },
      cards.map((c) => c.el),
    );
    return { el, cards };
  };
  const current = stack(
    cur,
    pages.map((p) => p[0]),
  );
  const upNext = stack(
    next,
    pages.map((p) => p[1]),
  );
  const noteEls = notes.map((n) =>
    h('div', {
      text: n,
      style: `position:absolute;left:0;top:0;width:${next}px;font-size:25px;line-height:1.5;color:${P.fg}`,
    }),
  );
  const body = h(
    'div',
    {
      style: `position:absolute;left:${pad}px;top:${head + pad}px;right:${pad}px;display:flex;gap:${pad}px`,
    },
    h(
      'div',
      { style: 'display:flex;flex-direction:column;gap:14px' },
      eyebrow('Now showing'),
      current.el,
    ),
    h(
      'div',
      { style: 'display:flex;flex-direction:column;gap:14px' },
      eyebrow('Up next'),
      upNext.el,
      h('div', { style: 'height:14px' }),
      eyebrow('Speaker notes'),
      h('div', { style: 'position:relative' }, noteEls),
    ),
  );
  const footer = h(
    'div',
    {
      style: `position:absolute;left:0;bottom:0;width:${w}px;height:${foot}px;display:flex;align-items:center;justify-content:space-between;padding:0 ${pad}px;border-top:1px solid ${P.hairline}`,
    },
    h(
      'div',
      { style: 'display:flex;gap:10px' },
      btn('chevron-left', 'Prev'),
      btn('chevron-right', 'Next', true),
    ),
    h(
      'div',
      { style: 'display:flex;gap:10px' },
      btn('square', 'Black'),
      btn('sun', 'White'),
      btn('rotate-cw', 'Reset'),
    ),
  );
  const el = h(
    'div',
    {
      style: `position:absolute;left:0;top:0;width:${w}px;height:${hh}px;border-radius:18px;overflow:hidden;background:${P.background};color:${P.fg};font-family:${FONT.sans};box-shadow:0 0 0 1px rgb(255 255 255 / 0.08), 0 60px 140px -30px rgb(0 0 0 / 0.9)`,
    },
    header,
    body,
    footer,
  );
  return { el, counter, timer, current, upNext, noteEls };
}
