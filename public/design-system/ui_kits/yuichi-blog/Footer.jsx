// Footer.jsx — end of homepage
const Footer = () => (
  <footer style={{
    background: '#0F172A', color: 'rgba(241,245,249,0.7)', padding: '60px 32px 40px',
    fontFamily: 'var(--yb-font-sans)',
  }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 4, background: '#fff', color: '#0F172A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--yb-font-mono)', fontWeight: 700, fontSize: 13,
          }}>YB</div>
          <span style={{ fontFamily: 'var(--yb-font-mono)', fontSize: 13, color: '#F1F5F9' }}>yuichi.blog</span>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 340, margin: 0 }}>
          Reverse engineering the human body — one study session, one weekend project
          at a time. Written from Pleven, Bulgaria.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 60 }}>
        <div>
          <div style={{ fontFamily: 'var(--yb-font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 12 }}>Write</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <a style={{ color: 'rgba(241,245,249,0.7)' }}>Logbook</a>
            <a style={{ color: 'rgba(241,245,249,0.7)' }}>Projects</a>
            <a style={{ color: 'rgba(241,245,249,0.7)' }}>RSS</a>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--yb-font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 12 }}>Elsewhere</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <a style={{ color: 'rgba(241,245,249,0.7)' }}>GitHub</a>
            <a style={{ color: 'rgba(241,245,249,0.7)' }}>Note</a>
            <a style={{ color: 'rgba(241,245,249,0.7)' }}>Contact</a>
          </div>
        </div>
      </div>
    </div>
    <div style={{
      maxWidth: 1280, margin: '40px auto 0', paddingTop: 22,
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
      fontFamily: 'var(--yb-font-mono)', fontSize: 11, letterSpacing: '0.08em',
      color: '#94A3B8',
    }}>
      <span>© 2026 Yuichi · Built with Next.js on Vercel</span>
      <span>Medical disclaimer: this site is reflection, not advice.</span>
    </div>
  </footer>
);

window.Footer = Footer;
