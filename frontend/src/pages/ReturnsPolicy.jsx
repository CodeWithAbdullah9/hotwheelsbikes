import { Link } from "react-router-dom";
import { RotateCcw, CheckCircle, XCircle, Clock, Package, Phone, Mail, ArrowRight, ChevronRight } from "lucide-react";

const T = {
  bgBase:    "#0b1a0e",
  bgSurface: "#0f2214",
  bgRaised:  "#132a18",
  green:     "#4ade80",
  textMain:  "#f0fdf4",
  textBody:  "#d1fae5",
  textMuted: "#86efac",
  border:    "rgba(74,222,128,0.15)",
  borderMid: "rgba(74,222,128,0.25)",
};

const steps = [
  { num: "01", title: "Contact Us", desc: "Call or WhatsApp us at +0336 1320540 or email hotwheelsbicycles@gmail.com within 7 days of receiving your order." },
  { num: "02", title: "Describe the Issue", desc: "Tell us what's wrong with the product. Share photos or videos if possible to help us understand the issue quickly." },
  { num: "03", title: "Get Approval", desc: "Our team will review your request and provide a return authorization within 24–48 hours." },
  { num: "04", title: "Ship the Product", desc: "Pack the item securely in its original packaging and ship it to our address in DHA Phase 4, Karachi." },
  { num: "05", title: "Refund or Exchange", desc: "Once we receive and inspect the item, we'll process your refund or send a replacement within 5–7 business days." },
];

const eligible = [
  "Product received in damaged or defective condition",
  "Wrong item delivered (different from what was ordered)",
  "Product not as described on the website",
  "Missing parts or accessories from the package",
  "Manufacturing defects covered under warranty",
];

const notEligible = [
  "Products damaged due to misuse, accidents, or improper assembly",
  "Items returned after 7 days of delivery",
  "Products without original packaging or accessories",
  "Customized or specially ordered items",
  "Normal wear and tear after use",
];

export default function ReturnsPolicy() {
  return (
    <div style={{ background: T.bgBase, minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://hotwheelsbikes.com/wp-content/uploads/2025/01/81e-efWTckL.jpg')",
          backgroundSize: "cover", backgroundPosition: "center 40%",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(5,20,10,0.70),rgba(5,20,10,0.55))" }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px", pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(to top,${T.bgBase},transparent)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "96px 32px 80px", position: "relative", zIndex: 1 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMuted, marginBottom: 28 }}>
            <Link to="/" style={{ color: T.textMuted, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = T.green}
              onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>Home</Link>
            <ChevronRight size={11} />
            <span style={{ color: T.textBody }}>Returns Policy</span>
          </nav>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: T.green, fontSize: 11, fontWeight: 700, padding: "7px 16px", borderRadius: 99, marginBottom: 20, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            <RotateCcw size={11} /> Legal Document
          </div>
          <h1 style={{ color: T.textMain, fontSize: "clamp(36px,5vw,64px)", fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.02em", lineHeight: 1, marginBottom: 16 }}>
            RETURNS <span style={{ color: T.green }}>POLICY</span>
          </h1>
          <p style={{ color: T.textBody, fontSize: 16, lineHeight: 1.75, maxWidth: 560 }}>
            We want you to be completely satisfied with your purchase. If something isn't right, we're here to make it right.
          </p>
          <p style={{ color: T.textMuted, fontSize: 13, marginTop: 16 }}>Last updated: January 2025</p>
        </div>
      </section>

      {/* ── Content ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 32px 80px" }}>

        {/* Quick info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 48 }} className="trust-grid returns-quick-cards">
          {[
            { icon: <Clock size={22} />, title: "7-Day Window", desc: "Return requests must be made within 7 days of delivery" },
            { icon: <Package size={22} />, title: "Original Packaging", desc: "Items must be returned in original packaging with all accessories" },
            { icon: <RotateCcw size={22} />, title: "Free Exchange", desc: "We offer free exchange for defective or wrong items" },
          ].map((item) => (
            <div key={item.title} style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 18, padding: "24px 20px", textAlign: "center", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(74,222,128,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ width: 48, height: 48, background: "rgba(74,222,128,0.1)", border: `1px solid ${T.borderMid}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: T.green }}>
                {item.icon}
              </div>
              <h3 style={{ color: T.textMain, fontSize: 15, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 6 }}>{item.title}</h3>
              <p style={{ color: T.textMuted, fontSize: 12, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Eligible / Not eligible */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }} className="about-grid returns-eligible-grid">
          {/* Eligible */}
          <div style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 24px", borderBottom: `1px solid ${T.border}`, background: "rgba(74,222,128,0.05)" }}>
              <CheckCircle size={18} style={{ color: T.green }} />
              <h2 style={{ color: T.textMain, fontSize: 16, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif" }}>Eligible for Return</h2>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {eligible.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>
                    <CheckCircle size={14} style={{ color: T.green, flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Not eligible */}
          <div style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 24px", borderBottom: `1px solid ${T.border}`, background: "rgba(239,68,68,0.04)" }}>
              <XCircle size={18} style={{ color: "#f87171" }} />
              <h2 style={{ color: T.textMain, fontSize: 16, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif" }}>Not Eligible for Return</h2>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {notEligible.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>
                    <XCircle size={14} style={{ color: "#f87171", flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Return process steps */}
        <div style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 20, padding: "32px", marginBottom: 40 }}>
          <h2 style={{ color: T.textMain, fontSize: 22, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 28, letterSpacing: "0.02em" }}>
            How to Return — Step by Step
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Number + line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, background: T.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 16px rgba(74,222,128,0.4)" }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: "#000", fontFamily: "'Rajdhani',sans-serif" }}>{step.num}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 2, height: 32, background: "rgba(74,222,128,0.2)", margin: "6px 0" }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ paddingBottom: i < steps.length - 1 ? 8 : 0, paddingTop: 10 }}>
                  <h3 style={{ color: T.textMain, fontSize: 15, fontWeight: 700, marginBottom: 6, fontFamily: "'Rajdhani',sans-serif" }}>{step.title}</h3>
                  <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund timeline */}
        <div style={{ background: T.bgSurface, border: `1px solid ${T.borderMid}`, borderRadius: 20, padding: "28px 32px", marginBottom: 40 }}>
          <h2 style={{ color: T.textMain, fontSize: 18, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 16 }}>Refund Timeline</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Return request approval", time: "24–48 hours" },
              { label: "Product inspection after receipt", time: "1–2 business days" },
              { label: "Refund processing (bank transfer)", time: "3–5 business days" },
              { label: "Exchange dispatch", time: "1–2 business days after approval" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ color: T.textMuted, fontSize: 14 }}>{item.label}</span>
                <span style={{ color: T.green, fontSize: 13, fontWeight: 700, background: "rgba(74,222,128,0.1)", border: `1px solid ${T.border}`, padding: "4px 12px", borderRadius: 8 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact card */}
        <div style={{ background: "linear-gradient(135deg,#0f2214,#14532d,#0f2214)", border: `1px solid ${T.borderMid}`, borderRadius: 20, padding: "32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ color: T.textMain, fontSize: 22, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 10 }}>Need to Return Something?</h3>
            <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
              Contact us immediately and we'll guide you through the process.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+923361320540" className="btn-primary" style={{ fontSize: 13, padding: "11px 24px", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <Phone size={14} /> Call +0336 1320540
              </a>
              <a href="mailto:hotwheelsbicycles@gmail.com" className="btn-outline" style={{ fontSize: 13, padding: "11px 24px", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <Mail size={14} /> Email Us
              </a>
            </div>
          </div>
        </div>

        {/* Related links */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <Link to="/privacy-policy" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMuted, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.green; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
            Privacy Policy <ArrowRight size={13} />
          </Link>
          <Link to="/terms-and-conditions" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMuted, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.green; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
            Terms & Conditions <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
