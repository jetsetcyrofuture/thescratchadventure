// lib/beatEngine.ts
// Original synthesized boom-bap loop using the Web Audio API.
// No sample files = nothing copyrighted, and BPM-accurate looping.

export type BeatCallback = (step: number) => void;

export class BeatEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bpm = 90;
  private isPlaying = false;
  private current16thStep = 0;
  private nextNoteTime = 0;
  private lookahead = 25; // ms
  private scheduleAheadTime = 0.1; // s
  private timerId: number | null = null;
  private onStep: BeatCallback | null = null;

  // 16-step patterns (1 = hit). Kept simple + editable.
  private kick = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0];
  private snare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
  private hat = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1];

  setStepCallback(cb: BeatCallback) {
    this.onStep = cb;
  }

  setBpm(bpm: number) {
    this.bpm = Math.min(200, Math.max(50, bpm));
  }

  getBpm() {
    return this.bpm;
  }

  private ensureContext() {
    if (!this.ctx) {
      const AC =
        window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
    }
  }

  private secondsPer16th() {
    return 60.0 / this.bpm / 4;
  }

  private scheduleKick(time: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
    osc.connect(gain).connect(this.master!);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  private scheduleSnare(time: number) {
    const ctx = this.ctx!;
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    noise.connect(bp).connect(gain).connect(this.master!);
    noise.start(time);
    noise.stop(time + 0.2);
  }

  private scheduleHat(time: number) {
    const ctx = this.ctx!;
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    noise.connect(hp).connect(gain).connect(this.master!);
    noise.start(time);
    noise.stop(time + 0.06);
  }

  private scheduleNote(step: number, time: number) {
    if (this.kick[step]) this.scheduleKick(time);
    if (this.snare[step]) this.scheduleSnare(time);
    if (this.hat[step]) this.scheduleHat(time);
    if (this.onStep) {
      const delay = Math.max(0, (time - this.ctx!.currentTime) * 1000);
      window.setTimeout(() => this.onStep && this.onStep(step), delay);
    }
  }

  private scheduler = () => {
    const ctx = this.ctx!;
    while (this.nextNoteTime < ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.current16thStep, this.nextNoteTime);
      this.nextNoteTime += this.secondsPer16th();
      this.current16thStep = (this.current16thStep + 1) % 16;
    }
    this.timerId = window.setTimeout(this.scheduler, this.lookahead);
  };

  async play() {
    this.ensureContext();
    if (this.ctx!.state === "suspended") await this.ctx!.resume();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.current16thStep = 0;
    this.nextNoteTime = this.ctx!.currentTime + 0.05;
    this.scheduler();
  }

  pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  restart() {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.current16thStep = 0;
    if (wasPlaying) this.play();
  }

  playing() {
    return this.isPlaying;
  }
}
