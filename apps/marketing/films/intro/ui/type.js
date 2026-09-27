import { prog } from '#lib/anim.js';
import { h, set, split } from '#lib/dom.js';
import { outExpo, snap } from '#lib/ease.js';
import { FONT } from '#theme';

export const INK = '#1d1d1f';
export const STAGE_LIGHT =
  'radial-gradient(120% 90% at 50% 0%, #ffffff 0%, #f5f5f7 55%, #e8e8ed 100%)';
export const STAGE_DARK = 'radial-gradient(120% 90% at 50% 0%, #111114 0%, #050505 60%, #000 100%)';
export const WARM = 'linear-gradient(95deg, #ff4d2e 0%, #ff7a3d 45%, #ffb45e 100%)';

export const gradientText = (bg = WARM) =>
  `background:${bg};-webkit-background-clip:text;background-clip:text;color:transparent`;

// A centered headline split into words. Words listed in `accent` get the warm
// gradient.
export function headline(str, { size = 96, weight = 700, color = INK, top, accent = [] } = {}) {
  const el = h('div', {
    style: `position:absolute;left:0;right:0;top:${top}px;text-align:center;font-family:${FONT.sans};font-size:${size}px;font-weight:${weight};letter-spacing:-0.045em;line-height:1.05;color:${color};white-space:nowrap`,
  });
  const words = split(el, str, { by: 'word' });
  for (const w of words) {
    if (accent.includes(w.text)) w.inner.style.cssText += `;${gradientText()}`;
  }
  return { el, words };
}

// Apple-style reveal: each word rises a little out of a blur.
export function riseWords(words, T, start, { gap = 0.08, dur = 0.9, dist = 36 } = {}) {
  words.forEach((w, i) => {
    const p = prog(T, start + i * gap, dur, snap);
    const b = 1 - prog(T, start + i * gap, dur * 0.7, outExpo);
    set(w.inner, {
      opacity: Math.min(1, p * 1.4),
      transform: `translateY(${(1 - p) * dist}px)`,
      filter: b > 0.01 ? `blur(${b * 14}px)` : 'none',
    });
  });
}

// 1 → 0 with a soft blur and a slight lift; returns the remaining visibility.
export function blurOut(el, T, start, dur = 0.5, { dy = -16, scale = 1 } = {}) {
  const p = prog(T, start, dur, outExpo);
  set(el, {
    opacity: 1 - p,
    transform: `translateY(${p * dy}px) scale(${1 + (scale - 1) * p})`,
    filter: p > 0.01 ? `blur(${p * 18}px)` : 'none',
  });
  return 1 - p;
}
