// Cloudmon 8-Bit Audio Synthesizer (Web Audio API)
// Provides authentic, synthesized 8-bit sound effects and retro chiptune background music.

class CloudmonSoundSystem {
  constructor() {
    this.ctx = null;
    this.bgmNode = null;
    this.masterVolume = null;
    this.bgmVolume = null;
    this.sfxVolume = null;
    
    this.bgmEnabled = false;
    this.sfxEnabled = true;
    this.isBgmPlaying = false;
    
    // Sequencer properties
    this.schedulerTimerId = null;
    this.nextNoteTime = 0.0;
    this.currentStep = 0;
    this.tempo = 115; // BPM
    this.lookahead = 25.0; // ms
    this.scheduleAheadTime = 0.1; // seconds
    
    // 32-step retro melody and bass loop
    // Notes format: [frequency, duration_multiplier, oscillator_type]
    // 0 represents a rest.
    this.melodyPattern = [
      "E5", "G5", "A5", "C6", "A5", "G5", "E5", "D5",
      "E5", "E5", "G5", "E5", "D5", "C5", "D5", "G4",
      "E5", "G5", "A5", "C6", "D6", "C6", "A5", "G5",
      "E5", "D5", "C5", "E5", "G5", "C6", "B5", "G5"
    ];
    
    this.bassPattern = [
      "C3", "C3", "E3", "G3", "F3", "F3", "A3", "C4",
      "C3", "C3", "E3", "G3", "G2", "G3", "B2", "D3",
      "C3", "C3", "E3", "G3", "F3", "F3", "A3", "C4",
      "C3", "G3", "E3", "C3", "G2", "B2", "D3", "G3"
    ];

    this.frequencies = {
      "G2": 98.00, "B2": 123.47,
      "C3": 130.81, "E3": 164.81, "F3": 174.61, "G3": 196.00, "A3": 220.00, "B3": 246.94,
      "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00, "B4": 493.88,
      "C5": 523.25, "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00, "B5": 987.77,
      "C6": 1046.50, "D6": 1174.66, "E6": 1318.51, "G6": 1567.98
    };
  }

  init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.ctx = new AudioContextClass();
    
    // Set up gain nodes (Volume Control)
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.setValueAtTime(0.3, this.ctx.currentTime); // Low volume defaults
    
    this.bgmVolume = this.ctx.createGain();
    this.bgmVolume.gain.setValueAtTime(0.5, this.ctx.currentTime);
    
    this.sfxVolume = this.ctx.createGain();
    this.sfxVolume.gain.setValueAtTime(0.8, this.ctx.currentTime);
    
    this.bgmVolume.connect(this.masterVolume);
    this.sfxVolume.connect(this.masterVolume);
    this.masterVolume.connect(this.ctx.destination);
  }

  resumeContext() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleBgm(enable) {
    this.bgmEnabled = enable;
    if (enable) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
  }

  toggleSfx(enable) {
    this.sfxEnabled = enable;
  }

  // --- BACKGROUND MUSIC SEQUENCER ---

  startBgm() {
    this.resumeContext();
    if (!this.ctx || !this.bgmEnabled || this.isBgmPlaying) return;
    
    this.isBgmPlaying = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.currentStep = 0;
    
    const scheduler = () => {
      while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
        this.scheduleNote(this.currentStep, this.nextNoteTime);
        this.advanceStep();
      }
      this.schedulerTimerId = setTimeout(scheduler, this.lookahead);
    };
    
    scheduler();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.schedulerTimerId) {
      clearTimeout(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }
  }

  advanceStep() {
    const secondsPerBeat = 60.0 / this.tempo;
    const stepDuration = secondsPerBeat / 2; // 8th notes
    this.nextNoteTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % 32;
  }

  scheduleNote(step, time) {
    if (!this.bgmEnabled || !this.ctx) return;

    // Melody Note (Square Wave - typical Game Boy sound)
    const melodyNote = this.melodyPattern[step];
    if (melodyNote && melodyNote !== "0") {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = "square"; // Retro pulse wave
      osc.frequency.value = this.frequencies[melodyNote];
      
      const noteLength = (60.0 / this.tempo) / 2; // 8th note duration
      
      gainNode.gain.setValueAtTime(0.06, time);
      // Fast decay for staccato 8-bit sound
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + noteLength - 0.02);
      
      osc.connect(gainNode);
      gainNode.connect(this.bgmVolume);
      
      osc.start(time);
      osc.stop(time + noteLength);
    }

    // Bass Note (Triangle Wave - softer bass representation)
    const bassNote = this.bassPattern[step];
    if (bassNote && bassNote !== "0") {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = "triangle"; // Smooth retro bass
      osc.frequency.value = this.frequencies[bassNote];
      
      const noteLength = (60.0 / this.tempo) / 2;
      
      gainNode.gain.setValueAtTime(0.12, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + noteLength - 0.01);
      
      osc.connect(gainNode);
      gainNode.connect(this.bgmVolume);
      
      osc.start(time);
      osc.stop(time + noteLength);
    }
  }

  // --- SOUND EFFECTS (SFX) ---

  playWalk() {
    if (!this.sfxEnabled) return;
    this.resumeContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(90, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(45, this.ctx.currentTime + 0.06);
    
    gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
    
    osc.connect(gainNode);
    gainNode.connect(this.sfxVolume);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playGrassStep() {
    if (!this.sfxEnabled) return;
    this.resumeContext();
    if (!this.ctx) return;

    // Synthesize rustle noise
    const bufferSize = this.ctx.sampleRate * 0.05; // 50ms noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    // Bandpass filter to make it sound like a rustle/step
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 500;
    filter.Q.value = 2.0;
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.07, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxVolume);
    
    noiseNode.start();
    noiseNode.stop(this.ctx.currentTime + 0.05);
  }

  playEncounter() {
    if (!this.sfxEnabled) return;
    this.resumeContext();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // Retro pitch sweep
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
    osc.frequency.linearRampToValueAtTime(200, now + 0.6);
    osc.frequency.linearRampToValueAtTime(1600, now + 0.9);
    
    gainNode.gain.setValueAtTime(0.0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    
    osc.connect(gainNode);
    gainNode.connect(this.sfxVolume);
    
    osc.start();
    osc.stop(now + 0.9);
  }

  playCorrectChime() {
    if (!this.sfxEnabled) return;
    this.resumeContext();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // Beautiful ascending 8-bit chime
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = "square";
      osc.frequency.value = freq;
      
      const noteStartTime = now + (index * 0.08);
      
      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.setValueAtTime(0.08, noteStartTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteStartTime + 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(this.sfxVolume);
      
      osc.start(noteStartTime);
      osc.stop(noteStartTime + 0.15);
    });
  }

  playWrongBuzz() {
    if (!this.sfxEnabled) return;
    this.resumeContext();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // Sad buzz
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(140, now + 0.15);
    
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(gainNode);
    gainNode.connect(this.sfxVolume);
    
    osc.start();
    osc.stop(now + 0.4);
  }

  playDeployFanfare() {
    if (!this.sfxEnabled) return;
    this.resumeContext();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // Triumphant Pokèmon capture jingle
    const freqs = [523.25, 587.33, 659.25, 523.25, 783.99, 783.99, 880.00, 1046.50]; // C5, D5, E5, C5, G5, G5, A5, C6
    const durs = [0.08, 0.08, 0.08, 0.08, 0.15, 0.08, 0.08, 0.4];
    
    let currentOffset = 0;
    freqs.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = "square";
      osc.frequency.value = freq;
      
      const noteStartTime = now + currentOffset;
      const noteDur = durs[index];
      
      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.setValueAtTime(0.08, noteStartTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteStartTime + noteDur);
      
      osc.connect(gainNode);
      gainNode.connect(this.sfxVolume);
      
      osc.start(noteStartTime);
      osc.stop(noteStartTime + noteDur);
      
      currentOffset += noteDur;
    });
  }

  playEscapeCrash() {
    if (!this.sfxEnabled) return;
    this.resumeContext();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // Sad falling slide sound
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.5);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(this.sfxVolume);
    
    osc.start();
    osc.stop(now + 0.5);
  }

  playGameOverTragedy() {
    if (!this.sfxEnabled) return;
    this.resumeContext();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // Tragic slow arpeggio (C Minor)
    const notes = [392.00, 311.13, 261.63, 196.00]; // G4, Eb4, C4, G3 (descending minor chord)
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.value = freq;
      
      const noteStartTime = now + (index * 0.25);
      
      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.setValueAtTime(0.15, noteStartTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteStartTime + 0.8);
      
      osc.connect(gainNode);
      gainNode.connect(this.sfxVolume);
      
      osc.start(noteStartTime);
      osc.stop(noteStartTime + 0.8);
    });
  }
}

// Global audio object
const soundSystem = new CloudmonSoundSystem();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { soundSystem };
}
