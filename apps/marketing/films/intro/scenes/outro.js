import { impulse, prog, tween } from '#lib/anim.js';
import { attr, h, set, split } from '#lib/dom.js';
import { clamp, inQuad, outExpo, snap, swift } from '#lib/ease.js';
import { defineScene } from '#lib/scene.js';
import { C, FONT } from '#theme';
import { icon } from '#ui/icons.js';
import { logoMark } from '#ui/logo.js';
import { CTA, SITE, TAGLINE } from '../copy.js';
import { DURATION, SPANS } from '../timeline.js';
import { gradientText, headline, riseWords } from '../ui/type.js';

const WORDS = ['Agent-native.', 'Visual.', 'Presentable.', 'Portable.'];
const WORD_AT = [50.0, 50.5, 51.0, 51.5];
const HIT = 52.0;
const DARTS_IN = 51.88;
const MARK = 180;
const CUE = { tag: 52.5, cmd: 53.2, site: 53.6, sheen: 54.4, fade: DURATION - 1.2 };

export default defineScene({
  name: 'outro',
  span: SPANS.outro,
  sfx: [
    ...WORD_AT.map((t, i) => [t, 'slam', 0.45 + i * 0.08]),
    [51.0, 'riser', 0.7, { dur: 1 }],
    ...[0, 1, 2, 3].map((i) => [HIT + 0.02 + i * 0.04, 'dart', 0.4 + i * 0.1]),
    [HIT, 'impact', 1],
    [CUE.cmd, 'pop', 0.55],
    [CUE.site, 'blip', 0.45],
    [CUE.sheen, 'shimmer', 0.5],
  ],
  build(root) {
    set(root, { background: '#000' });
    const words = WORDS.map((w, i) =>
      h('div', {
        text: w,
        style: `position:absolute;left:0;right:0;top:445px;text-align:center;font-family:${FONT.sans};font-size:200px;font-weight:800;letter-spacing:-0.055em;line-height:1;white-space:nowrap;opacity:0;${i === WORDS.length - 1 ? gradientText() : 'color:#f5f5f7'}`,
      }),
    );
    const bloom = h('div', {
      class: 'fill',
      style:
        'background:radial-gradient(45% 50% at 50% 38%, oklch(0.6 0.2 25 / 0.3), transparent 70%);opacity:0',
    });
    const mark = logoMark({ size: MARK, tile: false });
    const word = h('div', {
      style: `font-family:${FONT.sans};font-size:150px;font-weight:700;letter-spacing:-0.055em;line-height:1;color:#f5f5f7;white-space:nowrap;padding-bottom:14px`,
    });
    const chars = split(word, 'open-slide', { by: 'char', mask: true });
    const lockup = h(
      'div',
      { style: 'position:absolute;left:50%;top:360px;display:flex;align-items:center;opacity:0' },
      h('div', { style: `width:${MARK}px;height:${MARK}px;flex:none;margin-right:-6px` }, mark.el),
      word,
    );
    const tag = headline(TAGLINE, {
      size: 56,
      weight: 600,
      color: 'rgb(245 245 247 / 0.86)',
      top: 540,
      accent: ['agents.'],
    });
    const cmd = h(
      'div',
      {
        class: 'mono',
        style:
          'position:absolute;left:50%;top:680px;display:flex;align-items:center;gap:22px;padding:22px 32px;border-radius:18px;background:rgb(255 255 255 / 0.07);box-shadow:inset 0 0 0 1px rgb(255 255 255 / 0.12);font-size:38px;color:#f5f5f7;white-space:nowrap;opacity:0',
      },
      h('span', { text: '$', style: `color:${C.brand}` }),
      h('span', { text: CTA }),
      h('span', { style: 'color:rgb(255 255 255 / 0.4);display:flex' }, icon('copy', { size: 30 })),
    );
    const site = h(
      'div',
      {
        style: `position:absolute;left:0;right:0;top:846px;display:flex;justify-content:center;gap:24px;font-family:${FONT.sans};font-size:40px;font-weight:600;letter-spacing:-0.02em;color:#f5f5f7;opacity:0`,
      },
      h('span', { text: SITE }),
      h('span', { text: '·', style: 'color:rgb(255 255 255 / 0.35)' }),
      h('span', {
        text: 'Free & open source',
        style: 'color:rgb(255 255 255 / 0.55);font-weight:500',
      }),
    );
    const black = h('div', { class: 'fill', style: 'background:#000;opacity:0' });
    root.append(...words, bloom, lockup, tag.el, cmd, site, black);
    return {
      words,
      bloom,
      mark,
      chars,
      lockup,
      tag,
      cmd,
      site,
      black,
      lw: lockup.offsetWidth,
      lh: lockup.offsetHeight,
      cw: cmd.offsetWidth,
    };
  },
  update(s, _t, T) {
    s.words.forEach((el, i) => {
      const on = T >= WORD_AT[i] && T < (WORD_AT[i + 1] ?? DARTS_IN);
      const p = prog(T, WORD_AT[i], 0.35, outExpo);
      set(el, {
        opacity: on ? 1 : 0,
        transform: `scale(${1.25 - 0.25 * p})`,
        filter: on && p < 0.99 ? `blur(${(1 - p) * 14}px)` : 'none',
      });
    });

    const post = T >= DARTS_IN;
    s.mark.darts.forEach((g, i) => {
      const land = HIT + 0.02 + i * 0.04;
      const p = clamp((T - DARTS_IN) / (land - DARTS_IN));
      attr(g, 'transform', `translate(${(-1400 * (1 - snap(p))).toFixed(1)} 0)`);
      attr(g, 'opacity', post ? 1 : 0);
    });
    attr(
      s.mark.glow,
      'opacity',
      (prog(T, HIT - 0.05, 0.1) * (0.35 + impulse(T, HIT, 0.5) * 0.65)).toFixed(3),
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
    const push = tween(T, HIT, 6, 0.97, 1.02, (x) => x);
    set(s.lockup, {
      opacity: post ? 1 : 0,
      transform: `translate(${-s.lw / 2}px, ${-s.lh / 2}px) scale(${push + impulse(T, HIT, 0.3) * 0.03})`,
    });
    set(s.bloom, { opacity: T < HIT ? 0 : 0.4 + impulse(T, HIT, 0.4) * 0.6 });
    riseWords(s.tag.words, T, CUE.tag, { gap: 0.06 });
    const cp = prog(T, CUE.cmd, 0.7, outExpo);
    set(s.cmd, {
      opacity: cp,
      transform: `translate(${-s.cw / 2}px, ${(1 - cp) * 24}px)`,
      filter: cp < 0.99 ? `blur(${(1 - cp) * 8}px)` : 'none',
    });
    const sp = prog(T, CUE.site, 0.7, outExpo);
    set(s.site, { opacity: sp, transform: `translateY(${(1 - sp) * 18}px)` });
    set(s.black, { opacity: prog(T, CUE.fade, 1.1, swift) });
  },
});
