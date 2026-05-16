import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "yuichi.blogについて — 元ITエンジニア・33歳でブルガリア医学部留学を決意したYuichiのプロフィール。About Yuichi: from IT engineer to medical student in Bulgaria.",
  alternates: {
    canonical: "https://yuichi.blog/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">About</h1>

      <div className="prose">
        <h2>Yuichi について / About Yuichi</h2>
        <p>
          はじめまして、<strong>Yuichi</strong>です。
          33歳、元ITエンジニア。現在はブルガリアの医科大学で医学を学んでいます。
        </p>
        <p>
          東京で電子カルテシステムの開発からキャリアをスタートし、
          サーバ・ネットワーク保守、外資系IT企業でのテクニカルサポートを経験。
          CCNA、TOEIC などの資格を取得し、IT業界で約10年間働きました。
        </p>
        <p>
          母の突然の死をきっかけに、「デジタルのコード」ではなく
          「人間の生命」に直接向き合う道を選び、
          ブルガリアの医科大学への留学を決意しました。
          詳しい経緯は <a href="/blog/why-i-chose-medicine">こちらの記事</a> に書いています。
        </p>

        <h2>経歴 / Background</h2>
        <ul>
          <li>情報システム学科 卒業（アルゴリズム設計、C#、データベース）</li>
          <li>電子カルテシステム開発（医療×ITのキャリア原点）</li>
          <li>サーバ・ネットワーク保守（CCNA取得）</li>
          <li>外資系IT企業 テクニカルサポート</li>
          <li>ブルガリア医科大学 在学中（英語課程）</li>
        </ul>

        <h2>スキル / Skills</h2>
        <ul>
          <li><strong>プログラミング:</strong> Python, JavaScript/TypeScript, C#, SQL</li>
          <li><strong>Web開発:</strong> Next.js, React, Node.js, Express</li>
          <li><strong>インフラ:</strong> Linux, ネットワーク (CCNA), サーバ運用</li>
          <li><strong>AI/データ分析:</strong> Claude API, OSINT, データ可視化</li>
          <li><strong>言語:</strong> 日本語（母語）、英語（実務レベル）</li>
        </ul>

        <h2>このブログについて / About This Blog</h2>
        <p>
          <strong>yuichi.blog</strong> は、以下のテーマで発信しています：
        </p>
        <ul>
          <li><strong>ブルガリア留学生活</strong> — 医学部での日常、異文化体験、生活情報</li>
          <li><strong>IT × 医学</strong> — BCI、AI医療、テクノロジーと医療の融合</li>
          <li><strong>バイブコーディング</strong> — AIと一緒にプログラミングする体験</li>
          <li><strong>キャリアチェンジ</strong> — 30代からの人生の方向転換</li>
        </ul>

        <h2>GeoIntel Dashboard</h2>
        <p>
          趣味で開発した地政学インテリジェンス・ダッシュボードです。
          OSINT（オープンソースインテリジェンス）、リアルタイムニュース分析、
          株式市場モニタリング、衛星データ可視化などを統合した Web アプリで、
          6つの外部APIと1,500行以上のサーバーサイドコードで構築しました。
        </p>
        <p>
          <a href="/dashboard">ダッシュボードを見る &rarr;</a>
        </p>

        <h2>Contact / お問い合わせ</h2>
        <p>
          ご質問、フィードバック、お仕事のご依頼は{" "}
          <a href="/contact">お問い合わせページ</a> からお気軽にどうぞ。
        </p>
      </div>
    </div>
  );
}
