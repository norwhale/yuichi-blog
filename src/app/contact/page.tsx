import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "yuichi.blog へのお問い合わせ・ご連絡はこちらから。Contact Yuichi for inquiries, feedback, or collaboration.",
  alternates: {
    canonical: "https://yuichi.blog/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Contact</h1>

      <div className="prose mb-10">
        <p>
          当ブログをご覧いただきありがとうございます。
          記事の内容に関するご質問、お仕事のご依頼などは、以下のフォームよりお気軽にお問い合わせください。
          内容を確認次第、通常48時間以内にご返信いたします。
        </p>
        <p>
          Thank you for visiting yuichi.blog.
          For questions about articles, collaboration opportunities, or general inquiries,
          please use the form below. I typically respond within 48 hours.
        </p>
      </div>

      {/* Contact Form */}
      <form
        action="https://formsubmit.co/uni.itcircle20555@gmail.com"
        method="POST"
        className="space-y-6"
      >
        {/* Honeypot anti-spam */}
        <input type="text" name="_honey" style={{ display: "none" }} />
        {/* Disable CAPTCHA page */}
        <input type="hidden" name="_captcha" value="false" />
        {/* Redirect after submission */}
        <input type="hidden" name="_next" value="https://yuichi.blog/contact/thanks" />
        {/* Subject prefix */}
        <input type="hidden" name="_subject" value="yuichi.blog - New Contact Form Submission" />

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            お名前 / Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
            placeholder="Yuichi"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            メールアドレス / Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            件名 / Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
            placeholder="Subject of your inquiry"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            お問い合わせ内容 / Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors resize-vertical"
            placeholder="Your message here..."
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-opacity"
        >
          送信する / Send Message
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-border">
        <div className="prose">
          <h2>Direct Email</h2>
          <p>
            フォームをご利用いただけない場合は、直接メールでもご連絡いただけます。
            <br />
            <a href="mailto:uni.itcircle20555@gmail.com">uni.itcircle20555@gmail.com</a>
          </p>
        </div>
      </div>

      {/* SNS */}
      <div className="mt-10 pt-8 border-t border-border">
        <div className="prose mb-4">
          <h2>Follow Me</h2>
          <p>
            ブログの更新情報や日常のつぶやきはX（Twitter）で発信しています。よろしければフォローお願いします！
            <br />
            I also share blog updates and daily thoughts on X (Twitter). Feel free to follow!
          </p>
        </div>
        <a
          href="https://x.com/Yu_Hyakuya123"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background font-medium hover:bg-accent transition-colors"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>@Yu_Hyakuya123</span>
        </a>
      </div>
    </div>
  );
}
