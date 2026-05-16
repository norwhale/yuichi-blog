"use client";

import { useEffect, useRef } from "react";

type AdBannerProps = {
  className?: string;
  slot?: string;
};

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

/**
 * AdSense Auto Ads container.
 *
 * 現在は自動広告（Auto Ads）モードを使用しています。
 * Google が最適な位置・サイズの広告を自動配信します。
 *
 * 個別の広告ユニットを使いたい場合は、AdSense管理画面で
 * 広告ユニットを作成し、data-ad-slot に数値IDを設定してください。
 * 例: data-ad-slot="1234567890"
 */
export default function AdBanner({ className = "", slot }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={`ad-container my-6 text-center ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3961327875886787"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
