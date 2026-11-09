import { ImageResponse } from "next/og";

export const alt = "Boxuezhe — every new comment can only rebut the one above it";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 封面图只用拉丁字形：satori 对中文子集字体不稳定，中文字号信息由 og:title 承载
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #12141a 0%, #1d222c 55%, #2a1f1d 100%)",
          padding: "72px",
          color: "#f5f2ec",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: "#e2593f" }} />
          <div style={{ width: 56, height: 2, background: "#4a4f5c" }} />
          <div style={{ width: 20, height: 20, borderRadius: 10, border: "3px solid #e2593f" }} />
          <div style={{ width: 56, height: 2, background: "#4a4f5c" }} />
          <div style={{ width: 20, height: 20, borderRadius: 10, background: "#6b7280" }} />
          <div style={{ width: 56, height: 2, background: "#4a4f5c" }} />
          <div style={{ width: 20, height: 20, borderRadius: 10, border: "3px solid #6b7280" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ fontSize: 124, fontWeight: 700 }}>Boxuezhe</div>
          <div style={{ fontSize: 40, color: "#c9c4ba" }}>
            Every new comment can only rebut the one above it.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 30,
            color: "#8b8f99",
          }}
        >
          <div>boxuezhe.cc</div>
          <div>ONE CHAIN · NO SIDE BRANCHES</div>
        </div>
      </div>
    ),
    size
  );
}
