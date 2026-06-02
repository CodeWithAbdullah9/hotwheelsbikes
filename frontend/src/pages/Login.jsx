import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Bike } from "lucide-react";
import { useWindowWidth } from "../hooks/useWindowWidth";

const S = {
  page: { minHeight: "100vh", background: "#0b1a0e", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" },
  card: { width: "100%", maxWidth: 440, background: "#0f2214", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 24, padding: "36px 32px", position: "relative", zIndex: 1 },
  input: { width: "100%", background: "#0b1a0e", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 12, padding: "12px 16px", color: "#f0fdf4", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" },
  label: { display: "block", fontSize: 11, fontWeight: 700, color: "#86efac", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" },
  err: { padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, color: "#f87171", fontSize: 13, marginBottom: 16 },
};

export default function Login() {
  const { loginUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const width = useWindowWidth();
  const isMobile = width < 480;

  const [tab, setTab] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const inp = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputStyle = (name) => ({
    ...S.input,
    borderColor: focused === name ? "rgba(74,222,128,0.5)" : "rgba(74,222,128,0.15)",
    boxShadow: focused === name ? "0 0 0 3px rgba(74,222,128,0.08)" : "none",
  });

  // Email/Password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (tab === "register") {
        if (form.password !== form.confirmPassword)
          return setError("Passwords do not match");
        const { data } = await axios.post("/api/user/register", { name: form.name, email: form.email, password: form.password });
        loginUser(data.token, data.user);
      } else {
        const { data } = await axios.post("/api/user/login", { email: form.email, password: form.password });
        loginUser(data.token, data.user);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  // Google Login
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: () => {
      window.location.href = "/api/user/auth/google";
    },
    onError: () => setError("Google login failed"),
  });

  const handleGoogleClick = () => {
    window.location.href = "/api/user/auth/google";
  };

  return (
    <div style={S.page}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(74,222,128,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(74,222,128,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ ...S.card, padding: isMobile ? "28px 16px" : "36px 32px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#16a34a,#4ade80)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><Bike size={26} color="#000" /></div>
          <h1 style={{ color: "#f0fdf4", fontWeight: 800, fontSize: 22, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.06em" }}>
            HOT WHEELS <span style={{ color: "#4ade80" }}>BIKES</span>
          </h1>
          <p style={{ color: "rgba(134,239,172,0.5)", fontSize: 12, marginTop: 4 }}>
            {tab === "login" ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(11,26,14,0.8)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {["login", "register"].map(t => (
            <button key={t} type="button" onClick={() => { setTab(t); setError(""); }}
              style={{
                flex: 1, padding: "9px", borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.2s",
                background: tab === t ? "rgba(74,222,128,0.12)" : "transparent",
                color: tab === t ? "#4ade80" : "rgba(134,239,172,0.4)",
                boxShadow: tab === t ? "0 0 0 1px rgba(74,222,128,0.2)" : "none",
              }}>
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* Google Button */}
        <button type="button" onClick={handleGoogleClick}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(74,222,128,0.15)", background: "rgba(11,26,14,0.6)", color: "#f0fdf4", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20, transition: "border-color 0.2s, background 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.35)"; e.currentTarget.style.background = "rgba(74,222,128,0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.15)"; e.currentTarget.style.background = "rgba(11,26,14,0.6)"; }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(74,222,128,0.08)" }} />
          <span style={{ color: "rgba(134,239,172,0.3)", fontSize: 11, fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(74,222,128,0.08)" }} />
        </div>

        {/* Error */}
        {error && <div style={S.err}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {tab === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Full Name *</label>
              <div style={{ position: "relative" }}>
                <User size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(134,239,172,0.4)" }} />
                <input value={form.name} onChange={e => inp("name", e.target.value)} required placeholder="Ahmed Khan"
                  style={{ ...inputStyle("name"), paddingLeft: 38 }}
                  onFocus={() => setFocused("name")} onBlur={() => setFocused("")} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Email Address *</label>
            <div style={{ position: "relative" }}>
              <Mail size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(134,239,172,0.4)" }} />
              <input type="email" value={form.email} onChange={e => inp("email", e.target.value)} required placeholder="ahmed@email.com"
                style={{ ...inputStyle("email"), paddingLeft: 38 }}
                onFocus={() => setFocused("email")} onBlur={() => setFocused("")} />
            </div>
          </div>

          <div style={{ marginBottom: tab === "register" ? 16 : 24 }}>
            <label style={S.label}>Password *</label>
            <div style={{ position: "relative" }}>
              <Lock size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(134,239,172,0.4)" }} />
              <input type={showPw ? "text" : "password"} value={form.password} onChange={e => inp("password", e.target.value)} required placeholder="Min 6 characters"
                style={{ ...inputStyle("password"), paddingLeft: 38, paddingRight: 42 }}
                onFocus={() => setFocused("password")} onBlur={() => setFocused("")} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(134,239,172,0.4)", cursor: "pointer", display: "flex" }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {tab === "register" && (
            <div style={{ marginBottom: 24 }}>
              <label style={S.label}>Confirm Password *</label>
              <div style={{ position: "relative" }}>
                <Lock size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(134,239,172,0.4)" }} />
                <input type={showPw ? "text" : "password"} value={form.confirmPassword} onChange={e => inp("confirmPassword", e.target.value)} required placeholder="Repeat password"
                  style={{ ...inputStyle("confirmPassword"), paddingLeft: 38 }}
                  onFocus={() => setFocused("confirmPassword")} onBlur={() => setFocused("")} />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#16a34a,#4ade80)", color: "#000", fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.04em" }}>
            {loading ? (
              <span style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,0.2)", borderTop: "2px solid #000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            ) : (
              <>{tab === "login" ? "Sign In" : "Create Account"} <ArrowRight size={15} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, color: "rgba(134,239,172,0.4)", fontSize: 12 }}>
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: "#4ade80", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
            {tab === "login" ? "Register" : "Sign In"}
          </button>
        </p>

        <p style={{ textAlign: "center", marginTop: 12 }}>
          <Link to="/" style={{ color: "rgba(134,239,172,0.3)", fontSize: 11, textDecoration: "none" }}>← Back to Store</Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
