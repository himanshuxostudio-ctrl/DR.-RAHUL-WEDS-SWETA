/**
 * A small generative instrumental — Raag Bhupali on bansuri (bamboo flute)
 * over a tanpura drone, with an occasional swarmandal shimmer. No vocals,
 * no beats, zero audio bytes to download: everything is synthesised with the
 * Web Audio API after the guest taps "Open Invitation".
 */

type Phrase = [degree: number, beats: number][];

// Bhupali: S R G P D  (ratios over Sa). Degree indices span lower P → upper G.
const SCALE = [
  3 / 4, // P (mandra)
  5 / 6, // D (mandra)
  1, // S
  9 / 8, // R
  5 / 4, // G
  3 / 2, // P
  5 / 3, // D
  2, // S'
  9 / 4, // R'
  5 / 2, // G'
];
const S = 2, R = 3, G = 4, P = 5, D = 6, S2 = 7, R2 = 8, G2 = 9, Pm = 0, Dm = 1;

// Characteristic movements (pakad and common phrases) of Bhupali.
const PHRASES: Phrase[] = [
  [[G, 2], [R, 1], [S, 1], [Dm, 2], [S, 3]],
  [[S, 1], [R, 1], [G, 3], [R, 1], [G, 1], [P, 2], [G, 3]],
  [[P, 1], [G, 1], [D, 2], [P, 2], [G, 1], [R, 1], [S, 4]],
  [[G, 1], [P, 1], [D, 2], [S2, 3], [D, 1], [P, 2], [G, 3]],
  [[S2, 2], [R2, 1], [S2, 1], [D, 2], [P, 1], [G, 1], [P, 4]],
  [[G, 1], [P, 1], [D, 1], [S2, 1], [R2, 1], [G2, 3], [R2, 1], [S2, 3]],
  [[Dm, 1], [S, 1], [R, 2], [G, 2], [R, 1], [S, 1], [Dm, 1], [Pm, 1], [Dm, 1], [S, 4]],
  [[P, 3], [G, 1], [R, 1], [G, 1], [S, 4]],
];

const TONIC = 146.83; // D3 — sits warmly under the flute
const BEAT = 0.62; // seconds, unhurried alaap-like pulse

function makeReverbIR(ctx: BaseAudioContext, seconds = 3.6) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  return ir;
}

/** Karplus–Strong plucked string, with a touch of "jawari" brightness. */
function pluck(ctx: BaseAudioContext, freq: number, seconds: number, brightness = 0.5, decay = 0.9985) {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * seconds);
  const buf = ctx.createBuffer(1, len, sr);
  const out = buf.getChannelData(0);
  const period = Math.max(2, Math.round(sr / freq));
  const ring = new Float32Array(period);
  for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
  let idx = 0;
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const cur = ring[idx];
    const next = ring[(idx + 1) % period];
    const avg = (cur + next) * 0.5;
    ring[idx] = (brightness * cur + (1 - brightness) * avg) * decay;
    // gentle one-pole smoothing + soft saturation for the buzzing bridge
    prev = prev + 0.6 * (cur - prev);
    out[i] = Math.tanh(prev * 1.6) * 0.6;
    idx = (idx + 1) % period;
  }
  // fade tail to avoid clicks
  const fade = Math.floor(sr * 0.3);
  for (let i = 0; i < fade; i++) out[len - 1 - i] *= i / fade;
  return buf;
}

export interface RagaEngine {
  start: () => Promise<void>;
  fadeOut: () => void;
  fadeIn: () => void;
  dispose: () => void;
}

export function createRagaEngine(): RagaEngine | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;

  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  master.connect(comp).connect(ctx.destination);

  const reverb = ctx.createConvolver();
  reverb.buffer = makeReverbIR(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.55;
  reverb.connect(wet).connect(master);

  const bus = ctx.createGain();
  bus.gain.value = 0.8;
  bus.connect(master);
  bus.connect(reverb);

  // Tanpura: Pa · Sa · Sa · Sa(low)
  const tanpuraNotes = [TONIC * 0.75, TONIC, TONIC, TONIC / 2].map((f) => pluck(ctx, f, 6, 0.35, 0.9992));
  const swar = [S, R, G, P, D, S2, R2, G2].map((d) => pluck(ctx, TONIC * 4 * SCALE[d] / 2, 2.4, 0.2, 0.996));

  const tanpuraGain = ctx.createGain();
  tanpuraGain.gain.value = 0.34;
  const tanpuraFilter = ctx.createBiquadFilter();
  tanpuraFilter.type = "lowpass";
  tanpuraFilter.frequency.value = 2600;
  tanpuraGain.connect(tanpuraFilter).connect(bus);

  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  let nextTanpura = 0;
  let nextPhrase = 0;
  let nextShimmer = 0;
  let lastPhrase = -1;
  let timer: number | undefined;
  let started = false;

  function playBuffer(buffer: AudioBuffer, when: number, dest: AudioNode, gain = 1, pan = 0) {
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.value = gain;
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    src.connect(g).connect(p).connect(dest);
    src.start(when);
  }

  /** Bansuri voice for one phrase — a single sustained breath with meend. */
  function playPhrase(phrase: Phrase, when: number) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    const mix2 = ctx.createGain();
    mix2.gain.value = 0.18;

    const vib = ctx.createOscillator();
    vib.frequency.value = 5.2;
    const vibDepth = ctx.createGain();
    vibDepth.gain.value = 0;
    vib.connect(vibDepth);
    vibDepth.connect(osc.frequency);
    vibDepth.connect(osc2.frequency);

    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2400;
    tone.Q.value = 0.4;

    const env = ctx.createGain();
    env.gain.value = 0;

    // breath
    const breath = ctx.createBufferSource();
    breath.buffer = noise;
    breath.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 2.5;
    const breathGain = ctx.createGain();
    breathGain.gain.value = 0.05;

    osc.connect(tone);
    osc2.connect(mix2).connect(tone);
    tone.connect(env);
    breath.connect(bp).connect(breathGain).connect(env);
    env.connect(bus);

    const base = TONIC * 2;
    let t = when;
    const first = base * SCALE[phrase[0][0]];
    osc.frequency.setValueAtTime(first * 0.985, t);
    osc2.frequency.setValueAtTime(first * 0.985, t);
    bp.frequency.setValueAtTime(first * 2, t);

    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.16, t + 0.35);

    for (const [degree, beats] of phrase) {
      const f = base * SCALE[degree];
      const dur = beats * BEAT;
      // meend: glide into each swar
      osc.frequency.setTargetAtTime(f, t, 0.06);
      osc2.frequency.setTargetAtTime(f, t, 0.06);
      bp.frequency.setTargetAtTime(f * 2, t, 0.06);
      // vibrato blooms on held notes only
      vibDepth.gain.setTargetAtTime(0, t, 0.05);
      if (beats >= 2) vibDepth.gain.setTargetAtTime(f * 0.012, t + dur * 0.45, 0.3);
      // soft dynamic swell per note
      env.gain.setTargetAtTime(beats >= 3 ? 0.17 : 0.14, t + 0.02, 0.15);
      t += dur;
    }
    env.gain.setTargetAtTime(0, t - 0.1, 0.35);
    const end = t + 2;
    [osc, osc2, vib, breath].forEach((n) => {
      n.start(when);
      n.stop(end);
    });
    return t;
  }

  function schedule() {
    const horizon = ctx.currentTime + 1.5;
    while (nextTanpura < horizon) {
      tanpuraNotes.forEach((buf, i) => playBuffer(buf, nextTanpura + i * 1.25, tanpuraGain, i === 3 ? 0.9 : 0.7, i % 2 ? 0.25 : -0.25));
      nextTanpura += 5;
    }
    while (nextPhrase < horizon) {
      let pick = Math.floor(Math.random() * PHRASES.length);
      if (pick === lastPhrase) pick = (pick + 1) % PHRASES.length;
      lastPhrase = pick;
      const end = playPhrase(PHRASES[pick], nextPhrase);
      nextPhrase = end + BEAT * (2 + Math.random() * 3);
    }
    while (nextShimmer < horizon) {
      swar.forEach((buf, i) => playBuffer(buf, nextShimmer + i * 0.11, bus, 0.09, -0.6 + i * 0.17));
      nextShimmer += 38 + Math.random() * 20;
    }
  }

  const ramp = (to: number, seconds: number) => {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(to, now + seconds);
  };

  return {
    async start() {
      await ctx.resume();
      if (!started) {
        started = true;
        const now = ctx.currentTime + 0.1;
        nextTanpura = now;
        nextPhrase = now + 4.5;
        nextShimmer = now + 1.2;
        schedule();
        timer = window.setInterval(schedule, 400);
      }
      ramp(0.8, 4);
    },
    fadeOut() {
      ramp(0, 0.8);
      window.setTimeout(() => {
        if (master.gain.value < 0.01) void ctx.suspend();
      }, 900);
    },
    fadeIn() {
      void ctx.resume().then(() => ramp(0.8, 1.5));
    },
    dispose() {
      window.clearInterval(timer);
      void ctx.close();
    },
  };
}
