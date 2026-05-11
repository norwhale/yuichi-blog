// ArticleCard.jsx + FilterPills.jsx — logbook list UI
const ArticleCard = ({ article, onOpen }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <article
      onClick={() => onOpen(article)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16,
        boxShadow: hover ? '6px 6px 0 0 rgba(15,23,42,0.08)' : '4px 4px 0 0 rgba(15,23,42,0.05)',
        padding: 0, cursor: 'pointer', overflow: 'hidden', position: 'relative',
        transition: 'box-shadow 280ms var(--yb-ease), transform 280ms var(--yb-ease)',
        transform: hover ? 'translate(-1px,-1px)' : 'translate(0,0)',
      }}>
      {/* tech-line */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: '#06B6D4',
        transform: hover ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: 'top',
        transition: 'transform 280ms var(--yb-ease)', zIndex: 2,
      }} />
      {/* hero image — sharp corners */}
      <div style={{
        aspectRatio: '16/9', background: article.bg || 'linear-gradient(135deg,#0F172A,#1E3A8A)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(circle at 20% 35%, rgba(255,255,255,0.15), transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(6,182,212,0.3), transparent 55%)`,
          filter: hover ? 'grayscale(0) opacity(1)' : 'grayscale(1) opacity(0.82)',
          transform: hover ? 'scale(1.05)' : 'scale(1)',
          transition: 'filter 400ms var(--yb-ease), transform 600ms var(--yb-ease)',
        }} />
        <div style={{
          position: 'absolute', left: 14, bottom: 12,
          fontFamily: 'var(--yb-font-mono)', fontSize: 10, color: '#fff', opacity: 0.75,
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>{article.tag}</div>
      </div>
      <div style={{ padding: '18px 20px 22px' }}>
        <div style={{
          fontFamily: 'var(--yb-font-mono)', fontSize: 11, color: '#64748B',
          letterSpacing: '0.02em', marginBottom: 10,
        }}>
          {article.date} · {article.read} min read
        </div>
        <h3 style={{
          margin: 0, fontSize: 18, fontWeight: 600, lineHeight: 1.3,
          color: hover ? '#06B6D4' : '#0F172A',
          transition: 'color 160ms var(--yb-ease)',
        }}>{article.title}</h3>
        <p style={{
          margin: '10px 0 0', fontSize: 14, lineHeight: 1.55, color: '#64748B',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{article.description}</p>
      </div>
    </article>
  );
};

const FilterPills = ({ tags, active, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tags.map(t => {
        const on = active === t;
        return (
          <button key={t} onClick={() => onChange(t)} style={{
            fontFamily: 'var(--yb-font-mono)', fontSize: 12, padding: '6px 14px',
            borderRadius: 999, border: '1px solid',
            background: on ? '#ECFEFF' : '#FFFFFF',
            borderColor: on ? '#06B6D4' : '#E2E8F0',
            color: on ? '#0E7490' : '#0F172A',
            cursor: 'pointer', letterSpacing: '0.02em',
            transition: 'all 160ms var(--yb-ease)',
          }}>{t}</button>
        );
      })}
    </div>
  );
};

const SearchBar = ({ value, onChange }) => (
  <div style={{ position: 'relative', maxWidth: 420 }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"
      style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search logbook…"
      style={{
        width: '100%', boxSizing: 'border-box',
        fontFamily: 'var(--yb-font-sans)', fontSize: 14,
        padding: '11px 14px 11px 40px',
        border: '1px solid #E2E8F0', borderRadius: 10, background: '#fff',
        color: '#0F172A', outline: 'none',
        transition: 'border-color 160ms, box-shadow 160ms',
      }}
      onFocus={e => {
        e.target.style.borderColor = '#06B6D4';
        e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)';
      }}
      onBlur={e => {
        e.target.style.borderColor = '#E2E8F0';
        e.target.style.boxShadow = 'none';
      }}
    />
  </div>
);

window.ArticleCard = ArticleCard;
window.FilterPills = FilterPills;
window.SearchBar = SearchBar;
