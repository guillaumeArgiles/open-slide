import { impulse, prog, tween } from '#lib/anim.js';
import { h, set, text } from '#lib/dom.js';
import { clamp, inOutCubic, outExpo } from '#lib/ease.js';
import { caretOn } from '#lib/fx.js';
import { defineScene } from '#lib/scene.js';
import { C } from '#theme';
import { codeEditor, highlight } from '#ui/code.js';
import { keycap } from '#ui/kit.js';
import { SPANS } from '../timeline.js';
import { ACCENT_2, auroraCard } from '../ui/deck.js';
import { headline, riseWords, STAGE_DARK } from '../ui/type.js';

const HIT = 24.0;
const CUE = { head: 20.45, select: 22.0, type: 22.45, save: 23.45, caption: 25.0 };
const LINES = [
  "import type { DesignSystem, Page } from '@open-slide/core';",
  '',
  'export const design: DesignSystem = {',
  "  palette: { bg: '#0b0b10', accent: '#ff5a1f' },",
  '};',
  '',
  'const Cover: Page = () => (',
  '  <Stage>',
  '    <h1>Aurora</h1>',
  '    <Orb color={design.palette.accent} />',
  '  </Stage>',
  ');',
];
const EDIT_ROW = 3;
const PREFIX = "  palette: { bg: '#0b0b10', accent: ";
const OLD = "'#ff5a1f'";
const NEW = "'#7c5cff'";
const SUFFIX = ' },';
const TYPE_GAP = 0.075;
const ED = { x: 110, y: 290, scale: 1.2, w: 740 };
const PV = { x: 1040, y: 330, w: 780 };

export default defineScene({
  name: 'code',
  span: SPANS.code,
  sfx: [
    [CUE.select, 'click', 0.7],
    ...Array.from(NEW).map((_, i) => [CUE.type + i * TYPE_GAP, 'type', 0.5]),
    [CUE.save, 'key', 0.9],
    [HIT - 0.5, 'swell', 0.5],
    [HIT, 'slam', 0.7],
    [HIT + 0.05, 'reveal', 0.6],
    [CUE.caption, 'pop', 0.35],
  ],
  build(root) {
    set(root, { background: STAGE_DARK });
    const head = headline('It’s just React.', {
      size: 110,
      color: '#f5f5f7',
      top: 96,
      accent: ['React.'],
    });

    const ed = codeEditor({
      file: 'slides/aurora/index.tsx',
      lines: LINES.map((text) => ({ text })),
      width: ED.w,
      lineHeight: 38,
    });
    const edWrap = h('div', { class: 'abs', style: `transform-origin:0 0` }, ed.el);
    const row = ed.rows[EDIT_ROW];
    const value = h('span', { style: 'border-radius:3px' });
    const caret = h('span', {
      style:
        'display:inline-block;width:2px;height:24px;vertical-align:-5px;background:#f5f5f7;opacity:0',
    });
    row.content.replaceChildren(...highlight(PREFIX), value, caret, ...highlight(SUFFIX));
    const rowHi = h('div', {
      style: 'position:absolute;inset:0;background:rgb(255 255 255 / 0.05);opacity:0',
    });
    row.el.prepend(rowHi);

    const oldCard = auroraCard(0, PV.w, { radius: 18, shadow: false });
    const newCard = auroraCard(0, PV.w, { radius: 18, shadow: false, accent: ACCENT_2 });
    const sweep = h('div', {
      style:
        'position:absolute;top:0;bottom:0;left:0;width:140px;margin-left:-70px;background:linear-gradient(90deg, transparent, rgb(255 255 255 / 0.55), transparent);opacity:0;mix-blend-mode:screen',
    });
    const pvH = (PV.w * 9) / 16;
    const preview = h(
      'div',
      {
        style: `position:absolute;left:${PV.x}px;top:${PV.y}px;width:${PV.w}px;height:${pvH}px;border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px rgb(255 255 255 / 0.1), 0 60px 120px -30px rgb(0 0 0 / 0.8)`,
      },
      oldCard.el,
      newCard.el,
      sweep,
    );
    const liveDot = h('span', {
      style: `width:12px;height:12px;border-radius:50%;background:${C.emerald}`,
    });
    const liveLabel = h('span', { text: 'Live preview' });
    const chip = h(
      'div',
      {
        class: 'mono',
        style: `position:absolute;left:${PV.x}px;top:${PV.y - 64}px;display:flex;align-items:center;gap:14px;font-size:24px;color:rgb(245 245 247 / 0.6);white-space:nowrap`,
      },
      liveDot,
      liveLabel,
      h('span', { text: '·  localhost:5173/s/aurora', style: 'color:rgb(245 245 247 / 0.35)' }),
    );
    const size = h('div', {
      class: 'mono',
      text: '1920 × 1080',
      style: `position:absolute;left:${PV.x}px;top:${PV.y + pvH + 26}px;width:${PV.w}px;text-align:right;font-size:22px;letter-spacing:0.08em;color:rgb(245 245 247 / 0.35)`,
    });
    const keys = h(
      'div',
      {
        style: `position:absolute;left:${PV.x + PV.w / 2}px;top:${PV.y + (PV.w * 9) / 16 + 90}px;display:flex;gap:14px;opacity:0`,
      },
      keycap('⌘', { size: 72, dark: true }),
      keycap('S', { size: 72, dark: true }),
    );
    const caption = headline('Every page is a component. Every save, live.', {
      size: 44,
      weight: 500,
      color: 'rgb(245 245 247 / 0.7)',
      top: 940,
    });
    root.append(head.el, edWrap, preview, chip, size, keys, caption.el);
    return {
      head,
      edWrap,
      value,
      caret,
      rowHi,
      newCard,
      sweep,
      preview,
      chip,
      liveDot,
      liveLabel,
      size,
      keys,
      caption,
      pvH,
      kw: keys.offsetWidth,
    };
  },
  update(s, _t, T) {
    riseWords(s.head.words, T, CUE.head, { gap: 0.1 });
    const inP = prog(T, 20.3, 1.0, outExpo);
    const push = tween(T, 20, 8.4, 1, 1.03, (x) => x);
    set(s.edWrap, {
      opacity: inP,
      transform: `translate(${ED.x - (1 - inP) * 40}px, ${ED.y}px) scale(${ED.scale * push})`,
    });
    const pvP = prog(T, 20.5, 1.0, outExpo);
    set(s.preview, {
      opacity: pvP,
      transform: `translateX(${(1 - pvP) * 40}px) scale(${push + impulse(T, HIT, 0.25) * 0.015})`,
    });
    set(s.chip, { opacity: prog(T, 21.0, 0.6) });
    set(s.size, { opacity: prog(T, 21.2, 0.6) });

    const selected = T >= CUE.select && T < CUE.type;
    const typed =
      T < CUE.type
        ? ''
        : NEW.slice(0, clamp(Math.floor((T - CUE.type) / TYPE_GAP) + 1, 0, NEW.length));
    const shown = T < CUE.type ? OLD : typed;
    if (s.value.dataset.v !== shown) {
      s.value.dataset.v = shown;
      s.value.replaceChildren(...highlight(shown));
    }
    set(s.value, { background: selected ? 'oklch(0.623 0.214 259.815 / 0.45)' : 'transparent' });
    set(s.caret, {
      opacity: T >= CUE.type && T < HIT + 0.6 && (T < CUE.save || caretOn(T, 1.6)) ? 1 : 0,
    });
    set(s.rowHi, { opacity: prog(T, CUE.select - 0.3, 0.3) * (1 - prog(T, HIT + 1, 0.6)) });

    const kp = prog(T, CUE.save - 0.25, 0.3, outExpo) * (1 - prog(T, CUE.save + 0.45, 0.3));
    const press = impulse(T, CUE.save, 0.12);
    set(s.keys, {
      opacity: kp,
      transform: `translateX(${-s.kw / 2}px) translateY(${(1 - kp) * 16 + press * 6}px)`,
    });

    const wipe = prog(T, HIT, 0.7, inOutCubic);
    set(s.newCard.el, { clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` });
    set(s.sweep, {
      opacity: T >= HIT && wipe < 1 ? 1 : 0,
      transform: `translateX(${wipe * PV.w}px)`,
    });
    const updated = T >= HIT + 0.1;
    set(s.liveDot, {
      boxShadow: `0 0 0 ${impulse(T, HIT + 0.1, 0.3) * 10}px oklch(0.696 0.17 162.48 / 0.35)`,
    });
    text(s.liveLabel, updated ? 'Updated' : 'Live preview');

    riseWords(s.caption.words, T, CUE.caption, { gap: 0.05, dist: 20 });
  },
});
