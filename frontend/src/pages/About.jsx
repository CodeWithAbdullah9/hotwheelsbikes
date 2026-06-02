import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Globe, Bike, CheckCircle, Star, Zap, Rocket, TrendingUp, Earth } from "lucide-react";
import { useWindowWidth } from "../hooks/useWindowWidth";

const T = {
  bgBase: "#0b1a0e",
  bgSurface: "#0f2214",
  bgRaised: "#132a18",
  green: "#4ade80",
  greenMid: "#22c55e",
  textMain: "#f0fdf4",
  textBody: "#d1fae5",
  textMuted: "#86efac",
  border: "rgba(74,222,128,0.15)",
  borderMid: "rgba(74,222,128,0.25)",
};

const W = ({ children, style = {} }) => (
  <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px)", ...style }}>{children}</div>
);

const stats = [
  { icon: <Bike size={22} />, value: "500+", label: "Bikes in Stock" },
  { icon: <Users size={22} />, value: "10,000+", label: "Happy Customers" },
  { icon: <Globe size={22} />, value: "35+", label: "Years Experience" },
  { icon: <Award size={22} />, value: "15+", label: "Awards Won" },
];

const milestones = [
  { year: "1990", title: "Founded", desc: "Hot Wheels Bikes established with a vision to bring quality cycling to everyone in Pakistan.", icon: <Rocket size={18} /> },
  { year: "2000", title: "Expansion", desc: "Expanded product line to include mountain bikes, road bikes, and a full range of accessories.", icon: <TrendingUp size={18} /> },
  { year: "2010", title: "Global Reach", desc: "Products reaching customers across multiple countries and regions with international brands.", icon: <Earth size={18} /> },
  { year: "2024", title: "E-Bikes Era", desc: "Launched our electric bike lineup to meet modern rider demands and eco-friendly transport.", icon: <Zap size={18} /> },
];

const values = [
  { icon: <Star size={18} />, title: "Kindness", desc: "We treat every customer like family, with care and respect in every interaction." },
  { icon: <CheckCircle size={18} />, title: "Integrity", desc: "Honest pricing, genuine products, no compromises — ever." },
  { icon: <Zap size={18} />, title: "Practicality", desc: "Real solutions for real riders — from kids to professional cyclists." },
  { icon: <Award size={18} />, title: "Ambition", desc: "Always pushing forward with innovation, quality, and customer satisfaction." },
];

export default function About() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isSmall = width < 480;
  const sectionPad = isMobile ? "56px 0" : "96px 0";

  return (
    <div style={{ background: T.bgBase }}>

      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: "72vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Background image - UNIQUE for About page */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp')",
          backgroundSize: "cover", backgroundPosition: "center 40%",
        }} />
        {/* Dark green overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(rgba(5,20,10,0.65),rgba(5,20,10,0.3))",
        }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px", pointerEvents: "none",
        }} />
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700, height: 350,
          background: "rgba(74,222,128,0.06)", borderRadius: "50%",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to top,${T.bgBase},transparent)`, pointerEvents: "none" }} />

        <W style={{ position: "relative", zIndex: 1, width: "100%", paddingTop: 120, paddingBottom: 120, textAlign: "center" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.35)",
            color: T.green, fontSize: 11, fontWeight: 700,
            padding: "8px 18px", borderRadius: 99, marginBottom: 28,
            letterSpacing: "0.14em", textTransform: "uppercase",
          }} className="slide-down pulse-glow">
            <span style={{ width: 6, height: 6, background: T.green, borderRadius: "50%", boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
            Est. 1990 — Pakistan's Trusted Bike Store
          </div>

          <h1 style={{
            color: T.textMain, fontSize: "clamp(36px,5vw,72px)", fontWeight: 700,
            fontFamily: "'Rajdhani',sans-serif", marginBottom: 20,
            letterSpacing: "0.02em", lineHeight: 1,
          }} className="fade-up">
            ABOUT HOT WHEELS <span style={{ color: T.green }}>BIKES</span>
          </h1>

          <p style={{ color: T.textBody, fontSize: 17, maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.75 }} className="fade-up stagger-1">
            Established in 1990, we have been dedicated to bringing the joy of riding to everyone through quality bicycles and outstanding service.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }} className="fade-up stagger-2">
            <Link to="/shop" className="btn-primary">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>
        </W>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: isMobile ? "40px 0" : "64px 0", background: T.bgSurface, borderBottom: `1px solid ${T.border}` }}>
        <W>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 16 }}>
            {stats.map((stat, index) => (
              <div key={stat.label}
                className={`hover-lift scale-in stagger-${index + 1}`}
                style={{
                  background: T.bgRaised, border: `1px solid ${T.border}`,
                  borderRadius: 20, padding: "28px 24px", textAlign: "center",
                  transition: "all 0.25s", cursor: "default",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.boxShadow = "0 12px 40px rgba(74,222,128,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{
                  width: 50, height: 50, background: "rgba(74,222,128,0.1)", color: T.green,
                  borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px", border: `1px solid ${T.borderMid}`,
                }}>
                  {stat.icon}
                </div>
                <p style={{ fontSize: 36, fontWeight: 900, color: T.textMain, fontFamily: "'Rajdhani',sans-serif", marginBottom: 4, lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontSize: 13, color: T.textMuted }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </W>
      </section>

      {/* ── Story ── */}
      <section style={{ padding: sectionPad, background: T.bgBase }}>
        <W>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 72, alignItems: "center" }}>
            <div>
              <p style={{ color: T.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: 16 }}>Who We Are</p>
              <h2 style={{
                color: T.textMain, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700,
                fontFamily: "'Rajdhani',sans-serif", marginBottom: 24,
                lineHeight: 1.1, letterSpacing: "0.02em",
              }}>
                A COMPREHENSIVE CYCLING ENTERPRISE
              </h2>
              {[
                "Established in 1990, Hot Wheels Bikes is a comprehensive enterprise dedicated to the development, production, and distribution of complete bicycles and bicycle components. Headquartered in DHA Phase 4, Karachi.",
                "We proudly own a series of innovative bicycle brands that have successfully penetrated the global market, delivering high-quality bicycles and riding equipment to consumers worldwide.",
                "Guided by a corporate philosophy of Kindness, Integrity, Practicality, and Ambition, we are dedicated to bringing the joy of riding to everyone through continuous technological innovation.",
              ].map((p, i) => (
                <p key={i} style={{ color: T.textMuted, fontSize: 15, lineHeight: 1.8, marginBottom: 14 }}>{p}</p>
              ))}
              <Link to="/shop" className="btn-primary" style={{ marginTop: 18, fontSize: 14, padding: "14px 28px" }}>
                Shop Our Collection <ArrowRight size={15} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="about-images">
              <img src="https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-32.png" alt="Hot Wheels Bikes"
                style={{ borderRadius: 18, width: "100%", height: isMobile ? 180 : 240, objectFit: "cover", border: `1px solid ${T.border}` }}
                onError={e => { e.target.src = "https://placehold.co/300x240/132a18/4ade80?text=HotWheels"; }} />
              <img src="https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-31.png" alt="Hot Wheels Bikes"
                style={{ borderRadius: 18, width: "100%", height: isMobile ? 180 : 240, objectFit: "cover", marginTop: isMobile ? 0 : 36, border: `1px solid ${T.border}` }}
                onError={e => { e.target.src = "https://placehold.co/300x240/132a18/4ade80?text=Bikes"; }} />
            </div>
          </div>
        </W>
      </section>

      {/* ── Values ── */}
      <section style={{ padding: sectionPad, background: T.bgSurface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <W>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: T.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: 12 }}>What Drives Us</p>
            <h2 style={{ color: T.textMain, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.02em" }}>OUR CORE VALUES</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isSmall ? "1fr" : isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 18 }}>
            {values.map((v, i) => (
              <div key={v.title}
                style={{
                  padding: 30, borderRadius: 20,
                  border: i === 0 ? `1px solid ${T.green}` : `1px solid ${T.border}`,
                  background: i === 0 ? T.green : T.bgRaised,
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = i === 0 ? "0 0 40px rgba(74,222,128,0.35)" : "0 12px 40px rgba(74,222,128,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 18,
                  background: i === 0 ? "rgba(0,0,0,0.15)" : "rgba(74,222,128,0.1)",
                }}>
                  <span style={{ color: i === 0 ? "#000" : T.green }}>{v.icon}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 10, color: i === 0 ? "#000" : T.textMain }}>{v.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: i === 0 ? "rgba(0,0,0,0.65)" : T.textMuted }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </W>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding: sectionPad, background: T.bgBase }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: T.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: 12 }}>Our Journey</p>
            <h2 style={{ color: T.textMain, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.02em" }}>MILESTONES</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {milestones.map((m, i) => (
              <div key={m.year} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Year badge */}
                <div style={{ flexShrink: 0, width: isMobile ? 56 : 80, textAlign: "right", paddingTop: 20 }}>
                  <span style={{ color: T.green, fontSize: 20, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif" }}>{m.year}</span>
                </div>
                {/* Line + dot */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 40, height: 40, background: T.green, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 20px rgba(74,222,128,0.4)", flexShrink: 0, color: "#000",
                  }}>
                    {m.icon}
                  </div>
                  {i < milestones.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 24, background: "rgba(74,222,128,0.2)", marginTop: 8 }} />
                  )}
                </div>
                {/* Card */}
                <div style={{
                  flex: 1, background: T.bgRaised, border: `1px solid ${T.border}`,
                  borderRadius: 18, padding: "20px 24px", marginBottom: 8, transition: "all 0.25s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(74,222,128,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <h3 style={{ color: T.textMain, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{m.title}</h3>
                  <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.7 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "88px 0", position: "relative", overflow: "hidden" }}>
        {/* Gradient background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg,#0f2214,#14532d,#0f2214)",
        }} />
        {/* Grid pattern overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(74,222,128,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.06) 1px,transparent 1px)",
          backgroundSize: "60px 60px", pointerEvents: "none",
        }} />
        {/* Glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600, height: 300,
          background: "rgba(74,222,128,0.08)", borderRadius: "50%",
          filter: "blur(100px)", pointerEvents: "none",
        }} />

        <W style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{
              color: T.textMain, fontSize: "clamp(28px,4vw,52px)", fontWeight: 700,
              fontFamily: "'Rajdhani',sans-serif", marginBottom: 14, letterSpacing: "0.02em",
            }}>
              READY TO RIDE?
            </h2>
            <p style={{ color: T.textBody, fontSize: 16, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
              Browse our full collection of premium bikes and find your perfect ride.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/shop" className="btn-primary">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </W>
      </section>
    </div>
  );
}
