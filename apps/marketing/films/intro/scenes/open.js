import { prog, tween } from '#lib/anim.js';
import { h, set } from '#lib/dom.js';
import { inExpo } from '#lib/ease.js';
import { defineScene } from '#lib/scene.js';
import { SPANS } from '../timeline.js';
import { blurOut, headline, riseWords } from '../ui/type.js';

const CUE = { line1: 0.5, line2: 1.25, out: 2.8, ask: 3.1, through: 4.95 };
const WHITE = '#f5f5f7';

export default defineScene({
  name: 'open',
  span: SPANS.open,
  sfx: [
    ...[0, 1, 2].map((i) => [CUE.line1 + i * 0.12, 'tick', 0.35]),
    ...[0, 1, 2, 3].map((i) => [CUE.line2 + i * 0.12, 'tick', 0.35]),
    [CUE.out, 'swish', 0.35],
    [CUE.ask, 'pop', 0.4],
    [CUE.ask + 0.45, 'pop', 0.45],
    [CUE.ask + 0.9, 'shimmer', 0.6],
    [4.0, 'riser', 0.8, { dur: 2 }],
  ],
  build(root) {
    set(root, { background: '#000' });
    const glow = h('div', {
      class: 'fill',
      style:
        'background:radial-gradient(40% 45% at 50% 55%, oklch(0.6 0.2 25 / 0.28), transparent 70%);opacity:0',
    });
    const l1 = headline('Great talks start', { size: 124, color: WHITE, top: 380 });
    const l2 = headline('with a great deck.', { size: 124, color: WHITE, top: 520 });
    const pair = h('div', { class: 'fill' }, l1.el, l2.el);
    const ask = headline('Now, just ask.', {
      size: 190,
      weight: 800,
      color: WHITE,
      top: 430,
      accent: ['ask.'],
    });
    root.append(glow, pair, ask.el);
    return { glow, pair, l1, l2, ask };
  },
  update(s, _t, T) {
    riseWords(s.l1.words, T, CUE.line1, { gap: 0.12 });
    riseWords(s.l2.words, T, CUE.line2, { gap: 0.12 });
    blurOut(s.pair, T, CUE.out, 0.5, { dy: -30, scale: 0.97 });

    const phrase = [s.ask.words.slice(0, 1), s.ask.words.slice(1, 2), s.ask.words.slice(2)];
    phrase.forEach((ws, i) => {
      riseWords(ws, T, CUE.ask + i * 0.45, { dist: 50, dur: 1 });
    });
    const through = prog(T, CUE.through, 0.7, inExpo);
    set(s.ask.el, {
      transform: `scale(${tween(T, CUE.ask, 2, 0.98, 1.02) + through * 1.6})`,
      opacity: 1 - through,
      filter: through > 0.01 ? `blur(${through * 30}px)` : 'none',
    });
    set(s.glow, { opacity: prog(T, CUE.ask + 0.9, 1.2) * 0.9 * (1 - through) });
  },
});
