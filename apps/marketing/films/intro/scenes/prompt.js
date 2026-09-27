import { impulse, keys, prog } from '#lib/anim.js';
import { h, set, text } from '#lib/dom.js';
import { clamp, glide, lerp, outExpo, spring } from '#lib/ease.js';
import { caretOn } from '#lib/fx.js';
import { defineScene } from '#lib/scene.js';
import { C, FONT } from '#theme';
import { PROMPT } from '../copy.js';
import { SPANS } from '../timeline.js';
import { auroraCard, PAGE_COUNT } from '../ui/deck.js';
import { headline, INK, riseWords, STAGE_LIGHT } from '../ui/type.js';

const HIT = 14.0;
const CMD = '/create-slide ';
const TYPED = CMD + PROMPT;
const CPS = 0.035;
const CUE = {
  head: 10.45,
  type: 10.75,
  enter: 12.95,
  out: [13.15, 13.4, 13.7],
  label: 15.0,
};
const OUTPUT = [
  ['⏺', 'Planning 8 pages', 'rgb(255 255 255 / 0.45)'],
  ['⏺', 'Writing slides/aurora/index.tsx', 'rgb(255 255 255 / 0.45)'],
  ['✓', 'Deck ready → localhost:5173/s/aurora', C.emerald],
];
const TERM = { w: 1240, x: 340, y: 330 };
const CARD_W = 380;
const GAP = 28;
const GRID_CY = 590;

export default defineScene({
  name: 'prompt',
  span: SPANS.prompt,
  sfx: [
    ...Array.from(TYPED).map((ch, i) => [CUE.type + i * CPS, 'type', ch === ' ' ? 0.2 : 0.35]),
    [CUE.enter, 'key', 0.8],
    ...CUE.out.map((t) => [t, 'blip', 0.45]),
    [HIT - 1.2, 'riser', 0.6, { dur: 1.2 }],
    [HIT, 'impact', 0.75],
    ...Array.from({ length: PAGE_COUNT }, (_, i) => [HIT + 0.05 + i * 0.05, 'flip', 0.35]),
    [CUE.label, 'pop', 0.35],
  ],
  build(root) {
    set(root, { background: STAGE_LIGHT, perspective: '2400px' });
    const head = headline('One prompt. A whole deck.', {
      size: 104,
      top: 104,
      accent: ['A', 'whole', 'deck.'],
    });

    const promptLine = h('div', { style: 'white-space:pre-wrap' });
    const cmdEl = h('span', { style: 'color:#ff9e7a' });
    const argEl = h('span', { style: 'color:#f5f5f7' });
    const caret = h('span', {
      style:
        'display:inline-block;width:14px;height:30px;margin-left:2px;vertical-align:-5px;background:#f5f5f7',
    });
    promptLine.append(h('span', { text: '› ', style: `color:${C.brand}` }), cmdEl, argEl, caret);
    const outLines = OUTPUT.map(([glyph, label, color]) =>
      h(
        'div',
        { style: 'display:flex;gap:18px;opacity:0' },
        h('span', { text: glyph, style: `color:${color}` }),
        h('span', { text: label, style: 'color:rgb(255 255 255 / 0.78)' }),
      ),
    );
    const term = h(
      'div',
      {
        style: `position:absolute;left:${TERM.x}px;top:${TERM.y}px;width:${TERM.w}px;border-radius:26px;background:#121214;box-shadow:0 0 0 1px rgb(0 0 0 / 0.1), 0 60px 120px -30px rgb(0 0 0 / 0.45), 0 20px 50px -20px rgb(0 0 0 / 0.3);overflow:hidden;transform-origin:50% 50%`,
      },
      h(
        'div',
        {
          style:
            'position:relative;height:58px;display:flex;align-items:center;gap:10px;padding:0 22px;border-bottom:1px solid rgb(255 255 255 / 0.07)',
        },
        ['#ff5f57', '#febc2e', '#28c840'].map((c) =>
          h('div', { style: `width:14px;height:14px;border-radius:50%;background:${c}` }),
        ),
        h('div', {
          class: 'mono',
          text: '~/my-slides — agent',
          style:
            'position:absolute;left:0;right:0;text-align:center;font-size:20px;color:rgb(255 255 255 / 0.45)',
        }),
      ),
      h(
        'div',
        {
          style: `padding:34px 48px 40px;font-family:${FONT.mono};font-size:28px;line-height:1.7;display:flex;flex-direction:column;gap:4px`,
        },
        promptLine,
        h('div', { style: 'height:10px' }),
        outLines,
      ),
    );

    const wall = h('div', { class: 'abs preserve', style: 'left:960px;top:0;width:0;height:0' });
    const cards = Array.from({ length: PAGE_COUNT }, (_, i) => {
      const c = auroraCard(i, CARD_W, { radius: 14 });
      c.el.style.transformOrigin = '50% 50%';
      wall.append(c.el);
      const col = i % 4;
      const row = Math.floor(i / 4);
      const ch = (CARD_W * 9) / 16;
      return {
        el: c.el,
        x: -((4 * CARD_W + 3 * GAP) / 2) + col * (CARD_W + GAP),
        y: GRID_CY - (2 * ch + GAP) / 2 + row * (ch + GAP),
        ch,
      };
    });
    const label = h('div', {
      class: 'mono',
      text: 'slides/aurora/index.tsx  ·  8 pages',
      style: `position:absolute;left:0;right:0;top:876px;text-align:center;font-size:26px;letter-spacing:0.04em;color:${INK};opacity:0`,
    });
    root.append(head.el, wall, term, label);
    return { head, term, cmdEl, argEl, caret, outLines, wall, cards, label };
  },
  update(s, _t, T) {
    riseWords(s.head.words.slice(0, 2), T, CUE.head, { gap: 0.12 });
    riseWords(s.head.words.slice(2), T, HIT + 0.05, { gap: 0.1 });

    const n = clamp(Math.floor((T - CUE.type) / CPS) + 1, 0, TYPED.length);
    const typed = T < CUE.type ? '' : TYPED.slice(0, n);
    text(s.cmdEl, typed.slice(0, CMD.length));
    text(s.argEl, typed.slice(CMD.length));
    set(s.caret, {
      opacity: T < CUE.enter && (T < CUE.type + 0.1 || n < TYPED.length || caretOn(T, 1.6)) ? 1 : 0,
    });
    s.outLines.forEach((el, i) => {
      const p = prog(T, CUE.out[i], 0.35, outExpo);
      set(el, { opacity: p, transform: `translateY(${(1 - p) * 10}px)` });
    });

    const termIn = prog(T, 10.2, 0.8, outExpo);
    const gone = prog(T, HIT - 0.05, 0.5, outExpo);
    set(s.term, {
      opacity: termIn * (1 - gone),
      transform: `translateY(${(1 - termIn) * 40 + gone * 60}px) scale(${0.97 + 0.03 * termIn - 0.12 * gone})`,
      filter: gone > 0.01 ? `blur(${gone * 16}px)` : 'none',
    });

    const [rx, rz, sc] = keys(T, [
      [HIT, [28, -9, 0.9]],
      [17.2, [0, 0, 1], glide],
      [20.4, [0, 0, 1.07], (x) => x],
    ]);
    set(s.wall, {
      transform: `translateY(${GRID_CY}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${sc}) translateY(${-GRID_CY}px)`,
    });
    const from = [-CARD_W / 2, TERM.y + 140];
    s.cards.forEach((c, i) => {
      const at = HIT + 0.02 + i * 0.05;
      const p = spring(T - at, { stiffness: 150, damping: 17 });
      const z = lerp(-500, 0, p) + impulse(T, at + 0.25, 0.3) * 30;
      set(c.el, {
        opacity: T < at ? 0 : clamp((T - at) * 8),
        transform: `translate3d(${lerp(from[0], c.x, p)}px, ${lerp(from[1], c.y, p)}px, ${z}px) scale(${lerp(0.3, 1, clamp(p, 0, 1.2))})`,
      });
    });
    const lp = prog(T, CUE.label, 0.7, outExpo);
    set(s.label, { opacity: lp * 0.55, transform: `translateY(${(1 - lp) * 12}px)` });
  },
});
