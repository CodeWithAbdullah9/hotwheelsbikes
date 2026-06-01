import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle, Clock, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const T = {
  bgBase:    "#0b1a0e",
  bgSurface: "#0f2214",
  bgRaised:  "#132a18",
  green:     "#4ade80",
  greenMid:  "#22c55e",
  textMain:  "#f0fdf4",
  textBody:  "#d1fae5",
  textMuted: "#86efac",
  border:    "rgba(74,222,128,0.15)",
  borderMid: "rgba(74,222,128,0.25)",
};

export default function Contact() {
  const [form,      setForm]      = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.phone.trim())   e.phone   = "Phone number is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); setForm({ name: "", phone: "", message: "" }); }, 1200);
  };

  const contactCards = [
    { icon: <Phone size={20} />,  title: "Phone",    value: "+0336 1320540",               href: "tel:+923361320540",                  desc: "Call us anytime" },
    { icon: <Mail size={20} />,   title: "Email",    value: "hotwheelsbicycles@gmail.com",  href: "mailto:hotwheelsbicycles@gmail.com", desc: "Reply within 24 hours" },
    { icon: <MapPin size={20} />, title: "Location", value: "DHA Phase 4, Karachi",          href: "#",                                  desc: "Visit our showroom" },
  ];

  return (
    <div style={{ background: T.bgBase, minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        {/* Background image - UNIQUE for Contact page */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://hotwheelsbikes.com/wp-content/uploads/2024/10/unnamed.png')",
          backgroundSize: "cover", backgroundPosition: "center 45%",
        }} />
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,20,10,0.65)" }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px", pointerEvents: "none",
        }} />
        {/* Glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600, height: 300,
          background: "rgba(74,222,128,0.06)", borderRadius: "50%",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: `linear-gradient(to top,${T.bgBase},transparent)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 32px 80px", position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.35)",
            color: T.green, fontSize: 11, fontWeight: 700,
            padding: "8px 18px", borderRadius: 99, marginBottom: 24,
            letterSpacing: "0.14em", textTransform: "uppercase",
          }} className="slide-down pulse-glow">
            <span style={{ width: 6, height: 6, background: T.green, borderRadius: "50%", boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
            We're Here to Help
          </div>
          <h1 style={{
            color: T.textMain, fontSize: "clamp(36px,5vw,68px)", fontWeight: 700,
            fontFamily: "'Rajdhani',sans-serif", marginBottom: 16,
            letterSpacing: "0.02em", lineHeight: 1,
          }} className="fade-up">
            CONTACT <span style={{ color: T.green }}>US</span>
          </h1>
          <p style={{ color: T.textBody, fontSize: 17, maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }} className="fade-up stagger-1">
            Connecting you to support for all your cycling queries and assistance.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 40, alignItems: "start" }} className="about-grid">

          {/* ── Left: info ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="slide-in-left">
            <div>
              <h2 style={{ color: T.textMain, fontSize: 26, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 8, letterSpacing: "0.02em" }}>TALK TO US</h2>
              <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.75 }}>Have a question about a bike, need help with an order, or just want to say hello? We are here for you.</p>
            </div>

            {contactCards.map((info, index) => (
              <a key={info.title} href={info.href}
                className={`hover-lift fade-up stagger-${index + 1}`}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  padding: "18px 20px", background: T.bgRaised,
                  border: `1px solid ${T.border}`, borderRadius: 18,
                  textDecoration: "none", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.boxShadow = "0 8px 30px rgba(74,222,128,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{
                  width: 46, height: 46, background: "rgba(74,222,128,0.1)", color: T.green,
                  borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, border: `1px solid ${T.borderMid}`,
                }}>
                  {info.icon}
                </div>
                <div>
                  <p style={{ color: T.textMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 3 }}>{info.title}</p>
                  <p style={{ color: T.textMain, fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{info.value}</p>
                  <p style={{ color: T.textMuted, fontSize: 12 }}>{info.desc}</p>
                </div>
              </a>
            ))}

            {/* Hours */}
            <div style={{ padding: "20px", background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, background: "rgba(74,222,128,0.1)",
                  borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${T.borderMid}`,
                }}>
                  <Clock size={15} style={{ color: T.green }} />
                </div>
                <h3 style={{ color: T.textMain, fontWeight: 700, fontSize: 14, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.08em" }}>BUSINESS HOURS</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { day: "Monday – Friday", hours: "9:00 AM – 7:00 PM", open: true },
                  { day: "Saturday",        hours: "10:00 AM – 6:00 PM", open: true },
                  { day: "Sunday",          hours: "Closed", open: false },
                ].map((h) => (
                  <div key={h.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: T.textMuted, fontSize: 13 }}>{h.day}</span>
                    <span style={{
                      fontWeight: 700, fontSize: 11, padding: "4px 10px", borderRadius: 8,
                      background: h.open ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
                      color: h.open ? T.green : "#f87171",
                      border: h.open ? `1px solid rgba(74,222,128,0.25)` : "1px solid rgba(239,68,68,0.2)",
                    }}>
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick shop CTA */}
            <Link to="/shop" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px", background: "rgba(74,222,128,0.08)",
              border: `1px solid ${T.borderMid}`, borderRadius: 14,
              color: T.green, fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = T.green; e.currentTarget.style.color = "#000"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.08)"; e.currentTarget.style.color = T.green; }}>
              Browse Our Bikes <ArrowRight size={15} />
            </Link>
          </div>

          {/* ── Right: form ── */}
          <div style={{
            background: T.bgRaised, border: "1px solid rgba(74,222,128,0.2)",
            borderRadius: 24, padding: "40px",
          }} className="slide-in-right">
            {submitted ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", textAlign: "center" }}>
                <div style={{
                  width: 80, height: 80, background: "rgba(74,222,128,0.1)",
                  border: `1px solid ${T.borderMid}`, borderRadius: 24,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
                }}>
                  <CheckCircle size={38} style={{ color: T.green }} />
                </div>
                <h3 style={{ color: T.textMain, fontSize: 26, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", marginBottom: 8, letterSpacing: "0.04em" }}>MESSAGE SENT!</h3>
                <p style={{ color: T.textMuted, marginBottom: 32, maxWidth: 320, fontSize: 14, lineHeight: 1.7 }}>Thank you for reaching out. We will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary" style={{ fontSize: 14, padding: "12px 32px" }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                  <div style={{
                    width: 42, height: 42, background: "rgba(74,222,128,0.1)",
                    border: `1px solid ${T.borderMid}`, borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <MessageSquare size={18} style={{ color: T.green }} />
                  </div>
                  <h2 style={{ color: T.textMain, fontSize: 20, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.04em" }}>HAVE ANY QUESTIONS? GET IN TOUCH</h2>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    { name: "name",  label: "Full Name",    type: "text", placeholder: "Enter your full name" },
                    { name: "phone", label: "Phone Number", type: "tel",  placeholder: "e.g. 0336 1234567" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.textBody, marginBottom: 8 }}>
                        {field.label} <span style={{ color: T.green }}>*</span>
                      </label>
                      <input type={field.type} name={field.name} value={form[field.name]}
                        onChange={handleChange} placeholder={field.placeholder}
                        style={{
                          width: "100%", padding: "13px 16px",
                          border: errors[field.name] ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(74,222,128,0.2)",
                          borderRadius: 12, fontSize: 14, color: T.textMain,
                          background: errors[field.name] ? "rgba(239,68,68,0.05)" : T.bgSurface,
                          outline: "none", transition: "border-color 0.2s",
                        }}
                        onFocus={e => e.target.style.borderColor = T.green}
                        onBlur={e => e.target.style.borderColor = errors[field.name] ? "rgba(239,68,68,0.5)" : "rgba(74,222,128,0.2)"} />
                      {errors[field.name] && <p style={{ color: "#f87171", fontSize: 12, marginTop: 6, fontWeight: 500 }}>{errors[field.name]}</p>}
                    </div>
                  ))}

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.textBody, marginBottom: 8 }}>
                      Message <span style={{ color: T.green }}>*</span>
                    </label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                      placeholder="Tell us about your query, the bike you're interested in, or anything else..."
                      style={{
                        width: "100%", padding: "13px 16px",
                        border: errors.message ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(74,222,128,0.2)",
                        borderRadius: 12, fontSize: 14, color: T.textMain,
                        background: errors.message ? "rgba(239,68,68,0.05)" : T.bgSurface,
                        outline: "none", resize: "none", transition: "border-color 0.2s",
                        fontFamily: "inherit",
                      }}
                      onFocus={e => e.target.style.borderColor = T.green}
                      onBlur={e => e.target.style.borderColor = errors.message ? "rgba(239,68,68,0.5)" : "rgba(74,222,128,0.2)"} />
                    {errors.message && <p style={{ color: "#f87171", fontSize: 12, marginTop: 6, fontWeight: 500 }}>{errors.message}</p>}
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary"
                    style={{
                      justifyContent: "center", width: "100%", padding: "15px",
                      opacity: loading ? 0.8 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.greenMid; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = T.green; }}>
                    {loading ? (
                      <>
                        <div style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        Sending...
                      </>
                    ) : (
                      <><Send size={15} /> Submit Message</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
