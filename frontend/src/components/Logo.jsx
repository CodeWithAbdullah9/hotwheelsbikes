export default function Logo({ size = "md" }) {
  const cfg = {
    sm: { box: 32, font1: 11, font2: 8 },
    md: { box: 40, font1: 14, font2: 9 },
    lg: { box: 52, font1: 18, font2: 11 },
  }[size] || { box: 40, font1: 14, font2: 9 };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Icon */}
      <div style={{
        width: cfg.box, height: cfg.box,
        background: "#111",
        border: "1.5px solid rgba(74,222,128,0.3)",
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <svg viewBox="0 0 40 40" width={cfg.box * 0.72} height={cfg.box * 0.72} fill="none">
          {/* Wheels */}
          <circle cx="10" cy="28" r="7" stroke="#4ade80" strokeWidth="2" fill="none"/>
          <circle cx="30" cy="28" r="7" stroke="#4ade80" strokeWidth="2" fill="none"/>
          {/* Frame */}
          <path d="M10 28 L18 14 L30 28" stroke="#4ade80" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
          <path d="M18 14 L24 28" stroke="#4ade80" strokeWidth="1.8" fill="none"/>
          <path d="M18 14 L30 18" stroke="#4ade80" strokeWidth="1.8" fill="none"/>
          {/* Seat */}
          <path d="M18 14 L16 9" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M14 9 L18 9" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Handlebar */}
          <path d="M30 18 L33 14 L36 15" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Rider */}
          <circle cx="25" cy="7" r="2.5" fill="#4ade80"/>
          <path d="M25 9.5 L30 18" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M25 9.5 L18 14" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Ground */}
          <line x1="3" y1="35" x2="37" y2="35" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
      {/* Text */}
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: cfg.font1,
          color: "#ffffff",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          Hot Wheels
        </div>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 600,
          fontSize: cfg.font2,
          color: "#4ade80",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginTop: 1,
        }}>
          Bikes Shop
        </div>
      </div>
    </div>
  );
}
