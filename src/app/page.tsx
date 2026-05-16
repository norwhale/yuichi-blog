import { getAllPosts } from "@/lib/posts";
import AdBanner from "@/components/AdBanner";
import ReadMoreToggle from "@/components/ReadMoreToggle";
import SearchableLogbook from "@/components/SearchableLogbook";
import VideoBackground from "@/components/VideoBackground";
import BgmPlayer from "@/components/BgmPlayer";
import MouseReveal from "@/components/MouseReveal";
import SamanthaLite from "@/components/SamanthaLite";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const allPosts = getAllPosts();
  const pinnedPost = allPosts.find((p) => p.pinned);
  const posts = allPosts.filter((p) => !p.pinned);

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://yuichi.blog/#website",
        url: "https://yuichi.blog",
        name: "yuichi.blog",
        description:
          "A personal blog by Yuichi — a 33-year-old former IT engineer from Tokyo, now studying medicine at a medical university in Bulgaria. Writing about AI, medicine, life abroad, brain-computer interfaces, and the intersection of technology and healthcare.",
        publisher: { "@id": "https://yuichi.blog/#author" },
        inLanguage: ["ja", "en"],
      },
      {
        "@type": "Person",
        "@id": "https://yuichi.blog/#author",
        name: "Yuichi",
        url: "https://yuichi.blog/about",
        sameAs: ["https://x.com/Yu_Hyakuya123"],
        jobTitle: "Medical Student & Former IT Engineer",
        description:
          "33-year-old former IT engineer from Tokyo, currently studying medicine in Bulgaria. Passionate about brain-computer interfaces, AI in healthcare, and bridging technology with clinical practice.",
        knowsAbout: [
          "Medicine",
          "Brain-Computer Interfaces",
          "Artificial Intelligence",
          "Software Engineering",
          "OSINT",
          "Geopolitics",
        ],
      },
      {
        "@type": "Blog",
        "@id": "https://yuichi.blog/#blog",
        url: "https://yuichi.blog",
        name: "yuichi.blog — Reverse Engineering The Human Body",
        author: { "@id": "https://yuichi.blog/#author" },
        publisher: { "@id": "https://yuichi.blog/#author" },
        datePublished: "2026-03-25",
        dateModified: new Date().toISOString().split("T")[0],
        blogPost: allPosts.slice(0, 10).map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: `https://yuichi.blog/blog/${post.slug}`,
          datePublished: post.date,
          author: { "@id": "https://yuichi.blog/#author" },
        })),
      },
    ],
  };

  return (
    <>
      {/* Fixed video background — lazy-loaded after paint, SEO-safe */}
      <VideoBackground />

      {/* Gentle mouse-follow spotlight — desktop only, disabled on touch */}
      <MouseReveal />

      {/* Fixed BGM player — bottom-right corner */}
      <BgmPlayer />

      {/* Samantha Lite — article navigator chatbot */}
      <SamanthaLite
        posts={allPosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          tags: p.tags,
        }))}
      />

      <div className="relative z-10 pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* ═══ About the Author (SSR — visible to ALL crawlers) ═══ */}
      <section className="mb-16 p-8 rounded-2xl bg-card/85 backdrop-blur-xl border border-white/10 shadow-2xl" itemScope itemType="https://schema.org/Person">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
              yuichi.blog
            </h1>
            <p className="text-muted text-sm mb-6">
              By <strong className="text-foreground" itemProp="name">Yuichi</strong> — <span itemProp="jobTitle">Medical Student &amp; Former IT Engineer</span>
            </p>

            <h2 className="text-xl font-bold text-foreground mb-3">About This Blog</h2>
            <p className="text-muted leading-relaxed mb-4" itemProp="description">
              Welcome to yuichi.blog — a personal knowledge base documenting the unconventional career transition from Tokyo&apos;s IT industry to a{" "}
              <a href="https://mu-pleven.bg/en/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent-dark">medical university in Bulgaria</a>.
              At 33, after years of building cloud infrastructure, web applications, and enterprise systems, I left everything behind to pursue medicine.
            </p>
            <ReadMoreToggle>
              <p className="text-muted leading-relaxed mb-4">
                This blog explores the collision between software engineering and biomedical science.
                Topics range from studying chemistry and anatomy with{" "}
                <a href="https://www.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent-dark">AI tools like Claude</a>
                , to conducting{" "}
                <a href="https://bcisociety.org/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent-dark">brain-computer interface (BCI)</a>{" "}
                experiments with EEG headsets, analyzing modern warfare through{" "}
                <a href="https://en.wikipedia.org/wiki/Open-source_intelligence" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent-dark">OSINT</a>{" "}
                methodologies, and navigating the psychological challenges of starting over in a foreign country at 33.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                Every article is grounded in firsthand experience — real monthly expense breakdowns for international students,
                honest reflections on depression and social anxiety abroad, strategies for learning English through gaming
                on Final Fantasy XIV&apos;s North American server, and technical deep-dives into AI systems used in the 2026 Iran conflict.
                The blog is fully bilingual in Japanese and English, built with{" "}
                <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent-dark">Next.js</a>{" "}
                using vibe coding with Claude Code, and deployed on{" "}
                <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent-dark">Vercel</a>.
              </p>

              {/* Recent Articles List */}
              <h3 className="text-lg font-bold text-foreground mt-6 mb-3">Recent Articles</h3>
              <ul className="space-y-2 text-sm">
                {allPosts.slice(0, 8).map((post) => (
                  <li key={post.slug} className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <Link href={`/blog/${post.slug}`} className="text-muted hover:text-accent transition-colors">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </ReadMoreToggle>
          </div>

          {/* Key Topics Table + Stats */}
          <div className="w-full md:w-auto md:min-w-[300px]">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 font-mono">
              Key Topics
            </h3>
            <table className="w-full text-sm border-collapse mb-6">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b border-border text-muted font-mono text-xs">Category</th>
                  <th className="text-left p-2 border-b border-border text-muted font-mono text-xs">Focus Areas</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="p-2 text-foreground">Medicine</td>
                  <td className="p-2 text-muted">Pre-med studies, anatomy, biochemistry, clinical rotations</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 text-foreground">Artificial Intelligence</td>
                  <td className="p-2 text-muted">Claude, ChatGPT, AI warfare, machine learning</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 text-foreground">Brain-Computer Interfaces</td>
                  <td className="p-2 text-muted">EEG experiments, neural signal processing, BCI Society</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 text-foreground">Life Abroad</td>
                  <td className="p-2 text-muted">Bulgaria living costs, culture, safety, student life</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 text-foreground">Geopolitics &amp; OSINT</td>
                  <td className="p-2 text-muted">Open-source intelligence, conflict analysis, GeoIntel</td>
                </tr>
                <tr>
                  <td className="p-2 text-foreground">Personal Growth</td>
                  <td className="p-2 text-muted">Mental health, social anxiety, career transition at 33</td>
                </tr>
              </tbody>
            </table>

            {/* Blog Stats */}
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 font-mono">
              Blog Statistics
            </h3>
            <table className="w-full text-sm border-collapse mb-4">
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="p-2 text-muted">Total articles</td>
                  <td className="p-2 text-foreground font-bold text-right">{allPosts.length}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 text-muted">Languages</td>
                  <td className="p-2 text-foreground font-bold text-right">Japanese &amp; English</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 text-muted">Topic categories</td>
                  <td className="p-2 text-foreground font-bold text-right">6</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 text-muted">Published since</td>
                  <td className="p-2 text-foreground font-bold text-right">March 2026</td>
                </tr>
                <tr>
                  <td className="p-2 text-muted">Author location</td>
                  <td className="p-2 text-foreground font-bold text-right">Bulgaria</td>
                </tr>
              </tbody>
            </table>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Follow on <a href="https://x.com/Yu_Hyakuya123" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">X (Twitter)</a>
              </li>
              <li className="flex items-center gap-2 text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <Link href="/contact" className="text-accent hover:underline">Contact / お問い合わせ</Link>
              </li>
              <li className="flex items-center gap-2 text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <Link href="/medmentor" className="text-accent hover:underline">MedMentor AI Tutor</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ Hero Section (SSR) ═══ */}
      <header className="relative mb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 lg:py-20 border-b border-border/20">
        <div className="lg:col-span-7 space-y-6 relative z-10">
          <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-accent mb-4">
            <span>System Reboot // v2.0</span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Reverse Engineering{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-dark to-accent">
              The Human Body.
            </span>
          </h2>

          <p className="text-lg lg:text-xl text-muted max-w-2xl leading-relaxed font-light">
            Documenting the architectural transition from building scalable cloud infrastructure in Tokyo to studying complex biological systems in Central Europe.
          </p>

          {pinnedPost && (
            <div className="border-l-2 border-accent pl-4 mt-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent mb-1">
                <span>&#9733; Pinned</span>
              </div>
              <Link href={`/blog/${pinnedPost.slug}`} className="group/pin">
                <h3 className="text-base font-bold text-foreground group-hover/pin:text-accent transition-colors leading-snug">
                  {pinnedPost.title}
                </h3>
                <p className="text-sm text-muted mt-1 line-clamp-1">{pinnedPost.description}</p>
              </Link>
            </div>
          )}

          <div className="pt-6 flex gap-4">
            {pinnedPost && (
              <Link href={`/blog/${pinnedPost.slug}`} className="px-6 py-3 bg-foreground text-background font-medium hover:bg-accent-dark transition-colors inline-flex items-center gap-2">
                Read Pinned Essay →
              </Link>
            )}
            <Link href="/about" className="px-6 py-3 bg-card border border-border text-foreground font-medium hover:border-accent transition-colors inline-flex items-center gap-2">
              About Me
            </Link>
          </div>
        </div>

        {pinnedPost?.image && (
          <div className="lg:col-span-5 relative h-[300px] lg:h-[460px] w-full">
            <div className="absolute inset-4 border border-border bg-[#0F172A] shadow-rigid z-10 overflow-hidden flex items-center justify-center">
              <Image
                src={pinnedPost.image}
                alt={`${pinnedPost.title} — ${pinnedPost.description}`}
                fill
                className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-700"
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="absolute bottom-6 -left-4 z-20 bg-card border border-border p-3 shadow-lg flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="font-mono text-xs">
                <span className="text-muted">Status:</span>{" "}
                <span className="font-bold text-foreground">Pre-Med Year 1</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <AdBanner />

      {/* ═══ Logbook with Search ═══ */}
      <SearchableLogbook posts={posts} totalCount={allPosts.length} />
      </div>
    </>
  );
}
