// FloatingChrome.jsx — BGM player + Samantha chatbot (bottom-right)
const FloatingChrome = () => {
  const [playing, setPlaying] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{
      position: 'fixed', right: 20, bottom: 20, zIndex: 40,
      display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
    }}>
      {open && (
        <div style={{
          width: 300, background: 'rgba(15,23,42,0.88)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
          boxShadow: '0 16px 40px -12px rgba(0,0,0,0.4)',
          color: '#F1F5F9', padding: 16, fontFamily: 'var(--yb-font-sans)',
        }}>
          <div style={{ fontFamily: 'var(--yb-font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 10 }}>
            Samantha Lite · Article Navigator
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: 10,
            padding: '10px 12px', fontSize: 13, lineHeight: 1.55,
            color: 'rgba(241,245,249,0.85)',
          }}>
            Looking for something? Try "AI assistants," "BCI,"
            or "life in Bulgaria."
          </div>
          <input placeholder="Ask me…" style={{
            marginTop: 10, width: '100%', boxSizing: 'border-box',
            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, padding: '8px 10px', fontSize: 13,
            fontFamily: 'var(--yb-font-sans)', color: '#F1F5F9', outline: 'none',
          }} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setPlaying(p => !p)} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
          background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999,
          color: '#F1F5F9', fontFamily: 'var(--yb-font-mono)',
          fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
          cursor: 'pointer',
        }}>
          <span style={{
            width: 24, height: 24, borderRadius: 999,
            background: playing ? '#06B6D4' : 'rgba(255,255,255,0.15)',
            color: playing ? '#0F172A' : '#F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700,
          }}>{playing ? '❚❚' : '▶'}</span>
          Ambient Vibe
        </button>
        <button onClick={() => setOpen(o => !o)} style={{
          width: 44, height: 44, borderRadius: 999,
          background: 'linear-gradient(135deg,#06B6D4,#1E3A8A)',
          border: 0, cursor: 'pointer', color: '#fff',
          fontFamily: 'var(--yb-font-mono)', fontWeight: 700, fontSize: 14,
          boxShadow: '0 8px 20px -6px rgba(6,182,212,0.4)',
        }}>S</button>
      </div>
    </div>
  );
};

window.FloatingChrome = FloatingChrome;
