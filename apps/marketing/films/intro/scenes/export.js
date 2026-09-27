import { prog, tween } from '#lib/anim.js';
import { h, set } from '#lib/dom.js';
import { clamp, lerp, outExpo, spring } from '#lib/ease.js';
import { defineScene } from '#lib/scene.js';
import { FONT, SHADOW } from '#theme';
import { icon } from '#ui/icons.js';
import { SPANS } from '../timeline.js';
import { headline, INK, riseWords, STAGE_LIGHT } from '../ui/type.js';

const FORMATS = [
  {
    label: 'HTML',
    sub: 'A static site',
    file: 'aurora/index.html',
    icon: 'file-code-corner',
    bg: 'linear-gradient(160deg, #5aa8ff, #2f6bff)',
  },
  {
    label: 'PDF',
    sub: 'Print-ready',
    file: 'aurora.pdf',
    icon: 'file-text',
    bg: 'linear-gradient(160deg, #ff7a6b, #e5372b)',
  },
  {
    label: 'PPTX',
    sub: 'Editable PowerPoint',
    file: 'aurora.pptx',
    icon: 'presentation',
    bg: 'linear-gradient(160deg, #ffb45e, #ff6a1f)',
  },
];
const TILE = { w: 480, h: 500, gap: 56, y: 330 };
const CUE = { head: 44.45, tiles: 45.0, step: 0.4, line: 46.7 };

export default defineScene({
  name: 'export',
  span: SPANS.export,
  sfx: [
    ...FORMATS.map((_, i) => [CUE.tiles + i * CUE.step, 'pop', 0.6]),
    [CUE.line, 'shimmer', 0.45],
  ],
  build(root) {
    set(root, { background: STAGE_LIGHT, perspective: '2400px' });
    const head = headline('Ship it anywhere.', { size: 110, top: 104, accent: ['anywhere.'] });
    const x0 = (1920 - (3 * TILE.w + 2 * TILE.gap)) / 2;
    const row = h('div', { class: 'fill preserve' });
    const tiles = FORMATS.map((f, i) => {
      const el = h(
        'div',
        {
          style: `position:absolute;left:${x0 + i * (TILE.w + TILE.gap)}px;top:${TILE.y}px;width:${TILE.w}px;height:${TILE.h}px;border-radius:40px;background:#fff;box-shadow:${SHADOW.floating}, 0 40px 80px -30px rgb(0 0 0 / 0.18);padding:48px;display:flex;flex-direction:column;font-family:${FONT.sans};color:${INK};opacity:0`,
        },
        h(
          'div',
          {
            style: `width:120px;height:120px;border-radius:32px;background:${f.bg};display:grid;place-items:center;color:#fff;box-shadow:0 18px 40px -16px rgb(0 0 0 / 0.35)`,
          },
          icon(f.icon, { size: 60, stroke: 1.8 }),
        ),
        h('div', { style: 'flex:1' }),
        h('div', {
          text: f.label,
          style: 'font-size:96px;font-weight:700;letter-spacing:-0.05em;line-height:1',
        }),
        h('div', {
          text: f.sub,
          style:
            'margin-top:14px;font-size:34px;font-weight:500;letter-spacing:-0.02em;color:#6e6e73',
        }),
        h('div', {
          class: 'mono',
          text: f.file,
          style: 'margin-top:26px;font-size:22px;color:#a1a1a6',
        }),
      );
      row.append(el);
      return el;
    });
    const line = headline('No server. No lock-in. Any static host.', {
      size: 44,
      weight: 500,
      color: '#6e6e73',
      top: 902,
    });
    root.append(head.el, row, line.el);
    return { head, row, tiles, line };
  },
  update(s, _t, T) {
    riseWords(s.head.words, T, CUE.head, { gap: 0.1 });
    s.tiles.forEach((el, i) => {
      const at = CUE.tiles + i * CUE.step;
      const p = spring(T - at, { stiffness: 160, damping: 18 });
      const b = 1 - prog(T, at, 0.5, outExpo);
      set(el, {
        opacity: clamp((T - at) * 5),
        transform: `translate3d(0, ${lerp(140, 0, p)}px, ${lerp(-300, 0, p)}px)`,
        filter: T >= at && b > 0.01 ? `blur(${b * 10}px)` : 'none',
      });
    });
    const rot = tween(T, 45, 5.4, 6, -4, (x) => x);
    const push = tween(T, 44, 6.4, 0.98, 1.04, (x) => x);
    set(s.row, {
      transform: `translateY(540px) rotateY(${rot}deg) scale(${push}) translateY(-540px)`,
    });
    riseWords(s.line.words, T, CUE.line, { gap: 0.06, dist: 20 });
  },
});
