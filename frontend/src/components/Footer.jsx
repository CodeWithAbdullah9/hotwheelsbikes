import { Link } from "react-router-dom";
import { useState } from "react";
import { Phone, Mail, MapPin, ArrowRight, Bike } from "lucide-react";
import Logo from "./Logo";
import { useContext } from "react";
import { LoaderContext } from "../App";

/* ── Social icons ── */
const FB = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const YT = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="#0f2214" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const infoLinks = [
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms-and-conditions" },
  { label: "Returns Policy", path: "/returns-policy" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];
const shopLinks = [
  { label: "All Bikes", path: "/shop" },
  { label: "Mountain Bikes", path: "/shop?category=MOUNTAIN+BIKES" },
  { label: "Road Bikes", path: "/shop?category=ROAD+BIKES" },
  { label: "Electric Bikes", path: "/shop?category=ELECTRIC+BIKES" },
  { label: "Kid's Bikes", path: "/shop?category=KID'S+BIKE" },
  { label: "Accessories", path: "/shop?category=ACCESSORIES" },
];

export default function Footer() {
  const { triggerLoader } = useContext(LoaderContext) || {};
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState(null);

  const handleLogoClick = () => {
    if (triggerLoader) triggerLoader();
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      await fetch("/api/orders/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Newsletter Subscriber", phone: "newsletter", message: `Newsletter subscription request from: ${newsletterEmail}` }),
      });
    } catch (_) { /* ignore */ }
    setNewsletterMsg("Subscribed! We'll keep you updated.");
    setNewsletterEmail("");
    setTimeout(() => setNewsletterMsg(null), 4000);
  };
  return (
    <footer style={{ background: "#0b1a0e", borderTop: "1px solid rgba(74,222,128,0.18)" }}>

      {/* Green accent bar */}
      <div style={{ background: "linear-gradient(90deg,#166534,#4ade80,#166534)", height: 3 }} />

      {/* ── Newsletter strip ── */}
      <div style={{
        background: "linear-gradient(135deg,#0f2214 0%,#132a18 100%)",
        borderBottom: "1px solid rgba(74,222,128,0.12)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(20px, 4vw, 36px) clamp(16px, 4vw, 40px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px" }}>
              <h3 style={{
                color: "#f0fdf4", fontSize: 22, fontWeight: 700,
                fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.04em", marginBottom: 6,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Bike size={20} color="#4ade80" /> Stay in the Loop
              </h3>
              <p style={{ color: "#86efac", fontSize: 14 }}>Get the latest deals, new arrivals and cycling tips.</p>
            </div>
            <form style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: "1 1 300px" }} className="footer-newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{
                  padding: "12px 18px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(74,222,128,0.25)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "#f0fdf4",
                  outline: "none",
                  flex: "1 1 260px",
                  minWidth: 260,
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#4ade80"}
                onBlur={e => e.target.style.borderColor = "rgba(74,222,128,0.25)"}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ fontSize: 14, padding: "12px 24px", whiteSpace: "nowrap" }}
              >
                Subscribe <ArrowRight size={14} />
              </button>
              {newsletterMsg && (
                <p style={{ width: "100%", color: "#4ade80", fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                  ✓ {newsletterMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(32px, 5vw, 56px) clamp(16px, 4vw, 40px) clamp(24px, 4vw, 44px)" }}>
        <div className="footer-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 48
        }}>

          {/* Brand column */}
          <div>
            <Link to="/" style={{ display: "inline-block", marginBottom: 20, textDecoration: "none" }} onClick={handleLogoClick}>
              <Logo size="md" />
            </Link>
            <p style={{ color: "#ffffff", fontSize: 14, lineHeight: 1.85, marginBottom: 24 }}>
              Discover high-quality bicycles, parts, and accessories. Whether you're a professional cyclist or a casual rider, we have everything you need for a smooth ride.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { href: "https://www.facebook.com/HotWheelsBikeShopDHA", icon: <FB />, label: "Facebook" },
                { href: "https://www.youtube.com/@hotwheelsbikes", icon: <YT />, label: "YouTube" },
                { href: "https://www.instagram.com/hotwheelsbikesdha", icon: <IG />, label: "Instagram" },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 40, height: 40,
                    background: "rgba(74,222,128,0.08)",
                    border: "1px solid rgba(74,222,128,0.2)",
                    borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#4ade80", textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#4ade80";
                    e.currentTarget.style.color = "#000";
                    e.currentTarget.style.borderColor = "#4ade80";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(74,222,128,0.3)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(74,222,128,0.08)";
                    e.currentTarget.style.color = "#4ade80";
                    e.currentTarget.style.borderColor = "rgba(74,222,128,0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Information */}
          <div>
            <h4 style={{
              color: "#4ade80", fontSize: 15, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 20,
              paddingBottom: 12, borderBottom: "2px solid rgba(74,222,128,0.35)",
              fontFamily: "'Rajdhani',sans-serif",
            }}>
              Information
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {infoLinks.map(item => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      color: "#ffffff", fontSize: 14, textDecoration: "none",
                      transition: "color 0.2s, gap 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.gap = "12px"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.gap = "8px"; }}
                  >
                    <span style={{ width: 5, height: 5, background: "#4ade80", borderRadius: "50%", flexShrink: 0, opacity: 0.7 }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{
              color: "#4ade80", fontSize: 15, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 20,
              paddingBottom: 12, borderBottom: "2px solid rgba(74,222,128,0.35)",
              fontFamily: "'Rajdhani',sans-serif",
            }}>
              Shop
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {shopLinks.map(item => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      color: "#ffffff", fontSize: 14, textDecoration: "none",
                      transition: "color 0.2s, gap 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.gap = "12px"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.gap = "8px"; }}
                  >
                    <span style={{ width: 5, height: 5, background: "#4ade80", borderRadius: "50%", flexShrink: 0, opacity: 0.7 }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              color: "#4ade80", fontSize: 15, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 20,
              paddingBottom: 12, borderBottom: "2px solid rgba(74,222,128,0.35)",
              fontFamily: "'Rajdhani',sans-serif",
            }}>
              Contact Us
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: <Phone size={15} />, label: "Phone", value: "+0336 1320540", href: "tel:+923361320540" },
                { icon: <Mail size={15} />, label: "Email", value: "hotwheelsbicycles@gmail.com", href: "mailto:hotwheelsbicycles@gmail.com" },
                { icon: <MapPin size={15} />, label: "Location", value: "DHA Phase 4, Karachi", href: "#" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36,
                    background: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.2)",
                    borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, color: "#4ade80",
                  }}>
                    {c.icon}
                  </div>
                  <div>
                    <p style={{ color: "#4ade80", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 3, fontWeight: 700 }}>
                      {c.label}
                    </p>
                    <a
                      href={c.href}
                      style={{ color: "#d1fae5", fontSize: 14, textDecoration: "none", wordBreak: "break-all", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#4ade80"}
                      onMouseLeave={e => e.currentTarget.style.color = "#d1fae5"}
                    >
                      {c.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Get In Touch button */}
            <Link
              to="/contact"
              className="btn-primary"
              style={{ marginTop: 24, justifyContent: "center", width: "100%", fontSize: 14, padding: "12px 0" }}
            >
              Get In Touch <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid rgba(74,222,128,0.12)", background: "#071a09" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px clamp(16px, 4vw, 40px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }} className="footer-bottom">
            <p style={{ color: "#6b9e7a", fontSize: 13 }}>
              © 2025 Hot Wheels Bikes Shop. All rights reserved.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }} className="footer-bottom-links">
              {[
                { label: "Privacy", path: "/privacy-policy" },
                { label: "Terms", path: "/terms-and-conditions" },
                { label: "Returns", path: "/returns-policy" },
              ].map((l, i) => (
                <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {i > 0 && <span style={{ color: "rgba(74,222,128,0.3)", fontSize: 10 }}>·</span>}
                  <Link
                    to={l.path}
                    style={{ color: "#6b9e7a", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#4ade80"}
                    onMouseLeave={e => e.currentTarget.style.color = "#6b9e7a"}
                  >
                    {l.label}
                  </Link>
                </span>
              ))}
              <span style={{ color: "rgba(74,222,128,0.3)", fontSize: 10 }}>·</span>
              <span style={{ color: "#6b9e7a", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                <Bike size={14} color="#6b9e7a" /> Pakistan's #1 Bike Store Since 1990
              </span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
