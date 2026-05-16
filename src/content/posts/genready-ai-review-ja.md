---
title: "AIに読みやすいブログにしようとして、逆に見えなくした話 — GenReady.aiレビュー"
description: "ChatGPTやPerplexityに自分のブログは読まれているのか？ GenReady.aiで診断しながらClaude Codeと改善作業していたら、スコアがむしろ 87 → 61 に急落した。その一晩の物語と、AIクローラー・Next.js Client Components・継続的なGEOモニタリングについての学び。"
date: "2026-04-24"
tags: ["GenReady", "SEO", "GEO", "Next.js", "Vibe Coding", "AI", "ブログ", "レビュー"]
image: "/images/hero-genready-silent-pages.jpeg"
---

## AIに読みやすいブログにしようとして、逆に見えなくした話

スコア **87 → 61**。Crawlability **100 → 35**。

「AIにもっと読まれるブログにしよう」と頑張って修正した結果が、これだった。

---

## きっかけ

LinkedIn で Kristiyan Lukanov さんというブルガリアの開発者からメッセージが来たのは、4月の初めだった。彼は **GenReady.ai** という、ウェブサイトが "AI にどれくらい読まれているか" を診断するツールを作っている。僕が Next.js で自作しているこのブログを見て、「よかったら使って感想を聞かせてほしい」と声をかけてくれた。

僕は二つ返事で引き受けた。

最初の診断結果は悪くなかった。

- **総合: 87**
- **Content: 72**
- **Crawlability: 100** ← AI クローラーにはちゃんと見えてる

合格点ではあるけど、Content 72 は改善の余地がある。「せっかくなら上に持っていこう」と思い、その日の夜、**Claude Code と一緒にブログの改善作業を始めた**。

ここから、長い夜が始まる。

## GenReady.ai とは何か

そもそも GenReady.ai は何を見ているのか、先に書いておく。

従来の SEO ツール（Ahrefs とか SEMrush）は、Google 検索結果での「順位」を測る。何位に表示されるか、誰がリンクしてくれているか、というやつだ。

GenReady は同じ Google を見ているにしても、視点が違う。

ChatGPT / Claude / Perplexity / Google AI（Gemini）のような **生成型エンジンがあなたのサイトを理解して引用してくれるか** を測る。順位ではなく「引用されるか」。いわゆる GEO (Generative Engine Optimization) 領域のツール。

URL を入れて「Analyze」を押すと、2つの軸でスコアが出る：

- **Content Analysis** — 文章が AI にとって理解しやすい構造か
- **Crawlability Analysis** — AI クローラーがそもそもコンテンツを読めるか

それぞれに "Fix Checklist" という具体的な改善項目リストがつく。この Fix Checklist が、あとで物語のキーアイテムになる。

## 最初の改善作業：Claude Code と一緒に

Claude Code の画面に GenReady のレポート URL を貼り付けて、こう伝えた：

> 「レポートの内容を読み込みました。レポートのページはJavaScriptでレンダリングされています。レポートの内容をスクリーンショットで送っているので、テキストをコピペしていたのですが、指摘内容に基づきブログを改善します！」

Claude Code は Fix Checklist を見て、改善項目をひとつずつ対応していった：

| 項目 | 状態 | 対応 |
|---|---|---|
| Schema Markup | ❌ Missing | **JSON-LD 追加** |
| Tables and Lists | ❌ 0% | トップページにテーブル/リスト追加 |
| Content Repetition | ❌ 10% unique words | コンテンツ拡充で語彙多様化 |
| Content量 | ❌ 52 words | 500+ words に拡張 |
| External Citations | ❌ 0 links | 機械あるサイトへのリンク追加 |
| Author Info | ❌ Not found | 著者情報をページに追加 |

About セクションを追加、JSON-LD を埋め込み、トップページに統計テーブルを置き、外部リンクを追加し、記事内容を増やした。

**気持ちよかった**。GenReady が示す項目を Claude Code が淡々と潰していく感覚。これぞ vibe coding、という時間だった。

デプロイして、勇んで再診断した。

## そして、スコアは下がった

結果。

- **総合: 87 → 61**
- **Crawlability: 100 → 35** 🔴
- Content: 72 → 86 ← ここは上がった

そしてレポートの一番上に、あの赤い警告バナー：

> ⊘ **89%** of your content is invisible to AI crawlers.

![GenReady.aiダッシュボード。総合スコア56、89%のコンテンツがAIクローラーに見えていないという赤い警告バナー](/images/genready-dashboard-56.jpg)

なんで……？

Content は確かに上がった。指摘通り直したんだから当然だ。でも Crawlability は **100点からいきなり 35点に暴落**している。「ちゃんと見えてた」ものが「ほぼ見えなくなった」。

僕が改善したせいで、むしろ AI から見えなくなったのだ。

## 原因：Next.jsとClient Componentの罠

Claude Code に状況を伝えて、もう一度診断しなおしてもらった。

原因は、明確だった。

僕が追加した「About the Author」セクションや、JSON-LD を読み込むための Script タグ、そのほか新しく追加したコンポーネントの多くが、**クライアントサイドレンダリング**になっていた。Next.js 用語で言えば、`"use client"` ディレクティブがついているか、`Script(beforeInteractive)` のようにブラウザで実行される前提のものだった。

ここで起きていたのはこういうこと：

- **人間のブラウザ**で開く：JavaScript が実行されて、全文が見える ✅
- **Google 検索**： Googlebot は JavaScript をちゃんと実行する → 見える ✅
- **AI クローラー（GPTBot、ClaudeBot、PerplexityBot）**： JavaScript を実行しない → **新しく追加した内容が全部見えない** ❌

つまり、「About the Author」や統計テーブルなど、せっかく追加した「AI に優しい構造化データ」が、AI クローラーには **そもそも届いていなかった**。

Claude Code の診断コメントが鋭かった：

> 「最大の問題は、`Fast Crawlers`（GPTBot、ClaudeBot）に89%のコンテンツが見えないことです。原因は `Script(beforeInteractive)` や Client Component（`"use client"`）でくくられているトップページの About the Author セクションを含むクライアントレンダリングコンポーネントです。」

僕は Crawlability の基本を理解しないまま「AI に優しい施策」を足していて、その結果として**足した分だけ AI から見えなくなっていた**。

## 修正：Server ComponentとSSRへの書き直し

この時点で深夜になりかけていたが、Claude Code と一緒に再修正にかかった。

やったこと：

- `Script(beforeInteractive)` を使っていた JSON-LD を **Server Component で直接 HTML に埋め込む**ように変更
- About the Author セクションを **`"use client"` なしの Server Component 化**
- トップページのコンポーネント構成を整理して、**初期 HTML にコンテンツが含まれる**ように
- 静的生成 (Static Generation) を使える箇所は使うように再設計

実際のビフォー／アフターを抜粋すると、こんな感じだ。

**Before**：JSON-LD と About セクションを Client Component に閉じ込めていた版

```tsx
// app/page.tsx
"use client";  // ← これが致命傷

import Script from "next/script";

export default function HomePage() {
  return (
    <>
      <Script
        id="ld-json"
        type="application/ld+json"
        strategy="beforeInteractive"  // ← AI クローラーは実行してくれない
      >
        {JSON.stringify(personSchema)}
      </Script>
      <AboutTheAuthor />  {/* これも use client の中 */}
    </>
  );
}
```

**After**：Server Component で初期 HTML に直接埋め込む版

```tsx
// app/page.tsx (Server Component。"use client" を書かない)

export default function HomePage() {
  return (
    <>
      {/* JSON-LD は素の <script> として SSR される。
          AI クローラーが受け取る初期 HTML に含まれる */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {/* About セクションも Server Component。テキストは SSR 時に確定 */}
      <AboutTheAuthor />
    </>
  );
}
```

ポイントは、**「ファイルの先頭に `"use client"` を書かない」だけで、その JSX 全体が Server Component として扱われ、出力される HTML に最初からテキストが含まれる**こと。GPTBot が curl 相当でこの URL を叩いたとき、もう「空のページ」じゃなくなる。

Next.js の App Router を使っていると、**「とりあえずインタラクティブっぽいから `"use client"` を付けておく」** という誘惑がある。でも、AI クローラーは JavaScript を実行しないので、`"use client"` の中身は彼らから見えない。**人間には見える、Google には見える、でも AI クローラーだけ素通りする** ── こういう非対称が、コンポーネントを足すたびに知らずに広がっていく。

再デプロイして、もう一度診断。

- **Crawlability: 35 → 100** 🎉
- **総合: 61 → 96**

![GenReadyのScore Historyグラフ。4月9日にCrawlabilityが100→35→100とV字の谷を作って数時間で回復している](/images/genready-score-history-v.jpg)

Score History のグラフを見ると、Apr 9 のあいだに **100 → 35 → 100 とV字に谷を作っている**のが一目でわかる。その谷が、この夜の数時間だ。

## GenReady.aiが本当に便利だったポイント

ここからが、このツールを使ってみての正直な評価。

単に一回診断して「はい改善してね」で終わる SEO ツールはたくさんある。GenReady.ai が実際の作業で刺さったのは、**改善プロセスの伴走者として機能した**ところだった。

### ✅ 良かった点

1. **履歴グラフで"壊れた瞬間"が捕まる**
   今回みたいに、改善作業が逆効果になったとき、スコアの急落がグラフに残る。**変更と結果の因果がひと目でわかる**。定期モニタリングツールとしての価値がここにある。

2. **Fix Checklist が AI コーディング前提**
   各指摘項目が、**AI コーディングアシスタントにそのまま貼り付けられる形式**になっている。Claude Code や Cursor と組み合わせて vibe coding する前提で設計されている感じがする。

3. **AI クローラーを細かく区別してくれる**
   GPTBot / ClaudeBot / PerplexityBot / Googlebot それぞれで、何 words 見えるか数字で出してくれる。今回の「Fast Crawler にだけ見えない」問題が、これがなかったら気づけなかった。

4. **警告メッセージが強い**
   "89% of your content is invisible to AI crawlers." は、見た瞬間に手が動く温度感。優しすぎない UI、好きだ。

5. **シンプル**
   URL を入れるだけ。設定画面がない。迷う余地がない。

### 💭 気になった点・あると嬉しい機能

1. **「JS レンダリングの壁」サジェスト機能**
   今回みたいに Next.js / Nuxt / SvelteKit など SPA フレームワークを使っているサイトで Crawlability が大きく落ちたとき、UI 上で **「これは JavaScript レンダリングの壁に阻まれている可能性が高いです」** と一言ヒントが出てくれると、原因特定が一気に早くなる気がする。フレームワーク検出はすでにできているっぽいので、それを使ってあと一歩踏み込んだサジェストがあると、僕みたいに迷う初心者は助かる。

2. **日本語 UI がほしい**
   現状は英語のみ。AI 時代のブログ運営を意識する層は日本語圏にも確実にいる。翻訳があると紹介しやすい。

3. **スコアの計算根拠の透明度**
   「なぜこの項目でこの点数？」を深掘りしたくなる場面があった。もう一段深い breakdown があると、改善の優先順位が立てやすい。

4. **課金体系の明示**
   無料枠と有料枠の境目を最初から把握したい。複数サイトに継続運用したい人向けの情報が、もう少しわかりやすくあるといい。

## 初心者の方に伝えたいこと

もしあなたがブログを書いていて、Next.js や Nuxt、SvelteKit のようなモダンな JavaScript フレームワークを使っているなら、**一度 GenReady.ai で診断してみてほしい**。

「ブラウザで開いて記事が見えるんだから大丈夫」は、**AI クローラーについては通用しない**。

2026年のいま、**AI に読まれるか**は、**Google に読まれるか**と別の独立した変数になっている。これから数年のうちに、この視点を持っているかどうかで個人サイトの発見性が変わってくる、というのが僕の予想だ。

なぜそれが大事か、もう少しはっきり言葉にすると ── **これからの個人サイトのトラフィックの源泉は、Google 検索結果の青いリンクだけじゃなくなる**。ChatGPT や Perplexity が誰かの質問に答えるときに、**回答の中であなたの記事を引用 (cite) するかどうか**。AI からの引用とそこからの流入が、これからのブログの新しい "SEO 1位" になる可能性が高い。だから、AI に読まれる構造を持っているかどうかが、個人ブロガーにとっての勝ち筋の一つになる。これが GEO (Generative Engine Optimization) と呼ばれている領域の本質だと思う。

そして、自分のブログが AI から見えているかどうかは、**5分で測れる**。

## 最後に

僕は今回、一晩で **「AI に見える → 作業して見えなくした → 直した」** を体験した。教訓は、"構造化データや新しいセクションを足すなら、それが AI クローラーに届くレンダリング方式で出しているか確認する" に尽きる。

でもこの教訓を、一晩で学べたのは GenReady.ai があったからだ。ツールがなければ、「改善したつもりでむしろ悪化した」ことにしばらく気づかなかったかもしれない。

Kristiyan さん、声をかけてくれてありがとうございます。**このブログ、やっと AI にも読まれている**はずです。

---

**使ってみる**：[GenReady.ai](https://genready.ai)
**開発者**：Kristiyan Lukanov（[@HDRobots](https://x.com/HDRobots)）

_Written in Pleven, Bulgaria, the night my blog stopped talking to an empty room. 🦞_

---

### Further reading from this blog:

- [I Built an AI-Native Linux OS Inspired by 'Her' — Meet Samantha OS](/blog/samantha-os-ai-linux)
- [The Saturday I Tried to Rebuild iOS 26 Call Screening from Bulgaria](/blog/ios26-call-screening-bulgaria)
- [Vibe Coding — a Full Guide](/blog/vibe-coding-full-guide)
