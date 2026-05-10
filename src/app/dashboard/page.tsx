import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GeoIntel Dashboard",
  description: "Real-time geopolitical intelligence dashboard with OSINT, market data, and satellite monitoring.",
  alternates: {
    canonical: "https://yuichi.blog/dashboard",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://geointel.yuichi.org/";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Dashboard Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">GeoIntel Dashboard</h1>
          <p className="text-xs text-muted">Real-time geopolitical intelligence monitoring</p>
        </div>
        <a
          href={dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity"
        >
          Open in new tab &rarr;
        </a>
      </div>

      {/* Iframe */}
      <iframe
        src={dashboardUrl}
        className="flex-1 w-full border-0"
        title="GeoIntel Dashboard"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        loading="lazy"
      />
    </div>
  );
}
