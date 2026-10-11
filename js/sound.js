// Small procedural sound palette for Ashwick. Audio starts only after a gesture.
(() => {
  const key = 'ashwick-sound-muted';
  let muted = localStorage.getItem(key) === 'true';
  let ctx, master, traceSource, traceGain, traceFilter, traceTick, traceTimer;
  const $ = s => document.querySelector(s);
  const toggle = $('#sound-toggle');
  const rand = (a, b) => a + Math.random() * (b - a);
  const setButton = () => {
    toggle.textContent = muted ? 'Sound off' : 'Sound on';
    toggle.setAttribute('aria-pressed', String(muted));
    toggle.setAttribute('aria-label', muted ? 'Turn sound on' : 'Mute sounds');
  };
  setButton();

  function init() {
    if (!ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      ctx = new AudioContext();
      master = ctx.createGain(); master.gain.value = muted ? 0 : .22; master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  function tone(freq, duration, { type = 'sine', volume = .12, endFreq, attack = .015, delay = 0, target } = {}) {
    if (!init()) return;
    target = target || master;
    const n = ctx.currentTime + delay, osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(Math.max(25, freq), n);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(25, endFreq), n + duration);
    gain.gain.setValueAtTime(.0001, n); gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), n + attack);
    gain.gain.exponentialRampToValueAtTime(.0001, n + duration);
    osc.connect(gain); gain.connect(target); osc.start(n); osc.stop(n + duration + .03);
  }
  function noise(duration, { volume = .1, filter = 'bandpass', freq = 1200, endFreq, q = 1, delay = 0 } = {}) {
    if (!init()) return;
    const n = ctx.currentTime + delay, frames = Math.ceil(ctx.sampleRate * duration), buffer = ctx.createBuffer(1, frames, ctx.sampleRate), data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), gain = ctx.createGain();
    src.buffer = buffer; f.type = filter; f.frequency.setValueAtTime(Math.max(40, freq), n); f.Q.value = q;
    if (endFreq) f.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), n + duration);
    gain.gain.setValueAtTime(.0001, n); gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), n + .012); gain.gain.exponentialRampToValueAtTime(.0001, n + duration);
    src.connect(f); f.connect(gain); gain.connect(master); src.start(n); src.stop(n + duration + .02);
  }
  function bell(delay, freq, volume = .07) {
    tone(freq * rand(.985, 1.02), rand(.55, .95), { type: 'sine', volume, attack: .006, delay });
    tone(freq * 2.01, rand(.18, .32), { type: 'sine', volume: volume * .28, attack: .004, delay });
  }
  function thud(delay = 0, volume = .13, freq = 70) {
    tone(freq, .22, { type: 'sine', volume, endFreq: 34, attack: .008, delay });
    noise(.07, { volume: volume * .3, filter: 'lowpass', freq: 180, delay });
  }
  function click(delay = 0, volume = .06) { tone(rand(1500, 2300), .035, { type: 'square', volume, endFreq: 500, attack: .002, delay }); }
  function startTrace() {
    if (!init() || traceSource) return;
    const frames = ctx.sampleRate, buffer = ctx.createBuffer(1, frames, ctx.sampleRate), data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
    traceSource = ctx.createBufferSource(); traceSource.buffer = buffer; traceSource.loop = true;
    traceFilter = ctx.createBiquadFilter(); traceFilter.type = 'bandpass'; traceFilter.Q.value = 1.4; traceFilter.frequency.value = 1800;
    traceGain = ctx.createGain(); traceGain.gain.value = .0001;
    traceSource.connect(traceFilter); traceFilter.connect(traceGain); traceGain.connect(master); traceSource.start();
    traceGain.gain.setTargetAtTime(.11, ctx.currentTime, .025);
  }
  function updateTrace(speed = 500) {
    if (!traceSource && !init()) return;
    if (!traceSource) startTrace();
    if (!traceSource) return;
    const v = Math.min(1, Math.max(0, speed / 1300)), n = ctx.currentTime;
    traceFilter.frequency.setTargetAtTime(800 + v * 3600, n, .035);
    traceGain.gain.setTargetAtTime(.035 + v * .11, n, .025);
    traceSource.playbackRate.setTargetAtTime(.72 + v * .8, n, .04);
  }
  function stopTrace() {
    clearTimeout(traceTimer); traceTimer = null;
    clearInterval(traceTick); traceTick = null;
    if (!traceSource) return;
    const source = traceSource, gain = traceGain, n = ctx.currentTime;
    gain.gain.cancelScheduledValues(n); gain.gain.setTargetAtTime(.0001, n, .025);
    traceTimer = setTimeout(() => { try { source.stop(); } catch (_) {} }, 140);
    traceSource = traceGain = traceFilter = null;
  }
  function presetTrace(duration) {
    stopTrace(); startTrace();
    let elapsed = 0;
    traceTick = setInterval(() => { updateTrace(rand(220, 1150)); elapsed += 75; if (elapsed >= duration) stopTrace(); }, 75);
    traceTimer = setTimeout(stopTrace, duration + 30);
  }
  function casting() {
    noise(.22, { volume: .055, filter: 'bandpass', freq: 900, endFreq: 1800 });
    tone(rand(105, 145), .085, { type: 'triangle', volume: .075, endFreq: 75, delay: .12, attack: .004 });
    tone(rand(95, 125), .7, { type: 'sine', volume: .035, endFreq: 70, delay: .19, attack: .08 });
  }
  function boltStart() { tone(rand(500, 800), .27, { type: 'sine', volume: .055, endFreq: rand(1300, 1900), attack: .018 }); }
  function boltLand() { noise(.04, { volume: .045, filter: 'highpass', freq: 1700 }); }
  function spell(name) {
    const jitter = () => rand(-.045, .045);
    if (name === 'flame') {
      tone(72, 2.3, { type: 'sawtooth', volume: .045, endFreq: 48, attack: .18 });
      for (let i = 0; i < 14; i++) noise(rand(.018, .055), { volume: rand(.025, .07), filter: 'highpass', freq: rand(1800, 6000), delay: rand(0, 1.75) });
      noise(.38, { volume: .14, filter: 'lowpass', freq: 850, endFreq: 95, delay: .08 });
    } else if (name === 'ward') {
      tone(240, 1.1, { type: 'triangle', volume: .075, endFreq: 740, attack: .18 });
      tone(510, .75, { type: 'sine', volume: .026, endFreq: 880, delay: .12 });
      thud(.94 + jitter(), .11, 105);
    } else if (name === 'moon') {
      tone(145, 2.5, { type: 'sine', volume: .032, endFreq: 72, attack: .35 });
      const notes = [523.25, 587.33, 659.25, 783.99, 880];
      for (let i = 0; i < 16; i++) bell(i * rand(.105, .145), notes[Math.random() * notes.length | 0], rand(.025, .05));
    } else if (name === 'eye') {
      noise(.65, { volume: .09, filter: 'bandpass', freq: 500, endFreq: 1900, q: 3 });
      for (let i = 0; i < 3; i++) { thud(.48 + i * .72 + jitter(), .1, 55); tone(46, .12, { volume: .065, delay: .57 + i * .72 }); }
      click(1.55, .045);
    } else if (name === 'earth') {
      noise(2.2, { volume: .105, filter: 'lowpass', freq: 160, endFreq: 70, q: .7 });
      for (let i = 0; i < 8; i++) {
        const t = .08 + i * .11 + jitter();
        noise(.09, { volume: .105, filter: 'lowpass', freq: rand(450, 1100), endFreq: 100, delay: t });
        tone(rand(55, 95), .16, { type: 'triangle', volume: .07, endFreq: 38, delay: t });
      }
      for (let i = 0; i < 9; i++) noise(.08, { volume: rand(.018, .045), filter: 'highpass', freq: rand(1200, 3500), delay: rand(.6, 2) });
    } else if (name === 'wind') {
      noise(2.1, { volume: .075, filter: 'bandpass', freq: 300, endFreq: 1500, q: 2 });
      noise(2.1, { volume: .055, filter: 'bandpass', freq: 1200, endFreq: 250, q: 2.8 });
      for (let i = 0; i < 5; i++) noise(.16, { volume: .035, filter: 'bandpass', freq: rand(700, 1700), delay: rand(.1, 1.7) });
    } else if (name === 'void') {
      tone(82, 2.25, { type: 'sine', volume: .1, endFreq: 31, attack: .3 });
      noise(.72, { volume: .065, filter: 'lowpass', freq: 1700, endFreq: 90, delay: .2 });
      noise(.55, { volume: .07, filter: 'lowpass', freq: 1600, endFreq: 140, delay: 1.25 });
      thud(2.02 + jitter(), .13, 62);
    } else if (name === 'frost') {
      for (let i = 0; i < 14; i++) bell(rand(0, 1.3), rand(950, 2200), rand(.018, .045));
      for (let i = 0; i < 7; i++) noise(.11, { volume: .035, filter: 'highpass', freq: rand(2500, 6000), delay: i * .12 });
    } else if (name === 'bloom') {
      noise(1.35, { volume: .055, filter: 'bandpass', freq: 650, endFreq: 1500, q: 1.8 });
      for (let i = 0; i < 5; i++) {
        const t = .25 + i * .18 + jitter();
        noise(.045, { volume: .05, filter: 'lowpass', freq: 500, endFreq: 180, delay: t });
        tone([659, 784, 988, 1175, 1318][i], .42, { type: 'triangle', volume: .038, endFreq: [988, 1175, 1318, 1568, 1760][i], delay: t + .04 });
      }
    } else {
      for (let i = 0; i < 10; i++) noise(rand(.025, .09), { volume: rand(.045, .1), filter: 'highpass', freq: rand(1400, 5200), delay: rand(0, 1.1) });
      noise(.12, { volume: .1, filter: 'lowpass', freq: 750, endFreq: 120, delay: .4 });
      noise(.2, { volume: .065, filter: 'lowpass', freq: 220, endFreq: 80, delay: 1.1 });
    }
  }
  toggle.addEventListener('click', () => {
    muted = !muted; localStorage.setItem(key, String(muted)); setButton();
    if (init()) master.gain.setTargetAtTime(muted ? 0 : .22, ctx.currentTime, .04);
  });
  window.ASHWICK_SOUND = { startTrace, updateTrace, stopTrace, presetTrace, casting, boltStart, boltLand, spell };
})();
