import { beatGrid, sequence } from '#lib/film.js';

export const DURATION = 58;
export const { BEAT, BAR } = beatGrid(120);

export const { spans: SPANS, transitions: TRANSITIONS } = sequence(DURATION, [
  { name: 'open', at: 0 },
  { name: 'logo', at: 5.6, overlap: 0.4 },
  { name: 'prompt', at: 10, enter: 'card' },
  { name: 'code', at: 20, enter: 'card' },
  { name: 'edit', at: 28, enter: 'card' },
  { name: 'present', at: 36, enter: 'card' },
  { name: 'export', at: 44, enter: 'card' },
  { name: 'outro', at: 50 },
]);

export const HITS = [
  { t: 6, amount: 0.6, flash: 0.5 },
  { t: 14, amount: 0.45 },
  { t: 24, amount: 0.3 },
  { t: 52, amount: 0.7, flash: 0.5 },
];
