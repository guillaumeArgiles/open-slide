import { impulse, prog, tween } from '#lib/anim.js';
import { h, set, text } from '#lib/dom.js';
import { clamp, outExpo, swift } from '#lib/ease.js';
import { caretOn } from '#lib/fx.js';
import { route } from '#lib/route.js';
import { defineScene, rectIn } from '#lib/scene.js';
import { C, FONT, LIGHT as P, SHADOW } from '#theme';
import { slideViewer, WIN } from '#ui/app.js';
import { cursor } from '#ui/cursor.js';
import { icon } from '#ui/icons.js';
import { selection } from '#ui/selection.js';
import { SPANS } from '../timeline.js';
import { headline, INK, riseWords, STAGE_LIGHT } from '../ui/type.js';

const HIT = 34.0;
const K = 0.82;
const WX = (1920 - WIN.w * K) / 2;
const WY = 250;
const NOTE = 'Make “deck.” red';
const CMD = '/apply-comments';
const CUE = {
  select: 29.6,
  card: 29.9,
  focus: 30.15,
  type: 30.35,
  add: 32.0,
  agent: 32.35,
  cmd: 32.6,
  applied: 33.5,
};
const TYPE_GAP = 0.07;
const CMD_GAP = 0.045;
const CARD = { x: 1110, y: 360, w: 640 };
const AGENT = { x: 1110, y: 790, w: 640 };

const toWin = ([x, y]) => [(x - WX) / K, (y - WY) / K];

export default defineScene({
  name: 'edit',
  span: SPANS.edit,
  sfx: [
    [CUE.select, 'click', 1],
    [CUE.card, 'pop', 0.55],
    [CUE.focus, 'click', 0.6],
    ...Array.from(NOTE).map((_, i) => [CUE.type + i * TYPE_GAP, 'type', 0.5]),
    [CUE.add, 'click', 1],
    [CUE.add + 0.05, 'check', 0.5],
    [CUE.agent, 'slide', 0.45],
    ...Array.from(CMD).map((_, i) => [CUE.cmd + i * CMD_GAP, 'type', 0.4]),
    [CUE.applied, 'blip', 0.5],
    [HIT - 0.4, 'swell', 0.4],
    [HIT, 'success', 0.8],
  ],
  build(root) {
    set(root, { background: STAGE_LIGHT });
    const head = headline('Click. Comment. Done.', { size: 100, top: 92, accent: ['Done.'] });

    const app = slideViewer();
    const win = h(
      'div',
      { class: 'abs', style: `transform-origin:${WIN.w / 2}px ${WIN.h / 2}px` },
      app.el,
    );
    const sel = selection({ handleSize: 14, stroke: 2 });
    const cur = cursor({ size: 42 });
    app.overlay.append(sel.el, cur.el);
    const count = app.overlay.children[0];
    const countText = h('span', { class: 'nums', text: '0' });
    count.lastChild.replaceWith(countText);

    const typedEl = h('span');
    const caret = h('span', {
      style: `display:inline-block;width:2.5px;height:34px;margin-left:1px;vertical-align:-6px;background:${C.blue}`,
    });
    const placeholder = h('span', {
      text: 'Describe a change for the agent…',
      style: `color:${P.mutedFg}`,
    });
    const addBtn = h(
      'div',
      {
        style: `height:52px;padding:0 22px;border-radius:10px;background:${C.brand};color:#fff;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:600`,
      },
      'Add comment',
    );
    const card = h(
      'div',
      {
        style: `position:absolute;left:${CARD.x}px;top:${CARD.y}px;width:${CARD.w}px;border-radius:18px;border:1px solid ${P.border};background:${P.card};box-shadow:${SHADOW.overlay};font-family:${FONT.sans};color:${INK};transform-origin:0 0;opacity:0`,
      },
      h(
        'div',
        {
          style: `display:flex;align-items:center;gap:12px;padding:20px 24px;border-bottom:1px solid ${P.hairline};font-size:24px;font-weight:600`,
        },
        icon('message-square', { size: 24 }),
        'Comment',
        h('div', { style: 'flex:1' }),
        h('span', { class: 'mono', text: '<h1>', style: `font-size:18px;color:${P.mutedFg}` }),
      ),
      h(
        'div',
        { style: 'padding:22px 24px 0' },
        h(
          'div',
          {
            style: `height:110px;border-radius:12px;border:1.5px solid ${C.blue};box-shadow:0 0 0 5px ${C.blueSoft};padding:18px 20px;font-size:32px;font-weight:500;letter-spacing:-0.01em;line-height:1.3`,
          },
          placeholder,
          typedEl,
          caret,
        ),
      ),
      h(
        'div',
        {
          style:
            'display:flex;align-items:center;justify-content:space-between;padding:20px 24px 22px',
        },
        h('span', { text: '⌘↵ to add', style: `font-size:20px;color:${P.mutedFg}` }),
        addBtn,
      ),
    );

    const cmdEl = h('span');
    const applied = h(
      'div',
      { style: 'display:flex;gap:16px;opacity:0' },
      h('span', { text: '✓', style: `color:${C.emerald}` }),
      h('span', { text: 'Applied 1 comment', style: 'color:rgb(255 255 255 / 0.8)' }),
    );
    const agent = h(
      'div',
      {
        style: `position:absolute;left:${AGENT.x}px;top:${AGENT.y}px;width:${AGENT.w}px;padding:26px 30px;border-radius:20px;background:#121214;box-shadow:0 40px 80px -24px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(0 0 0 / 0.1);font-family:${FONT.mono};font-size:25px;line-height:1.7;color:#f5f5f7;opacity:0`,
      },
      h('div', {}, h('span', { text: '› ', style: `color:${C.brand}` }), cmdEl),
      applied,
    );

    root.append(head.el, win, card, agent);

    app.slide.update();
    const L0 = app.update({});
    const headRect = app.toWin(app.slide.rect('head'), L0);
    const btn = rectIn(addBtn, root);
    const box = rectIn(placeholder, root);
    const path = route(
      [WIN.w * 0.75, WIN.h + 80],
      [
        {
          at: CUE.select - 0.05,
          dur: 0.9,
          to: [headRect.x + headRect.w * 0.45, headRect.y + headRect.h * 0.6],
        },
        { at: CUE.focus - 0.05, dur: 0.4, to: toWin([box.x + 60, box.cy]), bend: -0.08 },
        { at: CUE.type + 0.2, dur: 0.35, to: toWin([box.x + 140, box.cy + 90]) },
        { at: CUE.add - 0.05, dur: 0.55, to: toWin([btn.cx, btn.cy]) },
        { at: CUE.add + 1.2, dur: 1.0, to: [WIN.w * 0.4, WIN.h * 0.72] },
      ],
    );
    return {
      head,
      app,
      win,
      sel,
      cur,
      count,
      countText,
      card,
      typedEl,
      caret,
      placeholder,
      addBtn,
      agent,
      cmdEl,
      applied,
      path,
    };
  },
  update(s, _t, T) {
    riseWords(s.head.words.slice(0, 1), T, 28.55);
    riseWords(s.head.words.slice(1, 2), T, CUE.card);
    riseWords(s.head.words.slice(2), T, HIT);

    const push = tween(T, 27.6, 8.8, 1, 1.03, (x) => x);
    set(s.win, {
      transform: `translate(${WX}px, ${WY}px) scale(${K * push})`,
    });
    const tint = prog(T, HIT, 0.5, swift);
    s.app.slide.update({
      wordColor: `color-mix(in oklch, ${C.hot} ${(tint * 100).toFixed(1)}%, #0a0a0a)`,
    });
    const L = s.app.update({});

    const selP = prog(T, CUE.select, 0.35, outExpo) * (1 - prog(T, HIT - 0.2, 0.3));
    const head = s.app.toWin(s.app.slide.rect('head'), L);
    s.sel.update({ ...head, show: selP, handles: selP, badgeText: '<h1>', badgeShow: selP });

    const [x, y] = s.path(T);
    s.cur.update(T, {
      x,
      y,
      opacity: prog(T, 28.3, 0.3) * (1 - prog(T, 34.6, 0.4)),
      clicks: [CUE.select, CUE.focus, CUE.add],
    });

    const cp = prog(T, CUE.card, 0.45, outExpo) * (1 - prog(T, CUE.add + 0.15, 0.3, swift));
    set(s.card, {
      opacity: cp,
      transform: `translateY(${(1 - cp) * 12}px) scale(${0.96 + 0.04 * cp})`,
    });
    const n = clamp(Math.floor((T - CUE.type) / TYPE_GAP) + 1, 0, NOTE.length);
    const typed = T < CUE.type ? '' : NOTE.slice(0, n);
    text(s.typedEl, typed);
    set(s.placeholder, { display: typed ? 'none' : 'inline' });
    set(s.caret, { opacity: T >= CUE.focus && (n < NOTE.length || caretOn(T, 1.6)) ? 1 : 0 });
    set(s.addBtn, { transform: `scale(${1 - impulse(T, CUE.add, 0.1) * 0.06})` });

    text(s.countText, T >= CUE.add + 0.1 ? '1' : '0');
    set(s.count, { scale: 1 + impulse(T, CUE.add + 0.1, 0.18) * 0.25 });

    const ap = prog(T, CUE.agent, 0.5, outExpo) * (1 - prog(T, 35.1, 0.5, swift));
    set(s.agent, { opacity: ap, transform: `translateY(${(1 - ap) * 30}px)` });
    const m = clamp(Math.floor((T - CUE.cmd) / CMD_GAP) + 1, 0, CMD.length);
    text(s.cmdEl, T < CUE.cmd ? '' : CMD.slice(0, m));
    const aP = prog(T, CUE.applied, 0.35, outExpo);
    set(s.applied, { opacity: aP, transform: `translateY(${(1 - aP) * 8}px)` });
  },
});
