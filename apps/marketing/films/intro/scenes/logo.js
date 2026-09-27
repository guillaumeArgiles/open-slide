import { impulse, prog, tween } from '#lib/anim.js';
import { attr, h, set, split } from '#lib/dom.js';
import { clamp, inQuad, outExpo, snap } from '#lib/ease.js';
import { defineScene } from '#lib/scene.js';
import { C, FONT } from '#theme';
import { logoMark } from '#ui/logo.js';
import { TAGLINE } from '../copy.js';
import { SPANS } from '../timeline.js';
import { headline, riseWords } from '../ui/type.js';

const HIT = 6.0;
const MARK = 230;
const CUE = { tag: 7.0, agents: 8.0, sheen: 8.6 };
const AGENTS = ['Claude Code', 'Codex', 'Cursor', 'any agent'];

export default defineScene({
  name: 'logo',
  span: SPANS.logo,
  sfx: [
    ...[0, 1, 2, 3].map((i) => [HIT - 0.12 + i * 0.04, 'dart', 0.4 + i * 0.1]),
    [HIT, 'impact', 0.9],
    [CUE.tag, 'swell', 0.4],
    [CUE.agents, 'blip', 0.4],
    [CUE.sheen, 'shimmer', 0.5],
  ],
  build(root) {
    const bg = h('div', { class: 'fill', style: 'background:#000;opacity:0' });
    const bloom = h('div', {
      class: 'fill',
      style:
        'background:radial-gradient(45% 50% at 50% 44%, oklch(0.6 0.2 25 / 0.32), transparent 70%);opacity:0',
    });
    const mark = logoMark({ size: MARK, tile: false });
    const word = h('div', {
      style: `font-family:${FONT.sans};font-size:170px;font-weight:700;letter-spacing:-0.055em;line-height:1;color:#f5f5f7;white-space:nowrap;padding-bottom:16px`,
    });
    const chars = split(word, 'open-slide', { by: 'char', mask: true });
    const lockup = h(
      'div',
      { style: 'position:absolute;left:50%;top:40%;display:flex;align-items:center' },
      h('div', { style: `width:${MARK}px;height:${MARK}px;flex:none;margin-right:-8px` }, mark.el),
      word,
    );
    const tag = headline(TAGLINE, {
      size: 60,
      weight: 600,
      color: 'rgb(245 245 247 / 0.86)',
      top: 640,
      accent: ['agents.'],
    });
    const agents = h(
      'div',
      {
        class: 'mono',
        style:
          'position:absolute;left:0;right:0;top:776px;display:flex;justify-content:center;gap:26px;font-size:30px;letter-spacing:0.06em;color:rgb(245 245 247 / 0.6);white-space:nowrap',
      },
      AGENTS.flatMap((a, i) => [
        i ? h('span', { text: '·', style: `color:${C.brand}` }) : null,
        h('span', { text: a }),
      ]),
    );
    root.append(bg, bloom, lockup, tag.el, agents);
    return {
      bg,
      bloom,
      mark,
      chars,
      lockup,
      tag,
      agents,
      lw: lockup.offsetWidth,
      lh: lockup.offsetHeight,
    };
  },
  update(s, _t, T) {
    set(s.bg, { opacity: prog(T, 5.25, 0.45) });
    s.mark.darts.forEach((g, i) => {
      const land = HIT - 0.12 + i * 0.04;
      const p = clamp((T - (land - 0.45)) / 0.45);
      attr(g, 'transform', `translate(${(-1800 * (1 - snap(p))).toFixed(1)} 0)`);
      attr(g, 'opacity', T < land - 0.45 ? 0 : 1);
    });
    attr(
      s.mark.glow,
      'opacity',
      (prog(T, HIT - 0.1, 0.2) * (0.35 + impulse(T, HIT, 0.5) * 0.65)).toFixed(3),
    );
    attr(
      s.mark.sheen,
      'transform',
      `translate(${(prog(T, CUE.sheen, 1, inQuad) * 840 - 200).toFixed(1)} 0)`,
    );
    s.chars.forEach((c, i) => {
      const p = prog(T, HIT + 0.04 + i * 0.03, 0.7, outExpo);
      set(c.inner, { transform: `translateX(${(1 - p) * -105}%)`, opacity: p > 0 ? 1 : 0 });
    });
    const push = tween(T, HIT, 4.4, 0.97, 1.03, (x) => x);
    set(s.lockup, {
      transform: `translate(${-s.lw / 2}px, ${-s.lh / 2}px) scale(${push + impulse(T, HIT, 0.3) * 0.03})`,
    });
    set(s.bloom, { opacity: T < HIT ? 0 : 0.45 + impulse(T, HIT, 0.4) * 0.55 });
    riseWords(s.tag.words, T, CUE.tag, { gap: 0.07 });
    const ap = prog(T, CUE.agents, 0.7, outExpo);
    set(s.agents, {
      opacity: ap,
      transform: `translateY(${(1 - ap) * 16}px)`,
      filter: ap < 0.99 ? `blur(${(1 - ap) * 8}px)` : 'none',
    });
  },
});
