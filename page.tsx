"use client";

import { useEffect, useRef, useState } from "react";
import { BeatEngine } from "@/lib/beatEngine";
import Dancer from "@/components/Dancer";

// ---- RPG character roster (edit freely) ----
const CREW = [
  { name: "DJ VELA", style: "Vinyl / Turntablism", role: "Turntablist", anim: "anim-scratch", color: "#21e6ff" },
  { name: "KILO-9", style: "Power Moves", role: "B-Boy", anim: "anim-idle", color: "#c6ff3d" },
  { name: "AURA", style: "Wildstyle Panels", role: "Graffiti Writer", anim: "anim-toprock", color: "#ff2e7e" },
  { name: "ECHO", style: "Freestyle Flow", role: "MC", anim: "anim-nod", color: "#ff8a00" },
  { name: "SUB.T", style: "Boom-Bap Loops", role: "Beatmaker", anim: "anim-idle", color: "#9b5cff" },
];

export default function Home() {
  const engineRef = useRef<BeatEngine | null>(null);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(90);
  const [step, setStep] = useState(-1);
  const [charIndex, setCharIndex] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const engine = new BeatEngine();
    engine.setStepCallback((s) => setStep(s));
    engineRef.current = engine;
    return () => engine.pause();
  }, []);

  useEffect(() => {
    engineRef.current?.setBpm(bpm);
  }, [bpm]);

  const toggle = async () => {
    const e = engineRef.current!;
    if (playing) {
      e.pause();
      setPlaying(false);
      setStep(-1);
    } else {
      await e.play();
      setPlaying(true);
      setLevel((l) => l + 1); // building your character = RPG energy
    }
  };

  const restart = () => {
    engineRef.current?.restart();
    if (!playing) setStep(-1);
  };

  const char = CREW[charIndex];
  const animClass = playing ? char.anim : "";

  return (
    <main className="city-bg" style={{ minHeight: "100dvh", padding: "18px 14px 40px" }}>
      <header style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "var(--neon-cyan)" }}>
          ▚ STREET SYSTEM ONLINE ▞
        </div>
        <h1 className="graf-title" style={{ fontSize: 42, margin: "4px 0 0" }}>
          THE SCRATCH<br />ADVENTURE
        </h1>
      </header>

      {/* ---------- Character stage ---------- */}
      <section className="panel stage" style={{ marginBottom: 14 }}>
        {/* turntable platter behind dancer */}
        <svg
          className="no-select"
          style={{ position: "absolute", right: 14, bottom: 14, opacity: 0.9 }}
          width="86" height="86" viewBox="0 0 86 86"
        >
          <g className={playing ? "platter" : ""}>
            <circle cx="43" cy="43" r="40" fill="#12121f" stroke="#05050a" strokeWidth="3" />
            <circle cx="43" cy="43" r="26" fill="#1b1b2e" stroke="#05050a" strokeWidth="2" />
            <circle cx="43" cy="43" r="8" fill={char.color} stroke="#05050a" strokeWidth="2" />
            <rect x="41" y="6" width="4" height="16" fill="#ff2e7e" />
          </g>
        </svg>

        <Dancer animClass={animClass} />

        <div style={{ position: "absolute", top: 10, left: 12 }}>
          <div className={`eq ${playing ? "" : "paused"}`}>
            {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
          </div>
        </div>

        {/* step indicator */}
        <div style={{ position: "absolute", bottom: 10, left: 12 }} className="steps">
          {Array.from({ length: 16 }).map((_, i) => (
            <i key={i} className={i === step ? "on" : ""} />
          ))}
        </div>
      </section>

      {/* ---------- Character card ---------- */}
      <section className="panel" style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 26, fontWeight: 900, fontStyle: "italic", color: char.color }}>
            {char.name}
          </div>
          <div style={{ fontSize: 14, color: "var(--chrome-2)" }}>LVL {level}</div>
        </div>
        <div style={{ fontSize: 13, color: "var(--chrome-2)", marginTop: 4 }}>
          ROLE: <b style={{ color: "#fff" }}>{char.role}</b> · STYLE:{" "}
          <b style={{ color: "#fff" }}>{char.style}</b>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {CREW.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setCharIndex(i)}
              className="btn"
              style={{
                fontSize: 11,
                padding: "8px 10px",
                background: i === charIndex ? c.color : "#e8ecff",
              }}
            >
              {c.role}
            </button>
          ))}
        </div>
      </section>

      {/* ---------- Transport ---------- */}
      <section className="panel" style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-pink" style={{ flex: 2, fontSize: 20 }} onClick={toggle}>
            {playing ? "❚❚ PAUSE" : "► PLAY"}
          </button>
          <button className="btn btn-cyan" style={{ flex: 1, fontSize: 16 }} onClick={restart}>
            ↻ LOOP
          </button>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, letterSpacing: "0.1em" }}>BPM</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "var(--neon-lime)" }}>{bpm}</span>
          </div>
          <input
            type="range"
            min={50}
            max={180}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--chrome-2)", marginTop: 4 }}>
            <span>50 · CHOPPED</span><span>90 · BOOM-BAP</span><span>180 · JUKE</span>
          </div>
        </div>
      </section>

      <p style={{ fontSize: 11, color: "var(--chrome-2)", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
        TIP · Open in Safari → Share → “Add to Home Screen” to run fullscreen.<br />
        All audio is synthesized live. All art is original CSS/SVG.
      </p>
    </main>
  );
}
