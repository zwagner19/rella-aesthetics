export const SOCIAL_CARD_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const SOCIAL_CARD_ALT =
  "Rella Aesthetics — personalized aesthetic and wellness care in Vacaville and Napa";

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
        background: "#ffffff",
        color: "#1a1a1a",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 28,
          height: "100%",
          background: "#f7a19a",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          padding: "68px 82px 60px 76px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 400, letterSpacing: 6 }}>
              rella
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 6,
                color: "#83888d",
              }}
            >
              AESTHETICS
            </div>
          </div>
          <div
            style={{
              display: "flex",
              borderBottom: "3px solid #f7a19a",
              padding: "10px 0",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            VACAVILLE + NAPA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 930 }}>
          <div
            style={{
              display: "flex",
              fontSize: 67,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: 5,
            }}
          >
            AGELESS BEAUTY
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 25,
              fontWeight: 400,
              lineHeight: 1.45,
              color: "rgba(26, 26, 26, 0.72)",
            }}
          >
            Personalized aesthetic and wellness care, designed around your goals.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 19,
            color: "rgba(26, 26, 26, 0.72)",
          }}
        >
          <div style={{ display: "flex" }}>
            AESTHETICS · SKIN · WELLNESS · WEIGHT MANAGEMENT
          </div>
          <div
            style={{ display: "flex", marginLeft: "auto", fontWeight: 700, color: "#1a1a1a" }}
          >
            experiencerella.com
          </div>
        </div>
      </div>
    </div>
  );
}
