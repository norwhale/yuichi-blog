import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

export const alt = "Blog post on yuichi.blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title || "yuichi.blog";
  const date = post
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  const tags = post?.tags?.slice(0, 3) || [];

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Top: Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "white",
              fontWeight: 800,
            }}
          >
            Y
          </div>
          <span style={{ fontSize: "22px", color: "#94a3b8", fontWeight: 500 }}>
            yuichi.blog
          </span>
        </div>

        {/* Center: Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: title.length > 40 ? "42px" : "52px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom: Date & Tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "20px", color: "#64748b" }}>{date}</span>
          <div style={{ display: "flex", gap: "8px" }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "16px",
                  color: "#93c5fd",
                  background: "rgba(59,130,246,0.15)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
