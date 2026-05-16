import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "yuichi.blog の利用規約・免責事項。Terms of Service and disclaimer for yuichi.blog.",
  alternates: {
    canonical: "https://yuichi.blog/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">Terms of Service</h1>

      <div className="prose">
        <p>Last updated: April 4, 2026</p>

        <h2>1. Acceptance of Terms / 利用規約の承諾</h2>
        <p>
          By accessing and using yuichi.blog, you agree to be bound by these Terms of Service.
          If you do not agree, please discontinue use of this website.
        </p>
        <p>
          yuichi.blog にアクセスし利用することで、本利用規約に同意したものとみなされます。
          同意いただけない場合は、本ウェブサイトの利用をお控えください。
        </p>

        <h2>2. Content and Copyright / コンテンツと著作権</h2>
        <p>
          All content on this website, including text, images, and code snippets,
          is the intellectual property of Yuichi unless otherwise stated.
          You may share links to articles, but reproduction of full content
          without permission is prohibited.
        </p>
        <p>
          本ウェブサイト上のテキスト、画像、コードを含むすべてのコンテンツは、
          特に記載がない限り Yuichi の知的財産です。記事へのリンク共有は歓迎しますが、
          コンテンツの無断転載は禁止します。
        </p>

        <h2>3. Disclaimer / 免責事項</h2>
        <p>
          The information provided on this blog is for general informational purposes only.
          While I strive for accuracy, I make no guarantees about the completeness,
          reliability, or suitability of the information. Any reliance you place on
          such information is strictly at your own risk.
        </p>
        <p>
          本ブログで提供する情報は一般的な情報提供を目的としたものです。
          正確性に努めていますが、情報の完全性、信頼性、適合性について保証するものではありません。
          情報の利用は自己責任でお願いいたします。
        </p>

        <h2>4. Affiliate Links / アフィリエイトリンク</h2>
        <p>
          Some articles on this blog may contain affiliate links.
          When you make a purchase through these links, I may earn a small commission
          at no additional cost to you. I only recommend products and services
          that I genuinely use and believe in.
        </p>
        <p>
          本ブログの一部の記事にはアフィリエイトリンクが含まれる場合があります。
          これらのリンクを通じて購入された場合、追加費用なしで少額の紹介料を
          いただくことがあります。実際に使用し、信頼できる製品・サービスのみを紹介しています。
        </p>

        <h2>5. External Links / 外部リンク</h2>
        <p>
          This website may contain links to external sites. I am not responsible
          for the content, privacy policies, or practices of third-party websites.
        </p>
        <p>
          本ウェブサイトには外部サイトへのリンクが含まれる場合があります。
          外部サイトのコンテンツ、プライバシーポリシー、慣行について責任を負いません。
        </p>

        <h2>6. Advertising / 広告について</h2>
        <p>
          This website uses Google AdSense to display advertisements.
          These ads are served by third parties and may use cookies to
          personalize content. For more details, see our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
        <p>
          本ウェブサイトでは Google AdSense を使用して広告を表示しています。
          これらの広告は第三者によって配信され、コンテンツのパーソナライズに
          Cookie を使用する場合があります。詳細は{" "}
          <a href="/privacy">プライバシーポリシー</a> をご確認ください。
        </p>

        <h2>7. Medical Disclaimer / 医療に関する免責事項</h2>
        <p>
          The content published on yuichi.blog represents the author&apos;s personal
          experiences as a medical student, daily study notes, and personal perspectives
          on technology. <strong>It does not constitute professional medical advice,
          diagnosis, or treatment.</strong>
        </p>
        <p>
          当ブログ（yuichi.blog）に掲載されているコンテンツや情報は、
          筆者個人の医学部留学に関する体験談、日々の学習記録、
          およびテクノロジーに関する個人的な考察を共有するものであり、
          <strong>専門的な医学的アドバイス、診断、または治療を提供するものではありません。</strong>
        </p>
        <p>
          If you have specific health concerns or symptoms, please consult
          a qualified healthcare professional. This website assumes no liability
          for any actions taken or damages incurred based on the information provided here.
        </p>
        <p>
          健康や医療に関する具体的な不安や症状がある場合は、
          必ず適切な医療機関や専門医にご相談ください。
          当ブログの情報を用いて行う一切の行為、被った損害・損失に対して、
          当サイトは一切の責任を負いかねます。あらかじめご了承ください。
        </p>

        <h2>8. Changes to Terms / 規約の変更</h2>
        <p>
          I reserve the right to update these terms at any time.
          Continued use of the website constitutes acceptance of the updated terms.
        </p>
        <p>
          本規約はいつでも更新される場合があります。
          ウェブサイトの継続的な利用は、更新された規約への同意を意味します。
        </p>

        <h2>9. Contact / お問い合わせ</h2>
        <p>
          If you have questions about these terms, please visit the{" "}
          <a href="/contact">Contact page</a>.
        </p>
        <p>
          本規約に関するご質問は、<a href="/contact">お問い合わせページ</a>{" "}
          よりご連絡ください。
        </p>
      </div>
    </div>
  );
}
