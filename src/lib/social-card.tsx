export const SOCIAL_CARD_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const SOCIAL_CARD_ALT =
  "Rella Aesthetics — physician-owned aesthetic and wellness care in Vacaville and Napa";

export const DEFAULT_SOCIAL_IMAGE = {
  url: "/opengraph-image",
  width: SOCIAL_CARD_SIZE.width,
  height: SOCIAL_CARD_SIZE.height,
  alt: SOCIAL_CARD_ALT,
  type: "image/png",
} as const;

export function RellaSocialCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #ffffff 0%, #fdf7f5 52%, #f6d8d3 100%)",
        color: "#2b2b2b",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -110,
          top: -150,
          width: 500,
          height: 500,
          borderRadius: 999,
          border: "2px solid rgba(255,255,255,0.8)",
          background: "rgba(255,255,255,0.22)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 22,
          height: "100%",
          background: "#ef9288",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          padding: "72px 86px 64px 94px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 42, fontWeight: 300, letterSpacing: 7 }}>rella</div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 6, color: "#70757a" }}>
              AESTHETICS
            </div>
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid rgba(43,43,43,0.18)",
              borderRadius: 999,
              padding: "14px 22px",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 2.5,
              color: "#5a5e62",
            }}
          >
            PHYSICIAN-OWNED
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 930 }}>
          <div style={{ fontSize: 70, fontWeight: 500, lineHeight: 1.03, letterSpacing: -3.4 }}>
            Aesthetic care with a clear plan.
          </div>
          <div style={{ marginTop: 26, fontSize: 25, fontWeight: 300, lineHeight: 1.45, color: "#5a5e62" }}>
            Aesthetics · skin health · wellness · medical weight management
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 19, color: "#5a5e62" }}>
          <span>Vacaville</span>
          <span style={{ color: "#ef9288" }}>●</span>
          <span>Napa</span>
          <span style={{ marginLeft: "auto", fontWeight: 700, color: "#2b2b2b" }}>
            experiencerella.com
          </span>
        </div>
      </div>
    </div>
  );
}
