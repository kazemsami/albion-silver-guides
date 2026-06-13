import { ImageResponse } from "next/og";
import { siteName, siteDescription } from "@/lib/site";

export const ogImageAlt = `${siteName}, Albion Online money making guides`;
export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(ellipse at top, #1c1710 0%, #0b0906 60%)",
          color: "#e8dcc0",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#c9a227",
          }}
        >
          Albion Online · Fan Guides
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            color: "#f3ead2",
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 34,
            lineHeight: 1.35,
            maxWidth: 900,
            color: "#b9ad90",
          }}
        >
          {siteDescription}
        </div>
        <div
          style={{
            marginTop: 48,
            height: 6,
            width: 180,
            background: "#c9a227",
            borderRadius: 3,
          }}
        />
      </div>
    ),
    { ...ogImageSize },
  );
}
