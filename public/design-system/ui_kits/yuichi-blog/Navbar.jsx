// Navbar.jsx — fixed top navbar with YB monogram + nav links
const Navbar = ({ current = 'logbook', onNav = () => {} }) => {
  const links = [
    { key: 'logbook', label: 'Logbook' },
    { key: 'about', label: 'About' },
    { key: 'projects', label: 'Projects' },
    { key: 'contact', label: 'Contact' },
  ];
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 50,
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 max(24px, 5vw)', fontFamily: 'var(--yb-font-sans)',
    }}>
      <a onClick={() => onNav('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#F1F5F9', cursor: 'pointer', textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 4, background: '#fff', color: '#0F172A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--yb-font-mono)', fontWeight: 700, fontSize: 13,
        }}>YB</div>
        <span style={{ fontFamily: 'var(--yb-font-mono)', fontSize: 13, letterSpacing: '0.02em' }}>yuichi.blog</span>
      </a>
      <div style={{ display: 'flex', gap: 28 }}>
        {links.map(l => (
          <a key={l.key} onClick={() => onNav(l.key)} style={{
            fontSize: 13, fontWeight: 500, letterSpacing: '0.01em', cursor: 'pointer',
            color: current === l.key ? '#06B6D4' : 'rgba(241,245,249,0.7)',
            textDecoration: 'none', transition: 'color 160ms var(--yb-ease)',
          }}>{l.label}</a>
        ))}
      </div>
    </nav>
  );
};

window.Navbar = Navbar;
