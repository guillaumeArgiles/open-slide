import { impulse, keys, prog } from '#lib/anim.js';
import { h, set, text } from '#lib/dom.js';
import { glide, outExpo, swift } from '#lib/ease.js';
import { defineScene, rectIn } from '#lib/scene.js';
import { C } from '#theme';
import { keycap } from '#ui/kit.js';
import { SPANS } from '../timeline.js';
import { PRESENTER, presenterView } from '../ui/presenter.js';
import { headline, riseWords, STAGE_DARK } from '../ui/type.js';

const K = 0.86;
const WX = (1920 - PRESENTER.w * K) / 2;
const WY = 292;
const CUE = { head: 36.45, key: 39.2, press: 39.95, next: 40.0, full: 41.7, bar: 42.7 };
const NOTES = [
  'Pause on the number. Let it land, then tell the efficiency story.',
  'Walk the bars left to right. Call out the last quarter.',
];
const FULL = 1920 / PRESENTER.cur;

export default defineScene({
  name: 'present',
  span: SPANS.present,
  sfx: [
    [36.6, 'swell', 0.4],
    [CUE.key, 'pop', 0.5],
    [CUE.press, 'key', 1],
    [CUE.next, 'swish', 0.6],
    [CUE.full - 0.1, 'whoosh', 0.8, { dur: 1 }],
    [CUE.full + 0.9, 'thud', 0.5],
  ],
  build(root) {
    set(root, { background: STAGE_DARK, perspective: '2600px' });
    const head = headline('Built for the stage.', {
      size: 110,
      color: '#f5f5f7',
      top: 100,
      accent: ['stage.'],
    });
    const view = presenterView({
      pages: [
        [2, 3],
        [3, 4],
      ],
      notes: NOTES,
    });
    const win = h('div', { class: 'abs', style: 'transform-origin:0 0' }, view.el);
    const key = h(
      'div',
      { style: 'position:absolute;left:1690px;top:600px;opacity:0' },
      keycap('→', { size: 108, dark: true }),
    );
    const bar = h('div', {
      style: `position:absolute;left:0;bottom:0;height:6px;width:1920px;background:${C.brand};transform-origin:0 50%;opacity:0`,
    });
    root.append(head.el, win, key, bar);
    const cur = rectIn(view.current.el, view.el);
    return { head, view, win, key, bar, cur };
  },
  update(s, _t, T) {
    riseWords(s.head.words, T, CUE.head, { gap: 0.1 });
    const headOut = prog(T, CUE.full - 0.2, 0.4, swift);
    set(s.head.el, { opacity: 1 - headOut, transform: `translateY(${-headOut * 30}px)` });

    const fullX = -s.cur.x * FULL;
    const fullY = -s.cur.y * FULL;
    const [x, y, sc, rx] = keys(T, [
      [36.0, [WX, WY + 40, K * 0.96, 14]],
      [37.4, [WX, WY, K, 0], glide],
      [CUE.full, [WX, WY, K * 1.02, 0], (v) => v],
      [CUE.full + 1.0, [fullX, fullY, FULL, 0], glide],
    ]);
    set(s.win, {
      transform: `translate(${x}px, ${y}px) rotateX(${rx}deg) scale(${sc})`,
    });

    const sec = 42 + Math.max(0, Math.floor(T - 36));
    text(s.view.timer, `00:${String(sec).padStart(2, '0')}`);
    text(s.view.counter, T >= CUE.next ? '04' : '03');
    const flip = prog(T, CUE.next, 0.45, outExpo);
    for (const st of [s.view.current, s.view.upNext]) {
      set(st.cards[0].el, { opacity: 1 - flip, transform: `translateX(${-flip * 40}px)` });
      set(st.cards[1].el, { opacity: flip, transform: `translateX(${(1 - flip) * 40}px)` });
    }
    s.view.noteEls.forEach((el, i) => {
      set(el, { opacity: i === 0 ? 1 - flip : flip });
    });

    const kp = prog(T, CUE.key, 0.4, outExpo) * (1 - prog(T, CUE.full - 0.4, 0.3));
    const press = impulse(T, CUE.press, 0.12);
    set(s.key, {
      opacity: kp,
      transform: `translateY(${(1 - kp) * 20 + press * 8}px) scale(${1 - press * 0.05})`,
    });
    const bp = prog(T, CUE.bar, 0.6, outExpo);
    set(s.bar, { opacity: bp > 0 ? 1 : 0, transform: `scaleX(${bp * 0.5})` });
  },
});
