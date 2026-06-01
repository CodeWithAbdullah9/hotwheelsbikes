import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, Zap, Shield, Truck, Star, ChevronRight, Phone, Award, Users, Clock, Flame, Trophy, Heart } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { accessories } from "../data/products";
import axios from "axios";

// ─── Theme tokens ────────────────────────────────────────────────────────────
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

const featured = [];

const cats = [
  { label: "Kid's Bike", sub: "Ages 3–10", path: "/shop?category=KID'S+BIKE", img: "https://hotwheelsbikes.com/wp-content/uploads/2024/10/02bc13e51e4d60cf118138e5c0dc99ed.jpg_720x720q80.jpg_-1.webp" },
  { label: "Mountain Bikes", sub: "Trail & Enduro", path: "/shop?category=MOUNTAIN+BIKES", img: "https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp" },
  { label: "Road Bikes", sub: "Speed & Distance", path: "/shop?category=ROAD+BIKES", img: "https://hotwheelsbikes.com/wp-content/uploads/2024/10/unnamed.png" },
  { label: "Electric Bikes", sub: "Power Assisted", path: "/shop?category=ELECTRIC+BIKES", img: "https://hotwheelsbikes.com/wp-content/uploads/2025/01/81e-efWTckL.jpg" },
];

const trust = [
  { icon: <Truck size={22} />, title: "Free Delivery", desc: "On orders above ₨ 5,000" },
  { icon: <Shield size={22} />, title: "100% Genuine", desc: "Authentic products only" },
  { icon: <Star size={22} />, title: "Top Rated", desc: "Trusted since 1990" },
  { icon: <Phone size={22} />, title: "Fast Support", desc: "+0336 1320540" },
];

// ─── Layout helpers ──────────────────────────────────────────────────────────
const W = ({ children, style = {} }) => (
  <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", ...style }}>
    {children}
  </div>
);

// ─── Section label + heading ─────────────────────────────────────────────────
const SectionHead = ({ label, title, center = false }) => (
  <div style={{ textAlign: center ? "center" : "left" }}>
    <p style={{
      color: T.green, fontSize: 11, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: 10,
    }}>
      {label}
    </p>
    <h2 style={{
      color: T.textMain, fontSize: 38, fontWeight: 700,
      fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.03em",
    }}>
      {title}
    </h2>
  </div>
);

// ─── Section divider ─────────────────────────────────────────────────────────
const SectionDivider = ({ bg = T.bgBase }) => (
  <div style={{ background: bg, padding: "0 40px" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", height: 2 }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(90deg,transparent,rgba(74,222,128,0.45) 25%,${T.green} 50%,rgba(74,222,128,0.45) 75%,transparent)`,
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 10, height: 10,
        background: T.green, borderRadius: "50%",
        boxShadow: "0 0 0 3px rgba(74,222,128,0.25), 0 0 18px 4px rgba(74,222,128,0.65)",
      }} />
    </div>
  </div>
);

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get('/api/products/public')
      .then(res => {
        if (res.data.success && res.data.products) {
          // First 8 products as featured
          setFeatured(res.data.products.slice(0, 8));
        }
      })
      .catch(() => { });
  }, []);

  return (
    <div style={{ background: T.bgBase }}>

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg')",
          backgroundSize: "cover", backgroundPosition: "center 30%",
        }} />
        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(115deg,rgba(5,20,10,0.90) 0%,rgba(7,35,18,0.70) 50%,rgba(5,20,10,0.35) 100%)",
        }} />
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: "20%", right: "15%",
          width: 520, height: 520,
          background: "rgba(74,222,128,0.07)", borderRadius: "50%",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "5%",
          width: 300, height: 300,
          background: "rgba(34,197,94,0.05)", borderRadius: "50%",
          filter: "blur(90px)", pointerEvents: "none",
        }} />

        <W style={{ position: "relative", zIndex: 1, width: "100%", paddingTop: 110, paddingBottom: 110 }}>
          <div className="hero-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 64, alignItems: "center" }}>

            {/* ── Left: copy ── */}
            <div className="slide-in-left">
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.35)",
                color: T.green, fontSize: 11, fontWeight: 700,
                padding: "8px 18px", borderRadius: 99, marginBottom: 32,
                letterSpacing: "0.14em", textTransform: "uppercase",
              }} className="pulse-glow">
                <span style={{ width: 6, height: 6, background: T.green, borderRadius: "50%", boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
                Pakistan's #1 Bike Store — Est. 1990
              </div>

              <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, lineHeight: 0.88, marginBottom: 30 }}>
                <span style={{ display: "block", fontSize: "clamp(58px,7.5vw,96px)", color: T.textMain, letterSpacing: "-0.02em" }}>RIDE</span>
                <span style={{ display: "block", fontSize: "clamp(58px,7.5vw,96px)", color: T.green, letterSpacing: "-0.02em" }}>BEYOND</span>
                <span style={{ display: "block", fontSize: "clamp(58px,7.5vw,96px)", color: T.textMain, letterSpacing: "-0.02em" }}>LIMITS</span>
              </h1>

              <p style={{ color: T.textBody, fontSize: 17, lineHeight: 1.8, marginBottom: 42, maxWidth: 480 }}>
                Premium bicycles for every rider — from kids to professionals. Mountain, road, electric, and more.
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 56 }} className="hero-buttons">
                <Link to="/shop" className="btn-primary" style={{ fontSize: 15, padding: "15px 38px", boxShadow: "0 0 40px rgba(74,222,128,0.45)" }}>
                  Shop Now <ArrowRight size={17} />
                </Link>
                <Link to="/about" className="btn-outline" style={{ fontSize: 15, padding: "15px 38px" }}>
                  Our Story
                </Link>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 48, paddingTop: 32, borderTop: "1px solid rgba(74,222,128,0.18)" }}>
                {[
                  { v: "35+", l: "Years" },
                  { v: "500+", l: "Bikes" },
                  { v: "10K+", l: "Riders" },
                ].map((s) => (
                  <div key={s.l}>
                    <p style={{ fontSize: 38, fontWeight: 900, color: T.textMain, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>{s.v}</p>
                    <p style={{ fontSize: 11, color: T.textMuted, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.18em" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: deal card ── */}
            <div className="hero-right-col scale-in" style={{
              background: "rgba(11,26,14,0.78)", backdropFilter: "blur(28px)",
              border: "1px solid rgba(74,222,128,0.28)", borderRadius: 24, padding: 38,
              boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(74,222,128,0.12)",
            }}>
              <div style={{
                display: "inline-block", background: T.green, color: "#000",
                fontSize: 11, fontWeight: 800, padding: "6px 14px",
                borderRadius: 8, marginBottom: 24, letterSpacing: "0.1em",
              }} className="wiggle">
                <Flame size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> HOT DEAL
              </div>
              <h3 style={{ color: T.textMain, fontSize: 28, fontWeight: 700, marginBottom: 12, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.02em" }}>
                Up to 50% OFF
              </h3>
              <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 26, lineHeight: 1.7 }}>
                On selected mountain bikes, road bikes, and electric scooters. Limited time offer.
              </p>
              <div style={{ borderTop: "1px solid rgba(74,222,128,0.18)", paddingTop: 24, marginBottom: 26 }}>
                <p style={{ color: T.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 8 }}>Starting from</p>
                <p style={{ color: T.green, fontSize: 44, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>₨ 24,500</p>
              </div>
              {/* Mini trust badges */}
              <div style={{ display: "flex", gap: 10, marginBottom: 26 }}>
                {["Free Delivery", "Genuine", "Warranty"].map((b) => (
                  <span key={b} style={{
                    fontSize: 10, fontWeight: 700, color: T.green,
                    background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
                    padding: "4px 10px", borderRadius: 99, letterSpacing: "0.08em",
                    display: "inline-flex", alignItems: "center", gap: 4,
                  }}>
                    <Star size={9} fill={T.green} stroke="none" /> {b}
                  </span>
                ))}
              </div>
              <Link to="/shop" className="btn-primary" style={{ justifyContent: "center", width: "100%", padding: "14px 0", fontSize: 14 }}>
                Browse All Bikes <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </W>

        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: `linear-gradient(to top,${T.bgBase},transparent)`, pointerEvents: "none" }} />
      </section>

      <SectionDivider />

      {/* ══════════════════════════════════════════════════════════════════════
          2. TRUST BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: T.bgSurface, position: "relative", overflow: "hidden" }}>
        {/* Subtle diagonal lines pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(74,222,128,0.02) 35px, rgba(74,222,128,0.02) 70px)",
          pointerEvents: "none",
        }} />
        {/* Small glow accent */}
        <div style={{
          position: "absolute", top: "50%", right: "10%",
          width: 200, height: 200,
          background: "rgba(74,222,128,0.04)", borderRadius: "50%",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <W style={{ position: "relative", zIndex: 1 }}>
          <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            {trust.map((item, i) => (
              <div
                key={item.title}
                className={`fade-up stagger-${i + 1}`}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "26px 22px",
                  borderRight: i < 3 ? `1px solid ${T.border}` : "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(74,222,128,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{
                  width: 50, height: 50, flexShrink: 0,
                  background: "rgba(74,222,128,0.1)", color: T.green,
                  borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${T.borderMid}`,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: T.textMain, marginBottom: 3 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: T.textMuted }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </W>
      </section>

      <SectionDivider bg={T.bgSurface} />

      {/* ══════════════════════════════════════════════════════════════════════
          3. CATEGORIES
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 0", background: T.bgBase, position: "relative", overflow: "hidden" }}>
        {/* Hexagon pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(74,222,128,0.03) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          pointerEvents: "none",
        }} />
        {/* Corner glow */}
        <div style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: 400, height: 400,
          background: "rgba(74,222,128,0.05)", borderRadius: "50%",
          filter: "blur(80px)", pointerEvents: "none",
        }} />
        <W style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
            <SectionHead label="Browse by Type" title="SHOP BY CATEGORY" />
            <Link to="/shop" className="btn-link">View All <ChevronRight size={15} /></Link>
          </div>
          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {cats.map((cat, index) => (
              <Link
                key={cat.label}
                to={cat.path}
                className={`hover-lift fade-up stagger-${index + 1}`}
                style={{
                  position: "relative", overflow: "hidden", borderRadius: 22,
                  aspectRatio: "3/4", display: "block", textDecoration: "none",
                  border: `1px solid ${T.border}`,
                  transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(74,222,128,0.55)";
                  e.currentTarget.style.boxShadow = "0 24px 60px rgba(74,222,128,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img
                  src={cat.img} alt={cat.label}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                  onMouseEnter={(e) => { e.target.style.transform = "scale(1.1)"; }}
                  onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
                  onError={(e) => { e.target.src = `https://placehold.co/300x400/0f2214/4ade80?text=${cat.label}`; }}
                />
                {/* Gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(5,20,10,0.95) 0%,rgba(5,20,10,0.3) 50%,transparent 100%)" }} />
                {/* Top shimmer */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(74,222,128,0.4),transparent)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 22px" }}>
                  <p style={{ color: T.green, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.24em", marginBottom: 6 }}>{cat.sub}</p>
                  <h3 style={{ color: T.textMain, fontSize: 20, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.05em" }}>{cat.label}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, color: T.green, fontSize: 12, fontWeight: 600 }}>
                    Shop now <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </W>
      </section>

      <SectionDivider />

      {/* ══════════════════════════════════════════════════════════════════════
          4. FEATURED PRODUCTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 0", background: T.bgSurface, position: "relative", overflow: "hidden" }}>
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(74,222,128,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />
        {/* Gradient orb - bottom right */}
        <div style={{
          position: "absolute", bottom: "-15%", right: "-8%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <W style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
            <SectionHead label="Hand-picked for you" title="FEATURED BIKES" />
            <Link to="/shop" className="btn-link">View All <ChevronRight size={15} /></Link>
          </div>
          <div className="prod-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
            {featured.map((p, index) => (
              <div key={p.id} className={`fade-up stagger-${(index % 4) + 1}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link to="/shop" className="btn-primary" style={{ fontSize: 14, padding: "15px 48px", letterSpacing: "0.05em" }}>
              Load More Products <ArrowRight size={16} />
            </Link>
          </div>
        </W>
      </section>

      <SectionDivider bg={T.bgSurface} />

      {/* ══════════════════════════════════════════════════════════════════════
          5. E-BIKES BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", padding: "110px 0", overflow: "hidden" }}>
        {/* BG image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://hotwheelsbikes.com/wp-content/uploads/2025/01/81e-efWTckL.jpg')",
          backgroundSize: "cover", backgroundPosition: "center right",
        }} />
        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg,rgba(5,20,10,0.92) 0%,rgba(7,35,18,0.72) 45%,rgba(5,20,10,0.25) 100%)",
        }} />
        {/* Decorative vertical line */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "48%",
          width: 1, background: "linear-gradient(to bottom,transparent,rgba(74,222,128,0.2),transparent)",
          pointerEvents: "none",
        }} />

        <W style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.35)",
              color: T.green, fontSize: 11, fontWeight: 700,
              padding: "8px 18px", borderRadius: 99, marginBottom: 30,
              letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              <Zap size={11} /> Active Fullpower E-Bikes
            </div>
            <h2 style={{
              fontFamily: "'Rajdhani',sans-serif", fontWeight: 700,
              fontSize: "clamp(48px,6vw,80px)", color: T.textMain,
              lineHeight: 0.88, marginBottom: 24, letterSpacing: "-0.01em",
            }}>
              POWER YOUR<br />
              <span style={{ color: T.green }}>RIDE.</span>
            </h2>
            <p style={{ color: T.textBody, fontSize: 16, lineHeight: 1.8, marginBottom: 44, maxWidth: 480 }}>
              Experience the future of cycling with our electric bike lineup. Built for performance, designed for everyone.
            </p>
            {/* Feature pills */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
              {["1200W Motor", "48V Battery", "40km Range", "Anti-theft"].map((f) => (
                <span key={f} style={{
                  fontSize: 12, fontWeight: 600, color: T.textBody,
                  background: "rgba(74,222,128,0.1)", border: `1px solid ${T.border}`,
                  padding: "6px 14px", borderRadius: 99,
                }}>
                  {f}
                </span>
              ))}
            </div>
            <Link to="/shop?category=ELECTRIC+BIKES" className="btn-primary" style={{ fontSize: 14, padding: "15px 38px", boxShadow: "0 0 40px rgba(74,222,128,0.45)" }}>
              Explore E-Bikes <ArrowRight size={16} />
            </Link>
          </div>
        </W>
      </section>

      <SectionDivider />

      {/* ══════════════════════════════════════════════════════════════════════
          6. ACCESSORIES MARQUEE
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 0", background: T.bgBase, overflow: "hidden", position: "relative" }}>
        {/* Wavy lines pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(74,222,128,0.015) 50px, rgba(74,222,128,0.015) 51px)`,
          pointerEvents: "none",
        }} />
        {/* Dual glows */}
        <div style={{
          position: "absolute", top: "30%", left: "20%",
          width: 300, height: 300,
          background: "rgba(34,197,94,0.04)", borderRadius: "50%",
          filter: "blur(70px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "25%",
          width: 250, height: 250,
          background: "rgba(74,222,128,0.05)", borderRadius: "50%",
          filter: "blur(65px)", pointerEvents: "none",
        }} />
        <W style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionHead label="Gear Up" title="OUR LATEST ACCESSORIES" center />
            <p style={{ color: T.textMuted, fontSize: 15, marginTop: 16, maxWidth: 520, margin: "16px auto 0" }}>
              Complete your ride with premium accessories — lights, helmets, bags, bottles and more.
            </p>
          </div>
        </W>
        <div style={{ position: "relative" }}>
          {/* Edge fades */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to right,${T.bgBase},transparent)`, zIndex: 10, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to left,${T.bgBase},transparent)`, zIndex: 10, pointerEvents: "none" }} />
          <div className="animate-marquee" style={{ display: "flex", gap: 24, width: "max-content" }}>
            {[...accessories, ...accessories].map((acc, i) => (
              <div
                key={i}
                className="hover-lift"
                style={{
                  flexShrink: 0, width: 280,
                  background: T.bgRaised, border: `1px solid ${T.border}`,
                  borderRadius: 20, overflow: "hidden",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.borderMid;
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(74,222,128,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  height: 200,
                  background: T.bgSurface,
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                }}>
                  <img
                    src={acc.image}
                    alt={acc.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s",
                    }}
                    onMouseEnter={(e) => { e.target.style.transform = "scale(1.08)"; }}
                    onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
                    onError={(e) => {
                      console.error('Image failed to load:', acc.image);
                      e.target.style.display = 'block';
                      e.target.src = `https://placehold.co/400x300/132a18/4ade80?text=${encodeURIComponent(acc.name.replace(/\s+/g, '+'))}`;
                    }}
                  />

                  {/* Decorative gradient overlay */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 0%, rgba(15,34,20,0.4) 100%)",
                    pointerEvents: "none",
                  }} />
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <p style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.textBody,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 8,
                  }}>
                    {acc.name}
                  </p>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: T.green,
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    <span>Shop Now</span>
                    <span style={{ fontSize: 10 }}>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <Link to="/shop?category=ACCESSORIES" className="btn-primary" style={{ fontSize: 14, padding: "15px 40px" }}>
            View All Accessories <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════════════════════════════════════════════════════════════════
          7. WHY CHOOSE US
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 0", background: T.bgSurface, position: "relative", overflow: "hidden" }}>
        {/* Radial dots pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(74,222,128,0.04) 1px, transparent 0)`,
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }} />
        {/* Center glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <W style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionHead label="Recognition" title="WHY CHOOSE US" center />
          </div>
          <div className="award-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {[
              {
                icon: <Trophy size={40} />,
                title: "Xtreme Sports",
                desc: "Recognized for offering premium-quality bicycles and outstanding customer service across Pakistan.",
                featured: false,
              },
              {
                icon: <Award size={40} />,
                title: "Excellence Award",
                desc: "Honored for our extensive range of high-performance cycling accessories and unmatched variety.",
                featured: true,
              },
              {
                icon: <Heart size={40} />,
                title: "Customer Choice",
                desc: "Voted as the most trusted online bicycle store by cycling enthusiasts nationwide.",
                featured: false,
              },
            ].map((a, index) => (
              <div
                key={a.title}
                className={`scale-in stagger-${index + 1}`}
                style={{
                  padding: 44, borderRadius: 24,
                  border: a.featured ? `2px solid ${T.green}` : `1px solid ${T.borderMid}`,
                  background: a.featured ? T.green : T.bgRaised,
                  transition: "transform 0.28s, box-shadow 0.28s",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = a.featured
                    ? "0 0 60px rgba(74,222,128,0.55)"
                    : "0 16px 50px rgba(74,222,128,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Decorative corner accent for non-featured */}
                {!a.featured && (
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    width: 80, height: 80,
                    background: "radial-gradient(circle at top right,rgba(74,222,128,0.08),transparent 70%)",
                    pointerEvents: "none",
                  }} />
                )}
                <div style={{ marginBottom: 24, lineHeight: 1, color: a.featured ? "#000" : T.green }}>{a.icon}</div>
                <h3 style={{
                  fontSize: 24, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif",
                  marginBottom: 14, letterSpacing: "0.02em",
                  color: a.featured ? "#000" : T.textMain,
                }}>
                  {a.title}
                </h3>
                <p style={{
                  fontSize: 14, lineHeight: 1.7,
                  color: a.featured ? "rgba(0,0,0,0.72)" : T.textMuted,
                }}>
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </W>
      </section>

      <SectionDivider bg={T.bgSurface} />

      {/* ══════════════════════════════════════════════════════════════════════
          8. ABOUT SNIPPET
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 0", background: T.bgBase, position: "relative", overflow: "hidden" }}>
        {/* Crosshatch pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(45deg, rgba(74,222,128,0.02) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(74,222,128,0.02) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(74,222,128,0.02) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(74,222,128,0.02) 75%)
          `,
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 0 30px, 30px -30px, -30px 0px",
          pointerEvents: "none",
        }} />
        {/* Left side glow */}
        <div style={{
          position: "absolute", top: "20%", left: "-10%",
          width: 450, height: 450,
          background: "rgba(74,222,128,0.06)", borderRadius: "50%",
          filter: "blur(90px)", pointerEvents: "none",
        }} />
        <W style={{ position: "relative", zIndex: 1 }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            {/* Text col */}
            <div>
              <p style={{ color: T.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: 18 }}>Since 1990</p>
              <h2 style={{
                color: T.textMain, fontSize: "clamp(30px,4vw,48px)", fontWeight: 700,
                fontFamily: "'Rajdhani',sans-serif", marginBottom: 24,
                lineHeight: 1.06, letterSpacing: "0.02em",
              }}>
                MEET THE PEOPLE CHANGING THE WORLD WITH BIKES
              </h2>
              <p style={{ color: T.textMuted, fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
                Established in 1990, Hot Wheels Bikes is dedicated to the development, production, and distribution of complete bicycles. We bring the joy of riding to everyone through continuous innovation.
              </p>
              <p style={{ color: T.textMuted, fontSize: 15, lineHeight: 1.9, marginBottom: 40 }}>
                From kids' first bikes to professional-grade mountain and road bikes, our curated range ensures every rider finds their perfect match.
              </p>
              {/* Mini stats */}
              <div style={{ display: "flex", gap: 32, marginBottom: 40, paddingBottom: 40, borderBottom: `1px solid ${T.border}` }}>
                {[
                  { icon: <Clock size={16} />, v: "35+", l: "Years of Trust" },
                  { icon: <Users size={16} />, v: "10K+", l: "Happy Riders" },
                  { icon: <Award size={16} />, v: "3", l: "Industry Awards" },
                ].map((s) => (
                  <div key={s.l} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ color: T.green, marginTop: 4 }}>{s.icon}</div>
                    <div>
                      <p style={{ fontSize: 26, fontWeight: 900, color: T.textMain, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1 }}>{s.v}</p>
                      <p style={{ fontSize: 11, color: T.textMuted, marginTop: 4, letterSpacing: "0.08em" }}>{s.l}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-primary" style={{ fontSize: 14, padding: "14px 32px" }}>
                Read Our Story <ArrowRight size={15} />
              </Link>
            </div>

            {/* Image col */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <img
                src="https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-32.png"
                alt="Hot Wheels Bikes store"
                style={{ borderRadius: 20, width: "100%", height: 230, objectFit: "cover", border: `1px solid ${T.border}` }}
                onError={(e) => { e.target.src = "https://placehold.co/300x230/0f2214/4ade80?text=HotWheels"; }}
              />
              <img
                src="https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-31.png"
                alt="Hot Wheels Bikes team"
                style={{ borderRadius: 20, width: "100%", height: 230, objectFit: "cover", marginTop: 40, border: `1px solid ${T.border}` }}
                onError={(e) => { e.target.src = "https://placehold.co/300x230/0f2214/4ade80?text=Bikes"; }}
              />
            </div>
          </div>
        </W>
      </section>

      <SectionDivider />

      {/* ══════════════════════════════════════════════════════════════════════
          9. CTA STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", padding: "100px 0", overflow: "hidden" }}>
        {/* Layered background */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${T.bgSurface} 0%,#14532d 50%,${T.bgSurface} 100%)` }} />
        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "-35%", left: "8%", width: 560, height: 560, background: "rgba(74,222,128,0.09)", borderRadius: "50%", filter: "blur(110px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-35%", right: "8%", width: 440, height: 440, background: "rgba(34,197,94,0.07)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)",
          backgroundSize: "52px 52px", pointerEvents: "none",
        }} />
        {/* Top border accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${T.green},transparent)` }} />

        <W style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.35)",
              color: T.green, fontSize: 11, fontWeight: 700,
              padding: "8px 18px", borderRadius: 99, marginBottom: 26,
              letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              <span style={{ width: 6, height: 6, background: T.green, borderRadius: "50%", boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
              Limited Time Offer
            </div>
            <h2 style={{
              color: T.textMain, fontSize: "clamp(30px,4.5vw,56px)", fontWeight: 700,
              fontFamily: "'Rajdhani',sans-serif", marginBottom: 18,
              letterSpacing: "0.02em", lineHeight: 1.08,
            }}>
              READY TO FIND YOUR<br />
              <span style={{ color: T.green }}>PERFECT RIDE?</span>
            </h2>
            <p style={{ color: T.textMuted, fontSize: 17, maxWidth: 500, margin: "0 auto 44px", lineHeight: 1.7 }}>
              Browse 500+ bikes across all categories. Free delivery above ₨ 5,000.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }} className="cta-buttons">
              <Link to="/shop" className="btn-primary" style={{ fontSize: 15, padding: "15px 48px" }}>
                Shop All Bikes <ArrowRight size={17} />
              </Link>
              <Link to="/contact" className="btn-outline" style={{ fontSize: 15, padding: "15px 48px" }}>
                Contact Us
              </Link>
            </div>
          </div>
        </W>
      </section>

    </div>
  );
}
