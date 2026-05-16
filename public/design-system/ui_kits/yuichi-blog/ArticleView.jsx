// ArticleView.jsx — single article page (prose)
const ArticleView = ({ article, onBack }) => (
  <article style={{ background: '#F8FAFC', paddingTop: 96, minHeight: '100vh' }}>
    <div style={{ maxWidth: 768, margin: '0 auto', padding: '40px 24px 120px' }}>
      <button onClick={onBack} style={{
        background: 'none', border: 0, padding: 0, cursor: 'pointer',
        fontFamily: 'var(--yb-font-mono)', fontSize: 12, color: '#64748B',
        letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 28,
      }}>← Back to Logbook</button>
      <div style={{
        fontFamily: 'var(--yb-font-mono)', fontSize: 12, color: '#64748B',
        letterSpacing: '0.02em', marginBottom: 18,
      }}>
        {article.date} · {article.read} min read · {article.tag}
      </div>
      <h1 style={{
        margin: 0, fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800,
        letterSpacing: '-0.02em', lineHeight: 1.1, color: '#0F172A',
      }}>{article.title}</h1>
      <p style={{ marginTop: 18, fontSize: 20, color: '#64748B', lineHeight: 1.5 }}>
        {article.description}
      </p>
      {/* hero image — sharp rectangle */}
      <div style={{
        marginTop: 40, aspectRatio: '16/9',
        background: article.bg || 'linear-gradient(135deg,#0F172A,#1E3A8A)',
        position: 'relative', overflow: 'hidden', borderRadius: 0,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 45%),
            radial-gradient(circle at 75% 75%, rgba(6,182,212,0.35), transparent 55%)`,
        }} />
      </div>
      <div className="yb-prose" style={{
        marginTop: 48, fontSize: 18, lineHeight: 1.8, color: '#0F172A',
      }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 0 }}>
          {article.h2 || "Creating a 'Slightly Personal AI' with Vibe Coding"}
        </h2>
        <p>It was a weekend in Pleven, Bulgaria, and I had a bit of free time. Stepping away from anatomy and chemistry for a moment, I decided to try something.</p>
        <p>Could I build a personal AI like the one in the movie <em>Her</em>?</p>
        <p>I've been using ChatGPT and Claude for a while, but there was always this lingering feeling of <em>"borrowing someone else's tool."</em> What if I could create an AI that understood my context — my thoughts, my history — and lived inside my own environment?</p>
        <hr style={{ border: 0, borderTop: '1px solid #E2E8F0', margin: '40px 0' }} />
        <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 14 }}>How to Give It "Memory"</h3>
        <p>A plain chat tool wouldn't be very meaningful. What I really wanted was to get closer to an AI that <em>"understands a little bit about me."</em></p>
        <p>So I used <code className="yb-code">RAG</code> (Retrieval-Augmented Generation) to feed it my own blog posts. Content I've written over time — medical school experiences, life abroad, mental health reflections — I loaded all of this as data.</p>
        <p>When I asked a question, the AI would cross-reference these articles before answering. I tried it out, and instead of a generic response, I got answers that were <em>"tuned to my own context."</em></p>
      </div>
    </div>
  </article>
);

window.ArticleView = ArticleView;
