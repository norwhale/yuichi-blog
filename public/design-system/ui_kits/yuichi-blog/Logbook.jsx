// Logbook.jsx — homepage below the hero: filter + grid of cards
const Logbook = ({ articles, onOpen }) => {
  const [q, setQ] = React.useState('');
  const [tag, setTag] = React.useState('All');
  const tags = ['All', 'AI', 'BCI', 'Medicine', 'Vibe Coding', 'Life Abroad'];

  const filtered = articles.filter(a => {
    const matchQ = !q || (a.title + ' ' + a.description).toLowerCase().includes(q.toLowerCase());
    const matchT = tag === 'All' || a.tag === tag;
    return matchQ && matchT;
  });

  return (
    <section id="logbook" style={{
      background: '#F8FAFC', paddingTop: 88, paddingBottom: 120,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="yb-eyebrow" style={{
              fontFamily: 'var(--yb-font-mono)', fontSize: 12, letterSpacing: '0.25em',
              textTransform: 'uppercase', color: '#64748B', marginBottom: 12,
            }}>
              <span style={{ color: '#06B6D4', marginRight: 10 }}>[01]</span>Logbook
            </div>
            <h2 style={{
              margin: 0, fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 700,
              letterSpacing: '-0.02em', color: '#0F172A',
            }}>Recent entries.</h2>
          </div>
          <SearchBar value={q} onChange={setQ} />
        </div>
        <div style={{ margin: '28px 0 40px' }}>
          <FilterPills tags={tags} active={tag} onChange={setTag} />
        </div>
        <div style={{
          display: 'grid', gap: 24,
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        }}>
          {filtered.map(a => <ArticleCard key={a.slug} article={a} onOpen={onOpen} />)}
        </div>
        {filtered.length === 0 && (
          <div style={{
            padding: 60, textAlign: 'center', color: '#64748B',
            fontFamily: 'var(--yb-font-mono)', fontSize: 13, letterSpacing: '0.05em',
          }}>No entries match that filter.</div>
        )}
      </div>
    </section>
  );
};

window.Logbook = Logbook;
