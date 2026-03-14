"use client";
import { useState, useRef, useEffect } from "react";
import { sendQuestion, ingestDocuments } from "@/lib/api";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  loading?: boolean;
}

const suggestions = [
  "What is the punishment for theft under PPC?",
  "What are cybercrime penalties under PECA?",
  "How is bail granted under CrPC?",
  "Punishment for murder in Pakistan?",
];

export default function Home() {
  const [messages, setMessages]       = useState<Message[]>([]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [ingesting, setIngesting]     = useState(false);
  const [ingestDone, setIngestDone]   = useState(false);
  const [ingestMsg, setIngestMsg]     = useState("");
  const [ingestError, setIngestError] = useState(false);
  const [particles, setParticles]     = useState<{id:number;x:number;y:number;size:number;speed:number;opacity:number}[]>([]);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ps = Array.from({length: 30}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 20 + 10,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setParticles(ps);
  }, []);

  const handleIngest = async () => {
    setIngesting(true); setIngestMsg(""); setIngestError(false);
    try {
      const res = await ingestDocuments();
      setIngestMsg(`${res.chunks_indexed} provisions indexed`);
      setIngestDone(true);
    } catch (e: any) {
      setIngestMsg(e.message); setIngestError(true);
    } finally { setIngesting(false); }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "50px";
    setLoading(true);
    const userMsg: Message    = { id: Date.now(),     role: "user",      content: question };
    const loadingMsg: Message = { id: Date.now() + 1, role: "assistant", content: "", loading: true };
    setMessages(p => [...p, userMsg, loadingMsg]);
    try {
      const res = await sendQuestion(question);
      setMessages(p => p.map(m => m.loading ? { ...m, content: res.answer, sources: res.sources, loading: false } : m));
    } catch (e: any) {
      setMessages(p => p.map(m => m.loading ? { ...m, content: `Error: ${e.message}`, loading: false } : m));
    } finally { setLoading(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');

        :root {
          --p1: #a855f7;
          --p2: #7c3aed;
          --p3: #6d28d9;
          --p4: #4c1d95;
          --neon: #d946ef;
          --neon2: #a21caf;
          --cyan: #22d3ee;
          --bg: #030307;
          --bg2: #07070f;
          --bg3: #0d0d1a;
          --bg4: #111128;
          --bg5: #16163a;
          --glass: rgba(168,85,247,0.06);
          --glass2: rgba(168,85,247,0.1);
          --border: rgba(168,85,247,0.2);
          --border2: rgba(168,85,247,0.1);
          --text: #f0eeff;
          --text2: #9b8fc0;
          --text3: #4a4570;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        .syne { font-family: 'Syne', sans-serif; }

        /* ── SCROLLBAR ── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg2); }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, var(--p1), var(--p3));
          border-radius: 4px;
        }

        /* ── KEYFRAMES ── */
        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }

        @keyframes neonPulse {
          0%, 100% {
            box-shadow:
              0 0 5px var(--p1),
              0 0 20px var(--p2),
              0 0 40px rgba(168,85,247,0.3);
          }
          50% {
            box-shadow:
              0 0 10px var(--p1),
              0 0 40px var(--p2),
              0 0 80px rgba(168,85,247,0.5),
              0 0 120px rgba(168,85,247,0.2);
          }
        }

        @keyframes borderGlow {
          0%, 100% { border-color: rgba(168,85,247,0.3); }
          50%       { border-color: rgba(168,85,247,0.7); }
        }

        @keyframes drift {
          0%   { transform: translateY(100vh) scale(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }

        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0) scale(1); }
          40%           { transform: translateY(-8px) scale(1.2); }
        }

        @keyframes ripple {
          0%   { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        @keyframes logoSpin {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        /* ── STAGGER ── */
        .s1 { animation: fadeSlideUp 0.8s cubic-bezier(.16,1,.3,1) 0.1s both; }
        .s2 { animation: fadeSlideUp 0.8s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .s3 { animation: fadeSlideUp 0.8s cubic-bezier(.16,1,.3,1) 0.3s both; }
        .s4 { animation: fadeSlideUp 0.8s cubic-bezier(.16,1,.3,1) 0.4s both; }
        .s5 { animation: fadeSlideUp 0.8s cubic-bezier(.16,1,.3,1) 0.5s both; }
        .msg { animation: fadeSlideUp 0.4s cubic-bezier(.16,1,.3,1) both; }

        /* ── NEON TITLE ── */
        .neon-title {
          background: linear-gradient(135deg, #fff 0%, var(--p1) 40%, var(--neon) 70%, var(--cyan) 100%);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── GLASS CARD ── */
        .glass {
          background: var(--glass);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border2);
          transition: all 0.3s;
        }
        .glass:hover {
          background: var(--glass2);
          border-color: var(--border);
        }

        /* ── NEON BUTTON ── */
        .neon-btn {
          position: relative;
          background: linear-gradient(135deg, var(--p2), var(--p3));
          border: 1px solid var(--p1);
          color: white;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s;
          overflow: hidden;
        }
        .neon-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--p1), var(--neon));
          opacity: 0;
          transition: opacity 0.25s;
        }
        .neon-btn:hover::before { opacity: 1; }
        .neon-btn:hover {
          box-shadow: 0 0 20px rgba(168,85,247,0.6), 0 0 40px rgba(168,85,247,0.3);
          transform: translateY(-1px);
        }
        .neon-btn span { position: relative; z-index: 1; }
        .neon-btn:disabled {
          background: var(--bg4) !important;
          border-color: var(--border2) !important;
          color: var(--text3) !important;
          box-shadow: none !important;
          transform: none !important;
          cursor: default;
        }
        .neon-btn:disabled::before { display: none; }

        /* ── SEND BUTTON ── */
        .send-btn {
          width: 52px; height: 52px; border-radius: 14px; border: none;
          background: linear-gradient(135deg, var(--p1), var(--p3));
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.25s; flex-shrink: 0;
          color: white; position: relative; overflow: hidden;
          animation: neonPulse 3s ease infinite;
        }
        .send-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--neon), var(--p1));
          opacity: 0;
          transition: opacity 0.25s;
        }
        .send-btn:hover::after { opacity: 1; }
        .send-btn:hover { transform: translateY(-2px) scale(1.05); }
        .send-btn svg { position: relative; z-index: 1; }
        .send-btn:disabled {
          background: var(--bg4) !important;
          animation: none !important;
          transform: none !important;
          cursor: default;
          color: var(--text3);
        }

        /* ── INPUT ── */
        .legal-input {
          background: var(--bg3);
          border: 1px solid var(--border2);
          border-radius: 16px;
          padding: 15px 22px;
          font-size: 14px;
          color: var(--text);
          resize: none;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          line-height: 1.65;
          transition: all 0.3s;
          width: 100%;
        }
        .legal-input::placeholder { color: var(--text3); }
        .legal-input:focus {
          outline: none;
          border-color: var(--p1);
          background: var(--bg4);
          box-shadow:
            0 0 0 3px rgba(168,85,247,0.12),
            0 0 20px rgba(168,85,247,0.08),
            inset 0 1px 0 rgba(168,85,247,0.1);
        }

        /* ── SUGGESTION BTN ── */
        .sugg {
          text-align: left; padding: 14px 18px; border-radius: 14px;
          font-size: 13px; font-family: 'Inter', sans-serif; font-weight: 400;
          background: rgba(168,85,247,0.04);
          border: 1px solid rgba(168,85,247,0.12);
          color: var(--text2); cursor: pointer; transition: all 0.25s;
          line-height: 1.5; width: 100%; position: relative; overflow: hidden;
        }
        .sugg::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.08), transparent);
          transition: left 0.4s;
        }
        .sugg:hover::before { left: 100%; }
        .sugg:hover {
          background: rgba(168,85,247,0.1);
          border-color: rgba(168,85,247,0.35);
          color: var(--text);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(168,85,247,0.15);
        }

        /* ── SOURCE TAGS ── */
        .src-tag {
          font-size: 11px; padding: 4px 12px; border-radius: 20px;
          background: rgba(168,85,247,0.08);
          border: 1px solid rgba(168,85,247,0.25);
          color: var(--p1); letter-spacing: 0.04em; font-weight: 500;
        }

        /* ── TYPING DOTS ── */
        .dot {
          display: inline-block; width: 6px; height: 6px; border-radius: 50%;
          background: var(--p1); margin: 0 2px;
        }
        .dot:nth-child(1) { animation: bounce 1.2s ease infinite 0s; }
        .dot:nth-child(2) { animation: bounce 1.2s ease infinite 0.15s; }
        .dot:nth-child(3) { animation: bounce 1.2s ease infinite 0.3s; }

        /* ── LOGO ── */
        .logo-wrap {
          position: relative;
          width: 46px; height: 46px;
        }
        .logo-ring {
          position: absolute; inset: -4px; border-radius: 50%;
          border: 1px solid transparent;
          background: linear-gradient(var(--bg), var(--bg)) padding-box,
                      linear-gradient(135deg, var(--p1), var(--neon)) border-box;
          animation: spin 6s linear infinite;
        }
        .logo-inner {
          width: 46px; height: 46px; border-radius: 13px;
          background: linear-gradient(135deg, var(--bg4), var(--bg5));
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; position: relative; z-index: 1;
          box-shadow: 0 0 20px rgba(168,85,247,0.2), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* ── PARTICLE ── */
        .particle {
          position: fixed;
          border-radius: 50%;
          background: var(--p1);
          pointer-events: none;
          z-index: 0;
        }

        /* ── MESH GRADIENT BG ── */
        .mesh {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(124,58,237,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(217,70,239,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(168,85,247,0.04) 0%, transparent 60%);
        }

        /* ── GRID PATTERN ── */
        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.03;
          background-image:
            linear-gradient(rgba(168,85,247,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.8) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── HEADER GLOW LINE ── */
        .header-glow {
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(168,85,247,0.3) 20%,
            var(--p1) 50%,
            rgba(168,85,247,0.3) 80%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(168,85,247,0.5), 0 0 20px rgba(168,85,247,0.2);
        }

        /* ── INDEX BANNER GLOW ── */
        .ready-badge {
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.3);
          color: var(--p1);
          box-shadow: 0 0 12px rgba(168,85,247,0.15);
          animation: borderGlow 2s ease infinite;
        }

        /* ── CORNER DECORATION ── */
        .corner-tl {
          position: absolute; top: 0; left: 0;
          width: 20px; height: 20px;
          border-top: 1px solid var(--p1);
          border-left: 1px solid var(--p1);
          border-radius: 4px 0 0 0;
        }
        .corner-br {
          position: absolute; bottom: 0; right: 0;
          width: 20px; height: 20px;
          border-bottom: 1px solid var(--p1);
          border-right: 1px solid var(--p1);
          border-radius: 0 0 4px 0;
        }

        /* ── RIPPLE ON SEND ── */
        .ripple-ring {
          position: absolute; inset: 0; border-radius: 14px;
          border: 1px solid var(--p1);
          animation: ripple 1.5s ease infinite;
        }

        /* ── USER BUBBLE ── */
        .user-bubble {
          background: linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15));
          border: 1px solid rgba(168,85,247,0.3);
          box-shadow: 0 4px 20px rgba(168,85,247,0.1), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        /* ── AI BUBBLE ── */
        .ai-bubble {
          background: var(--bg3);
          border: 1px solid rgba(168,85,247,0.12);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .ai-bubble:hover {
          border-color: rgba(168,85,247,0.25);
        }

        /* ── SCAN LINE EFFECT ── */
        .scanline {
          position: fixed; top: 0; left: 0; right: 0;
          height: 2px; pointer-events: none; z-index: 9998;
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.15), transparent);
          animation: scanline 8s linear infinite;
        }

        /* ── WELCOME ORNAMENT ── */
        .ornament {
          display: flex; align-items: center; gap: 16px;
          width: 100%; max-width: 400px;
        }
        .ornament-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.3));
        }
        .ornament-line.rev {
          background: linear-gradient(90deg, rgba(168,85,247,0.3), transparent);
        }
        .ornament-diamond {
          width: 8px; height: 8px; border-radius: 2px;
          background: var(--p1);
          transform: rotate(45deg);
          box-shadow: 0 0 8px var(--p1), 0 0 16px rgba(168,85,247,0.4);
        }
      `}</style>

      {/* ── AMBIENT LAYERS ── */}
      <div className="mesh" />
      <div className="grid-bg" />
      <div className="scanline" />

      {/* ── FLOATING PARTICLES ── */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `drift ${p.speed}s linear ${-Math.random() * p.speed}s infinite`,
            boxShadow: `0 0 ${p.size * 3}px var(--p1)`,
          }}
        />
      ))}

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

        {/* ══════════════ HEADER ══════════════ */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(3,3,7,0.85)',
          backdropFilter: 'blur(30px)',
          padding: '14px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(168,85,247,0.1)',
        }}>
          {/* Logo + Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="logo-wrap">
              <div className="logo-ring" />
              <div className="logo-inner">⚖️</div>
            </div>
            <div>
              <h1 className="syne" style={{
                fontSize: 18, fontWeight: 700, letterSpacing: '0.02em',
                background: 'linear-gradient(135deg, #fff, var(--p1))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Crime-Check Pakistan
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                <p style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  PPC · CrPC · PECA · Live
                </p>
              </div>
            </div>
          </div>

          {/* Right side: status + button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {ingestDone && (
              <div className="ready-badge" style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, fontFamily: 'Syne, sans-serif' }}>
                ✦ {ingestMsg}
              </div>
            )}
            <button
              className="neon-btn"
              onClick={handleIngest}
              disabled={ingesting || ingestDone}
              style={{
                padding: '10px 22px', borderRadius: 12, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {ingesting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg style={{ width: 14, height: 14, animation: 'spin 0.8s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <span>Indexing PDFs...</span>
                </span>
              ) : ingestDone ? (
                <span>✦ Library Ready</span>
              ) : (
                <span>⚡ Index Documents</span>
              )}
            </button>
          </div>
        </header>

        <div className="header-glow" />

        {/* ── ERROR BANNER ── */}
        {ingestError && ingestMsg && (
          <div style={{
            margin: '16px 32px 0', padding: '12px 18px', borderRadius: 12,
            background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)',
            color: '#f87171', fontSize: 13, animation: 'fadeIn 0.3s ease',
          }}>
            ✕  {ingestMsg}
          </div>
        )}

        {/* ══════════════ CHAT AREA ══════════════ */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '32px 32px 20px',
          maxWidth: 920, width: '100%', margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>

          {/* ══════════ WELCOME STATE ══════════ */}
          {messages.length === 0 && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', minHeight: '60vh',
              gap: 40, textAlign: 'center', padding: '20px 16px',
            }}>

              {/* Hero emblem */}
              <div className="s1" style={{ position: 'relative', display: 'inline-block' }}>
                {/* Outer ring glow */}
                <div style={{
                  position: 'absolute', inset: -20, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
                  animation: 'neonPulse 3s ease infinite',
                }} />
                {/* Ring 1 */}
                <div style={{
                  position: 'absolute', inset: -12, borderRadius: '50%',
                  border: '1px solid rgba(168,85,247,0.2)',
                  animation: 'spin 12s linear infinite',
                }} />
                {/* Ring 2 */}
                <div style={{
                  position: 'absolute', inset: -6, borderRadius: '50%',
                  border: '1px dashed rgba(168,85,247,0.15)',
                  animation: 'spin 8s linear reverse infinite',
                }} />
                {/* Main icon */}
                <div style={{
                  width: 90, height: 90, borderRadius: 24,
                  background: 'linear-gradient(135deg, var(--bg4), var(--bg5))',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 40, position: 'relative', zIndex: 1,
                  boxShadow: '0 0 30px rgba(168,85,247,0.3), 0 0 60px rgba(168,85,247,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                  animation: 'float 4s ease infinite',
                }}>⚖️</div>
              </div>

              {/* Title */}
              <div className="s2" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h2 className="syne neon-title" style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  Pakistan Legal Intelligence
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text2)', maxWidth: 460, lineHeight: 1.8, fontWeight: 300, margin: '0 auto' }}>
                  Ask anything about Pakistani law. Get instant, cited answers from
                  the PPC, CrPC &amp; PECA — powered by AI.
                </p>
              </div>

              {/* Ornament */}
              <div className="s3 ornament">
                <div className="ornament-line" />
                <div className="ornament-diamond" />
                <div className="ornament-line rev" />
              </div>

              {/* Suggestion grid */}
              <div className="s4" style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 10, width: '100%', maxWidth: 620,
              }}>
                {suggestions.map((s, i) => (
                  <button key={i} className="sugg" onClick={() => setInput(s)}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{
                        color: 'var(--p1)', fontSize: 16, lineHeight: 1,
                        flexShrink: 0, marginTop: 1,
                        textShadow: '0 0 8px var(--p1)',
                      }}>›</span>
                      <span>{s}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Setup hint */}
              <div className="s5 glass" style={{
                padding: '14px 24px', borderRadius: 14, maxWidth: 460,
                fontSize: 13, color: 'var(--text2)', lineHeight: 1.7,
                position: 'relative',
              }}>
                <div className="corner-tl" />
                <div className="corner-br" />
                <span style={{ color: 'var(--p1)' }}>First time?</span> Click{' '}
                <span style={{
                  color: 'white', fontWeight: 500,
                  textShadow: '0 0 8px var(--p1)',
                }}>⚡ Index Documents</span>{' '}
                to process your legal PDFs before asking questions.
              </div>

              <p className="s5" style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                ⚠ Educational purposes only · Not a substitute for legal advice
              </p>
            </div>
          )}

          {/* ══════════ MESSAGES ══════════ */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="msg"
              style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {/* AI Avatar */}
              {msg.role === 'assistant' && (
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0, marginTop: 2,
                  background: 'linear-gradient(135deg, var(--bg4), var(--bg5))',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15,
                  boxShadow: '0 0 12px rgba(168,85,247,0.2)',
                }}>⚖️</div>
              )}

              <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Role label */}
                <div style={{
                  fontSize: 10, color: 'var(--text3)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  paddingLeft: msg.role === 'user' ? 0 : 2,
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  fontFamily: 'Syne, sans-serif',
                }}>
                  {msg.role === 'user' ? 'You' : 'AI Legal Assistant'}
                </div>

                {/* Bubble */}
                <div
                  className={msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}
                  style={{
                    padding: '14px 18px', fontSize: 14, lineHeight: 1.8,
                    borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                    transition: 'border-color 0.3s',
                  }}
                >
                  {msg.loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                      <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 4, fontStyle: 'italic', letterSpacing: '0.03em' }}>
                        Searching legal provisions...
                      </span>
                    </div>
                  ) : (
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                  )}
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: msg.role === 'user' ? 0 : 2 }}>
                    <span style={{ fontSize: 10, color: 'var(--text3)', alignSelf: 'center', marginRight: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sources:</span>
                    {msg.sources.map((s, i) => (
                      <span key={i} className="src-tag">§ {s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.role === 'user' && (
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0, marginTop: 2,
                  background: 'linear-gradient(135deg, var(--p3), var(--p4))',
                  border: '1px solid rgba(168,85,247,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15,
                  boxShadow: '0 0 12px rgba(168,85,247,0.25)',
                }}>👤</div>
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* ── GLOW DIVIDER ── */}
        <div className="header-glow" />

        {/* ══════════════ INPUT BAR ══════════════ */}
        <div style={{
          background: 'rgba(3,3,7,0.9)',
          backdropFilter: 'blur(30px)',
          padding: '18px 32px 24px',
          position: 'relative', zIndex: 10,
        }}>
          <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about a crime, legal section, or punishment in Pakistan..."
                rows={1}
                className="legal-input"
                style={{ minHeight: 52, maxHeight: 200 }}
                onInput={e => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = 'auto';
                  t.style.height = Math.min(t.scrollHeight, 200) + 'px';
                }}
              />
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {!loading && input.trim() && <div className="ripple-ring" />}
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="send-btn"
                >
                  {loading ? (
                    <svg style={{ width: 18, height: 18, animation: 'spin 0.9s linear infinite' }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--p1)', boxShadow: '0 0 6px var(--p1)' }} />
                <span style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Powered by Llama 3.1 · RAG · LanceDB
                </span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}