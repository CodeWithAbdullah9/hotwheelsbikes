import { Link } from "react-router-dom";
import { FileText, ShoppingBag, CreditCard, Truck, AlertCircle, Scale, Mail, Phone, ArrowRight, ChevronRight } from "lucide-react";

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
    icon: <ShoppingBag size={20} />,
    title: "Orders & Purchases",
    content: [
      "All orders are subject to product availability and confirmation of the order price",
      "We reserve the right to refuse or cancel any order at our discretion",
      "Prices are listed in Pakistani Rupees (PKR) and are subject to change without notice",
      "Order confirmation will be sent via WhatsApp or email after successful placement",
      "We are not responsible for errors in product descriptions or pricing",
    ],
  },
  {
    icon: <CreditCard size={20} />,
    title: "Payment Terms",
    content: [
      "We accept cash on delivery (COD) for all orders across Pakistan",
      "Bank transfer and online payment options are available on request",
      "Full payment is required before dispatch for custom or bulk orders",
      "We do not store any payment card information on our servers",
      "In case of payment disputes, please contact us within 7 days of purchase",
    ],
  },
  {
    icon: <Truck size={20} />,
    title: "Delivery & Shipping",
    content: [
      "Free delivery is available on orders above ₨ 5,000 within Pakistan",
      "Standard delivery takes 3–7 business days depending on your location",
      "Delivery to remote areas may take additional time",
      "We are not liable for delays caused by courier services or natural events",
      "Risk of loss passes to the customer upon delivery confirmation",
    ],
  },
  {
    icon: <AlertCircle size={20} />,
    title: "Product Use & Liability",
    content: [
      "All bicycles must be assembled and used according to manufacturer guidelines",
      "We recommend professional assembly for safety-critical components",
      "Hot Wheels Bikes is not liable for injuries resulting from improper use",
      "Warranty claims must be submitted within the specified warranty period",
      "Modifications to the product may void the manufacturer's warranty",
    ],
  },
  {
    icon: <Scale size={20} />,
    title: "Intellectual Property",
    content: [
      "All content on this website is the property of Hot Wheels Bikes",
      "You may not reproduce, distribute, or use our content without written permission",
      "Product images and descriptions are for informational purposes only",
      "Brand names and logos belong to their respective owners",
      "Unauthorized use of our intellectual property may result in legal action",
    ],
  },
];

export default function TermsConditions() {
  return (
    <div style={{ background: T.bgBase, minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://hotwheelsbikes.com/wp-content/uploads/2024/10/02bc13e51e4d60cf118138e5c0dc99ed.jpg_720x720q80.jpg_-1.webp')",
          backgroundSize: "cover", backgroundPosition: "center 45%",
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
            <span style={{ color: T.textBody }}>Terms & Conditions</span>
          </nav>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: T.green, fontSize: 11, fontWeight: 700, padding: "7px 16px", borderRadius: 99, marginBottom: 20, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            <FileText size={11} /> Legal Document
          </div>
          <h1 style={{ color: T.textMain, fontSize: "clamp(36px,5vw,64px)", fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.02em", lineHeight: 1, marginBottom: 16 }}>
            TERMS & <span style={{ color: T.green }}>CONDITIONS</span>
          </h1>
          <p style={{ color: T.textBody, fontSize: 16, lineHeight: 1.75, maxWidth: 560 }}>
            Please read these terms carefully before using our website or placing an order. By using our services, you agree to these terms.
          </p>
          <p style={{ color: T.textMuted, fontSize: 13, marginTop: 16 }}>Last updated: January 2025</p>
        </div>
      </section>

      {/* ── Content ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 32px 80px" }}>

        {/* Intro card */}
        <div style={{ background: T.bgSurface, border: `1px solid ${T.borderMid}`, borderRadius: 20, padding: "28px 32px", marginBottom: 40, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, background: "rgba(74,222,128,0.12)", border: `1px solid ${T.borderMid}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.green }}>
            <FileText size={20} />
          </div>
          <div>
            <h3 style={{ color: T.textMain, fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: "'Rajdhani',sans-serif" }}>Agreement to Terms</h3>
            <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.75 }}>
              By accessing or using the Hot Wheels Bikes website and services, you confirm that you are at least 18 years old and agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {sections.map((sec, i) => (
            <div key={i} style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.borderMid}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 28px", borderBottom: `1px solid ${T.border}`, background: "rgba(74,222,128,0.03)" }}>
                <div style={{ width: 40, height: 40, background: "rgba(74,222,128,0.1)", border: `1px solid ${T.borderMid}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: T.green, flexShrink: 0 }}>
                  {sec.icon}
                </div>
                <h2 style={{ color: T.textMain, fontSize: 18, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.02em" }}>
                  {sec.title}
                </h2>
              </div>
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

        {/* Governing law */}
        <div style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 20, padding: "28px 32px", marginTop: 24 }}>
          <h2 style={{ color: T.textMain, fontSize: 18, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 14 }}>Governing Law</h2>
          <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>
            These Terms & Conditions are governed by the laws of Pakistan. Any disputes arising from the use of our services shall be subject to the exclusive jurisdiction of the courts of Karachi, Pakistan.
          </p>
          <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.75 }}>
            We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
          </p>
        </div>

        {/* Contact card */}
        <div style={{ background: "linear-gradient(135deg,#0f2214,#14532d,#0f2214)", border: `1px solid ${T.borderMid}`, borderRadius: 20, padding: "32px", marginTop: 40, textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ color: T.textMain, fontSize: 22, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 10 }}>Have Questions?</h3>
            <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
              If you have any questions about these terms, please contact us before making a purchase.
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
          <Link to="/privacy-policy" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMuted, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.green; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
            Privacy Policy <ArrowRight size={13} />
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
