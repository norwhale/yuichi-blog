import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You",
  description: "お問い合わせありがとうございます。Thank you for your message.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThanksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20 text-center">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">
        Thank You!
      </h1>

      <div className="prose mx-auto mb-10">
        <p>
          お問い合わせいただきありがとうございます。
          内容を確認次第、通常48時間以内にご返信いたします。
        </p>
        <p>
          Thank you for reaching out.
          I will review your message and typically respond within 48 hours.
        </p>
      </div>

      <Link
        href="/"
        className="inline-block px-8 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}
