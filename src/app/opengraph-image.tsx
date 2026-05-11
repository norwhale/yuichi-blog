// Static OGP image - using custom image at /public/images/ogp-default.jpeg
// Next.js will serve this as the default opengraph-image for the site root

import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt = "yuichi.blog - A winding path through misty green hills";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function OgImage() {
  const imagePath = path.join(process.cwd(), "public/images/ogp-default.jpeg");
  const imageData = fs.readFileSync(imagePath);
  const base64 = imageData.toString("base64");
  const dataUrl = `data:image/jpeg;base64,${base64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        <img
          src={dataUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
