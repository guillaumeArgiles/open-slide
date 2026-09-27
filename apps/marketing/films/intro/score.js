const CHORDS = {
  Dm: { pad: [62, 65, 69, 72, 76], bass: 38, arp: [62, 65, 69, 72, 76, 81] },
  Bb: { pad: [58, 62, 65, 69, 72], bass: 34, arp: [58, 62, 65, 69, 72, 74] },
  F: { pad: [57, 60, 64, 65, 67], bass: 41, arp: [60, 64, 65, 69, 72, 76] },
  C: { pad: [60, 64, 67, 69, 74], bass: 36, arp: [60, 64, 67, 69, 72, 76] },
};
// One chord per 2 s bar.
const BARS = 'Dm Bb C F C Dm Bb F C Dm Bb F C Dm Dm Bb F C Dm Bb F C Bb F C Dm F F F';

export default function score(kit) {
  const { BEAT, beats, kick, crash, reverseCymbal, snareRoll, bassNote, padChord, pluck, bell } =
    kit;
  const chordAt = kit.progression(CHORDS, BARS);
  const groove = (from, to, opts) => kit.groove(from, to, { chordAt, ...opts });
  const plucks = (from, to, gain = 0.16) => {
    for (let t = from; t < to - 0.01; t += BEAT / 2) {
      const step = Math.round(t / (BEAT / 2));
      pluck(t, chordAt(t).arp[[0, 2, 4, 3, 5, 2][step % 6]], {
        gain,
        pan: step % 2 ? 0.4 : -0.4,
        bright: 0.6,
        decay: 0.35,
      });
    }
  };

  padChord(0, 2, CHORDS.Dm.pad, { gain: 0.8, cutoff: (t) => 500 + t * 300, attack: 1.5 });
  padChord(2, 2, CHORDS.Bb.pad, { gain: 0.8, cutoff: 1300 });
  padChord(4, 2, CHORDS.C.pad, { gain: 0.85, cutoff: (t) => 1300 + (t - 4) * 1400 });
  plucks(0.5, 6, 0.12);
  for (const t of [4, 4.5, 5, 5.5]) kick(t, 0.3 + (t - 4) * 0.15, { tone: 0.6, sidechain: true });
  reverseCymbal(6, 1.4, 1);

  crash(6, 1);
  kick(6, 1);
  padChord(6, 4, CHORDS.F.pad, { gain: 0.9, cutoff: (t) => 3200 - (t - 6) * 400, attack: 0.02 });
  bassNote(6, 41, 3.5, 0.8, 0.5);
  [72, 76, 79, 84].forEach((m, i) => {
    bell(6.5 + i * 0.5, m, 0.1, i % 2 ? 0.5 : -0.5);
  });

  crash(10, 0.6);
  groove(10, 14, { hats: '8', padGain: 0.5, cutoff: 1500, clapOn: false });
  plucks(10, 14, 0.12);
  reverseCymbal(14, 1.2, 0.9);
  crash(14, 0.9);
  groove(14, 20, { hats: '16', arp: true, padGain: 0.5, cutoff: 2000 });

  crash(20, 0.6);
  groove(20, 23.5, { hats: '8', padGain: 0.45, cutoff: 1400, clapOn: false });
  for (const t of beats(23.5, 24, BEAT / 2)) kick(t, 0.5);
  reverseCymbal(24, 0.9, 0.8);
  crash(24, 0.8);
  groove(24, 28, { hats: '16', bassMode: 'roll', arp: true, padGain: 0.5, cutoff: 2200 });

  crash(28, 0.6);
  groove(28, 34, { hats: '8', padGain: 0.45, cutoff: 1500 });
  reverseCymbal(34, 0.8, 0.7);
  crash(34, 0.7);
  groove(34, 36, { hats: '16', arp: true, padGain: 0.5, cutoff: 2200 });

  crash(36, 0.7);
  groove(36, 42, { hats: '16', arp: true, padGain: 0.5, cutoff: 2000, openHats: true });
  padChord(42, 2, CHORDS.C.pad, { gain: 0.7, cutoff: (t) => 1200 + (t - 42) * 1500, attack: 0.3 });
  for (const t of beats(42, 44)) kick(t, 0.55, { sidechain: true });

  crash(44, 0.7);
  groove(44, 50, { hats: '16', arp: true, padGain: 0.5, cutoff: 2400, arpBright: 1.2 });

  [50, 50.5, 51, 51.5].forEach((t, i) => {
    kick(t, 1);
    crash(t, 0.35 + i * 0.1, 1);
    padChord(
      t,
      0.35,
      CHORDS.Dm.pad.map((m) => m - 12 + [0, 0, 2, 5][i]),
      { gain: 1.2, cutoff: 3200, attack: 0.005, release: 0.25 },
    );
    bassNote(t, 38 + [0, 0, 3, 7][i], 0.4, 1, 1.2);
  });
  snareRoll(51, 52, 0.55);
  reverseCymbal(52, 1.4, 1.2);
  crash(52, 1.2, 4);
  kick(52, 1.2);
  padChord(52, 6, [53, 57, 60, 64, 67, 72], {
    gain: 1.05,
    cutoff: (t) => 4200 - (t - 52) * 450,
    attack: 0.02,
    release: 1.2,
  });
  bassNote(52, 41, 5, 0.9, 0.5);
  [72, 76, 79, 84, 81, 76, 79, 72].forEach((m, i) => {
    bell(52.5 + i * 0.5, m, 0.11, i % 2 ? 0.5 : -0.5);
  });
}
