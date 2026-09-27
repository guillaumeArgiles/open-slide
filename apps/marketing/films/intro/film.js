import { defineFilm } from '#lib/film.js';
import code from './scenes/code.js';
import edit from './scenes/edit.js';
import exportScene from './scenes/export.js';
import logo from './scenes/logo.js';
import open from './scenes/open.js';
import outro from './scenes/outro.js';
import present from './scenes/present.js';
import prompt from './scenes/prompt.js';
import { DURATION, HITS, TRANSITIONS } from './timeline.js';

export default defineFilm({
  title: 'open-slide — introducing',
  duration: DURATION,
  bpm: 120,
  poster: 16,
  scenes: [open, logo, prompt, code, edit, present, exportScene, outro],
  transitions: TRANSITIONS,
  hits: HITS,
});
