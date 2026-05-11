// Hero.jsx — schematic-grid hero with gradient headline and cyan spotlight
const Hero = () => {
  const ref = React.useRef(null);
  const [mouse, setMouse] = React.useState({ x: 50, y: 30 });

  React.useEffect(() => {
    const onMove = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      setMouse({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section ref={ref} style={{
      position: 'relative', minHeight: 560, overflow: 'hidden',
      background: '#0A0A0A', color: '#F1F5F9', paddingTop: 96,
    }}>
      {/* schematic grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, #000 40%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, #000 40%, transparent 85%)',
      }} />
      {/* spotlight */}
      <div style={{
        position: 'absolute', left: `${mouse.x}%`, top: `${mouse.y}%`,
        width: 750, height: 750, borderRadius: 999, transform: 'translate(-50%,-50%)',
        background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 55%)',
        pointerEvents: 'none', filter: 'blur(10px)', transition: 'left 300ms linear, top 300ms linear',
      }} />
      {/* dark overlay (video would be behind) */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.55)' }} />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '80px 32px 60px' }}>
        <div style={{
          fontFamily: 'var(--yb-font-mono)', fontSize: 12, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: '#94A3B8', marginBottom: 22,
        }}>System Reboot // v2.0</div>
        <h1 style={{
          margin: 0, fontSize: 'clamp(48px, 7vw, 84px)', fontWeight: 800,
          letterSpacing: '-0.02em', lineHeight: 1.02,
          background: 'linear-gradient(135deg, #06B6D4 0%, #1E3A8A 100%)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          maxWidth: 900,
        }}>
          Reverse Engineering<br />The Human Body.
        </h1>
        <p style={{
          marginTop: 24, maxWidth: 560, fontSize: 18, lineHeight: 1.6,
          color: 'rgba(241,245,249,0.72)',
        }}>
          Notes from Yuichi — a former engineer now studying medicine in Bulgaria.
          AI, brain–computer interfaces, vibe coding with Claude Code, and quiet
          observations on life abroad.
        </p>
        <div style={{ marginTop: 34, display: 'flex', gap: 32, alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--yb-font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="yb-dot-live" />
            <span>Writing · Pleven, BG</span>
          </div>
          <div style={{ fontFamily: 'var(--yb-font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94A3B8' }}>
            <span style={{ color: '#06B6D4' }}>[01]</span> 23 articles&nbsp;&nbsp;
            <span style={{ color: '#06B6D4' }}>[02]</span> JP / EN&nbsp;&nbsp;
            <span style={{ color: '#06B6D4' }}>[03]</span> Since 2024
          </div>
        </div>
      </div>
    </section>
  );
};

window.Hero = Hero;
