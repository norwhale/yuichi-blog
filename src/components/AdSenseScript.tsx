"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ADSENSE_CLIENT_ID = "ca-pub-3961327875886787";
const ADSENSE_SCRIPT_ID = "adsense-auto-ads";

/**
 * AdSense script loader - excluded on /dashboard (iframe page)
 * to comply with AdSense Program policies regarding framed content.
 */
export default function AdSenseScript() {
  const pathname = usePathname();
  const shouldLoadAds = pathname !== "/dashboard" && pathname !== "/lab/synex";

  useEffect(() => {
    if (!shouldLoadAds || document.getElementById(ADSENSE_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    document.head.appendChild(script);
  }, [shouldLoadAds]);

  return null;
}
