import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Database, Mail, Phone, ArrowRight, ChevronRight } from "lucide-react";

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

const sections = [
  {
    icon: <Database size={20} />,
    title: "Information We Collect",
    content: [
      "Personal identification information (name, phone number, email address)",
      "Delivery address and billing information for order processing",
      "Device and browser information when you visit our website",
      "Purchase history and product preferences",
      "Communication records when you contact our support team",
    ],
  },
  {
    icon: <Eye size={20} />,
    title: "How We Use Your Information",
    content: [
      "To process and fulfill your orders accurately and on time",
      "To send order confirmations, shipping updates, and delivery notifications",
      "To respond to your queries and provide customer support",
      "To improve our website, products, and services based on your feedback",
      "To send promotional offers and new arrivals (only with your consent)",
    ],
  },
  {
    icon: <Lock size={20} />,
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your data",
      "Your payment information is never stored on our servers",
      "All data transmissions are encrypted using SSL technology",
      "We regularly review and update our security practices",
      "Access to personal data is restricted to authorized personnel only",
    ],
  },
  {
    icon: <Shield size={20} />,
    title: "Your Rights",
    content: [
      "You have the right to access the personal data we hold about you",
      "You can request correction of inaccurate or incomplete data",
      "You may request deletion of your personal data at any time",
      "You can opt out of marketing communications at any time",
      "You have the right to lodge a complaint with relevant authorities",
    ],
  },
];

export default function PrivacyPolicy() {
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
          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMuted, marginBottom: 28 }}>
            <Link to="/" style={{ color: T.textMuted, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = T.green}
              onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>Home</Link>
            <ChevronRight size={11} />
            <span style={{ color: T.textBody }}>Privacy Policy</span>
          </nav>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: T.green, fontSize: 11, fontWeight: 700, padding: "7px 16px", borderRadius: 99, marginBottom: 20, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            <Shield size={11} /> Legal Document
          </div>
          <h1 style={{ color: T.textMain, fontSize: "clamp(36px,5vw,64px)", fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.02em", lineHeight: 1, marginBottom: 16 }}>
            PRIVACY <span style={{ color: T.green }}>POLICY</span>
          </h1>
          <p style={{ color: T.textBody, fontSize: 16, lineHeight: 1.75, maxWidth: 560 }}>
            Your privacy matters to us. This policy explains how Hot Wheels Bikes collects, uses, and protects your personal information.
          </p>
          <p style={{ color: T.textMuted, fontSize: 13, marginTop: 16 }}>Last updated: January 2025</p>
        </div>
      </section>

      {/* ── Content ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 32px 80px" }}>

        {/* Intro card */}
        <div style={{ background: T.bgSurface, border: `1px solid ${T.borderMid}`, borderRadius: 20, padding: "28px 32px", marginBottom: 40, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, background: "rgba(74,222,128,0.12)", border: `1px solid ${T.borderMid}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.green }}>
            <Shield size={20} />
          </div>
          <div>
            <h3 style={{ color: T.textMain, fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: "'Rajdhani',sans-serif" }}>Our Commitment to You</h3>
            <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.75 }}>
              Hot Wheels Bikes is committed to protecting your personal information and your right to privacy. We only collect data that is necessary to provide you with the best shopping experience.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {sections.map((sec, i) => (
            <div key={i} style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.borderMid}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 28px", borderBottom: `1px solid ${T.border}`, background: "rgba(74,222,128,0.03)" }}>
                <div style={{ width: 40, height: 40, background: "rgba(74,222,128,0.1)", border: `1px solid ${T.borderMid}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: T.green, flexShrink: 0 }}>
                  {sec.icon}
                </div>
                <h2 style={{ color: T.textMain, fontSize: 18, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.02em" }}>
                  {sec.title}
                </h2>
              </div>
              {/* Section content */}
              <div style={{ padding: "22px 28px" }}>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {sec.content.map((item, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: T.textMuted, lineHeight: 1.7 }}>
                      <span style={{ width: 6, height: 6, background: T.green, borderRadius: "50%", flexShrink: 0, marginTop: 8 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Cookies section */}
        <div style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 20, padding: "28px 32px", marginTop: 24 }}>
          <h2 style={{ color: T.textMain, fontSize: 18, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>Cookies Policy</h2>
          <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. Cookies are small text files stored on your device that help us remember your preferences.
          </p>
          <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.75 }}>
            You can control cookie settings through your browser. Disabling cookies may affect some features of our website.
          </p>
        </div>

        {/* Contact card */}
        <div style={{ background: "linear-gradient(135deg,#0f2214,#14532d,#0f2214)", border: `1px solid ${T.borderMid}`, borderRadius: 20, padding: "32px", marginTop: 40, textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ color: T.textMain, fontSize: 22, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 10 }}>Questions About This Policy?</h3>
            <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
              If you have any questions or concerns about our privacy practices, please reach out to us.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:hotwheelsbicycles@gmail.com" className="btn-primary" style={{ fontSize: 13, padding: "11px 24px", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <Mail size={14} /> Email Us
              </a>
              <a href="tel:+923361320540" className="btn-outline" style={{ fontSize: 13, padding: "11px 24px", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <Phone size={14} /> Call Us
              </a>
            </div>
          </div>
        </div>

        {/* Related links */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <Link to="/terms-and-conditions" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMuted, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.green; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
            Terms & Conditions <ArrowRight size={13} />
          </Link>
          <Link to="/returns-policy" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMuted, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.green; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
            Returns Policy <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
