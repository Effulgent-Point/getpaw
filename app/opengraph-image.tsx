import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "paw, Personal Agent Workforce";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social card, so links to getpaw.dev unfurl sharp. Optical Bench:
// paper ground, ink type, the viridis dispersion as the signature bar.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f5f7f6",
        color: "#191d1b",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 26,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#5e6a66",
        }}
      >
        <div
          style={{
            width: 54,
            height: 8,
            background:
              "linear-gradient(90deg,#440154,#3b528b,#21908c,#5dc863,#fde725)",
          }}
        />
        Personal Agent Workforce
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 168,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          paw
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            marginTop: 18,
            maxWidth: 900,
          }}
        >
          Your agent writes code fast. paw makes it write code right.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: 26,
          color: "#5e6a66",
        }}
      >
        <div style={{ display: "flex", gap: 28 }}>
          <span>54 agents</span>
          <span>22 rules</span>
          <span>hard-stop hooks</span>
          <span>a CLI</span>
        </div>
        <div style={{ fontWeight: 700, color: "#191d1b" }}>getpaw.dev</div>
      </div>
    </div>,
    { ...size },
  );
}
