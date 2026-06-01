import { Link } from "react-router-dom";
import { Home, ArrowRight, ShoppingBag, Bike } from "lucide-react";

const T = {
  bgBase: "#0b1a0e",
  bgRaised: "#132a18",
  green: "#4ade80",
  textMain: "#f0fdf4",
  textMuted: "#86efac",
  border: "rgba(74,222,128,0.15)",
  borderMid: "rgba(74,222,128,0.25)",
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", background: T.bgBase,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", position: "relative", overflow: "hidden",
    }}>
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)",
        backgroundSize: "60px 60px", pointerEvents: "none",
      }} />

      {/* Decorative green glow blob */}
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 700, height: 500,
        background: "radial-gradient(ellipse at center,rgba(74,222,128,0.1) 0%,rgba(74,222,128,0.04) 40%,transparent 70%)",
        borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
      }} />
      {/* Secondary glow */}
      <div style={{
        position: "absolute", bottom: "15%", right: "10%",
        width: 300, height: 300,
        background: "rgba(34,197,94,0.06)", borderRadius: "50%",
        filter: "blur(80px)", pointerEvents: "none",
      }} />

      <div style={{ textAlign: "center", maxWidth: 500, position: "relative" }}>
        {/* Big 404 */}
        <div style={{ position: "relative", marginBottom: 8 }}>
          <p style={{
            fontSize: "clamp(120px,20vw,200px)", fontWeight: 900,
            fontFamily: "'Rajdhani',sans-serif", color: T.green,
            lineHeight: 1, letterSpacing: "-0.04em", userSelect: "none",
            textShadow: "0 0 80px rgba(74,222,128,0.35), 0 0 160px rgba(74,222,128,0.15)",
          }}>
            404
          </p>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bike size={64} color="#4ade80" className="float" />
          </div>
        </div>

        <h1 style={{
          color: T.textMain, fontSize: "clamp(24px,4vw,36px)", fontWeight: 700,
          fontFamily: "'Rajdhani',sans-serif", marginBottom: 12, letterSpacing: "0.04em",
        }}>
          PAGE NOT FOUND
        </h1>
        <p style={{ color: T.textMuted, fontSize: 15, lineHeight: 1.75, marginBottom: 40, maxWidth: 380, margin: "0 auto 40px" }}>
          Looks like this page took a wrong turn. Let's get you back on track and find your perfect ride.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className="btn-primary" style={{ fontSize: 14, padding: "13px 28px" }}>
            <Home size={15} /> Go Home
          </Link>
          <Link to="/shop" className="btn-outline" style={{ fontSize: 14, padding: "13px 28px" }}>
            <ShoppingBag size={15} /> Browse Bikes <ArrowRight size={14} />
          </Link>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${T.border}` }}>
          <p style={{ color: T.textMuted, fontSize: 12, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.14em", opacity: 0.7 }}>Quick Links</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Mountain Bikes", path: "/shop?category=MOUNTAIN+BIKES" },
              { label: "Road Bikes", path: "/shop?category=ROAD+BIKES" },
              { label: "Electric Bikes", path: "/shop?category=ELECTRIC+BIKES" },
              { label: "Kid's Bikes", path: "/shop?category=KID'S+BIKE" },
            ].map(l => (
              <Link key={l.label} to={l.path}
                style={{
                  padding: "7px 14px", background: T.bgRaised,
                  border: `1px solid ${T.border}`, borderRadius: 8,
                  color: T.textMuted, fontSize: 12, textDecoration: "none", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.green; e.currentTarget.style.boxShadow = "0 4px 16px rgba(74,222,128,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; e.currentTarget.style.boxShadow = "none"; }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
