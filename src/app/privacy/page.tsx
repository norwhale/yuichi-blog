import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "yuichi.blog のプライバシーポリシー",
  alternates: {
    canonical: "https://yuichi.blog/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Privacy Policy</h1>

      <div className="prose">
        <p>Last updated: March 31, 2026</p>

        <h2>Google Analytics</h2>
        <p>
          当サイトでは、アクセス解析のためにGoogle Analytics 4（GA4）を使用しています。
          GA4はCookieを使用してトラフィックデータを収集しますが、個人を特定する情報は含まれません。
          データの収集はGoogleのプライバシーポリシーに基づいて行われます。
          詳細は{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Googleプライバシーポリシー
          </a>をご覧ください。
        </p>
        <p>
          This site uses Google Analytics 4 (GA4) for traffic analysis.
          GA4 uses cookies to collect anonymized traffic data.
          For details, see the{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>.
        </p>

        <h2>Google AdSense</h2>
        <p>
          This website uses Google AdSense, a web advertising service provided by Google LLC.
          Google AdSense uses cookies to serve ads based on your prior visits to this website
          or other websites. You may opt out of personalized advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>.
        </p>

        <h2>Cookies</h2>
        <p>
          This website may use cookies for analytics and advertising purposes.
          You can control cookie settings through your browser preferences.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          The GeoIntel Dashboard embedded on this site connects to external APIs
          (X API, NewsAPI, etc.) for real-time data. These services have their own
          privacy policies.
        </p>

        <h2>Contact</h2>
        <p>
          If you have any questions about this privacy policy, please contact us
          through the information provided on the <a href="/about">About page</a>.
        </p>
      </div>
    </div>
  );
}
