import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { formatPrice } from "../data/products";
import {
  ArrowLeft, ShoppingBag, User, MapPin, CreditCard,
  Truck, CheckCircle, Package, Upload, Copy, Check,
  Banknote, Building2, Smartphone, Wallet, Lock, RotateCcw, Phone, AlertTriangle
} from "lucide-react";
import { useWindowWidth } from "../hooks/useWindowWidth";

const API = "/api";

const S = {
  page: { minHeight: "100vh", background: "#0b1a0e", padding: "40px 24px" },
  wrap: { maxWidth: 1100, margin: "0 auto" },
  card: { background: "#0f2214", border: "1px solid rgba(74,222,128,0.12)", borderRadius: 20, padding: "24px 28px" },
  label: { display: "block", fontSize: 11, fontWeight: 700, color: "#86efac", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" },
  input: { width: "100%", background: "#0b1a0e", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 12, padding: "12px 16px", color: "#f0fdf4", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" },
  title: { color: "#f0fdf4", fontWeight: 700, fontSize: 15, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 },
  icon: { width: 30, height: 30, borderRadius: 8, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center" },
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={copy}
      style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#4ade80" : "rgba(134,239,172,0.4)", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, padding: "2px 6px" }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(11,26,14,0.6)", borderRadius: 8, marginBottom: 6 }}>
      <span style={{ color: "rgba(134,239,172,0.5)", fontSize: 12 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ color: "#f0fdf4", fontSize: 13, fontWeight: 700 }}>{value}</span>
        <CopyBtn text={value} />
      </div>
    </div>
  );
}

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const fileRef = useRef();
  const width = useWindowWidth();
  const isMobile = width < 768;

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", postalCode: "",
    paymentMethod: "cod", notes: "",
  });
  const [paySettings, setPaySettings] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const shippingCost = 200;
  const total = cartTotal + shippingCost;
  const inp = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Load payment settings from backend
  useEffect(() => {
    fetch(`${API}/payment/settings`)
      .then(r => r.json())
      .then(d => setPaySettings(d))
      .catch(() => { });
  }, []);

  // Auto-fill from logged in user
  useEffect(() => {
    if (user) setForm(f => ({
      ...f,
      name: user.name || f.name,
      email: user.email || f.email,
      phone: user.phone || f.phone,
      address: user.address || f.address,
      city: user.city || f.city,
    }));
  }, [user]);

  const inputStyle = (name) => ({
    ...S.input,
    borderColor: focused === name ? "rgba(74,222,128,0.5)" : "rgba(74,222,128,0.15)",
    boxShadow: focused === name ? "0 0 0 3px rgba(74,222,128,0.08)" : "none",
  });

  // Build available payment methods
  const PAYMENT_OPTIONS = [
    paySettings?.codEnabled !== false && { value: "cod", label: "Cash on Delivery", icon: <Banknote size={22} />, desc: "Pay when delivered" },
    paySettings?.bankEnabled !== false && { value: "bank_transfer", label: "Bank Transfer", icon: <Building2 size={22} />, desc: "Direct bank deposit" },
    paySettings?.jazzcashEnabled !== false && { value: "jazzcash", label: "JazzCash", icon: <Smartphone size={22} />, desc: "Mobile wallet" },
    paySettings?.easypaisaEnabled !== false && { value: "easypaisa", label: "EasyPaisa", icon: <Wallet size={22} />, desc: "Mobile wallet" },
    paySettings?.stripeEnabled && { value: "stripe", label: "Card (Stripe)", icon: <CreditCard size={22} />, desc: "Visa / Mastercard" },
  ].filter(Boolean);

  const needsScreenshot = ["bank_transfer", "jazzcash", "easypaisa"].includes(form.paymentMethod);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (needsScreenshot && !screenshot) {
      return setError("Please upload payment screenshot before placing order.");
    }
    setError(""); setLoading(true);

    try {
      const orderItems = cartItems.map(item => ({
        product: item._id || String(item.id),
        name: item.name + (item.selectedColor ? ` (${item.selectedColor}${item.selectedSize ? "/" + item.selectedSize : ""})` : ""),
        price: item.salePrice,
        quantity: item.quantity,
      }));

      const res = await fetch(`${API}/orders`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone, address: `${form.address}, ${form.city}${form.postalCode ? " - " + form.postalCode : ""}` },
          items: orderItems, paymentMethod: form.paymentMethod, shippingCost, notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order failed");

      // Upload screenshot if needed
      if (needsScreenshot && screenshot) {
        const fd = new FormData();
        fd.append("screenshot", screenshot);
        await fetch(`${API}/payment/screenshot/${data.order._id}`, { method: "POST", body: fd });
      }

      clearCart();
      navigate("/order-confirmation", { state: { order: data.order, orderNumber: data.orderNumber } });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b1a0e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <ShoppingBag size={56} style={{ color: "rgba(74,222,128,0.3)" }} />
        <h2 style={{ color: "#f0fdf4", fontSize: 22, fontWeight: 700 }}>Your cart is empty</h2>
        <Link to="/shop" style={{ padding: "12px 32px", background: "#4ade80", color: "#000", borderRadius: 12, fontWeight: 700, textDecoration: "none" }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32, gap: 16 }}>
          <Link to="/shop" style={{ display: "flex", alignItems: "center", gap: 6, color: "#4ade80", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
            <ArrowLeft size={15} /> Back to Shop
          </Link>
          <div style={{ flex: 1, height: 1, background: "rgba(74,222,128,0.08)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Package size={18} style={{ color: "#4ade80" }} />
            <h1 style={{ color: "#f0fdf4", fontWeight: 800, fontSize: 22, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.06em" }}>CHECKOUT</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 400px", gap: 24, alignItems: "start" }}>

            {/* ── LEFT ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Customer Info */}
              <div style={S.card}>
                <p style={S.title}><span style={S.icon}><User size={14} style={{ color: "#4ade80" }} /></span> Customer Information</p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={S.label}>Full Name *</label>
                    <input value={form.name} onChange={e => inp("name", e.target.value)} required placeholder="Ahmed Khan"
                      style={inputStyle("name")} onFocus={() => setFocused("name")} onBlur={() => setFocused("")} />
                  </div>
                  <div>
                    <label style={S.label}>Phone *</label>
                    <input value={form.phone} onChange={e => inp("phone", e.target.value)} required placeholder="+92 300 0000000"
                      style={inputStyle("phone")} onFocus={() => setFocused("phone")} onBlur={() => setFocused("")} />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={S.label}>Email <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                    <input type="email" value={form.email} onChange={e => inp("email", e.target.value)} placeholder="ahmed@email.com"
                      style={inputStyle("email")} onFocus={() => setFocused("email")} onBlur={() => setFocused("")} />
                    <p style={{ fontSize: 11, color: "rgba(74,222,128,0.6)", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle size={11} /> Email dene par aapka account automatically create ho ga aur order confirmation bhi milega.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div style={S.card}>
                <p style={S.title}><span style={S.icon}><MapPin size={14} style={{ color: "#4ade80" }} /></span> Delivery Address</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={S.label}>Street Address *</label>
                    <input value={form.address} onChange={e => inp("address", e.target.value)} required placeholder="House #, Street, Area"
                      style={inputStyle("address")} onFocus={() => setFocused("address")} onBlur={() => setFocused("")} />
                  </div>
                  <div>
                    <label style={S.label}>City *</label>
                    <input value={form.city} onChange={e => inp("city", e.target.value)} required placeholder="Karachi"
                      style={inputStyle("city")} onFocus={() => setFocused("city")} onBlur={() => setFocused("")} />
                  </div>
                  <div>
                    <label style={S.label}>Postal Code</label>
                    <input value={form.postalCode} onChange={e => inp("postalCode", e.target.value)} placeholder="75500"
                      style={inputStyle("postalCode")} onFocus={() => setFocused("postalCode")} onBlur={() => setFocused("")} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div style={S.card}>
                <p style={S.title}><span style={S.icon}><CreditCard size={14} style={{ color: "#4ade80" }} /></span> Payment Method</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
                  {PAYMENT_OPTIONS.map(({ value, label, icon, desc }) => {
                    const active = form.paymentMethod === value;
                    return (
                      <button key={value} type="button" onClick={() => inp("paymentMethod", value)}
                        style={{ padding: "14px 10px", borderRadius: 14, cursor: "pointer", textAlign: "left", border: active ? "1.5px solid rgba(74,222,128,0.5)" : "1px solid rgba(74,222,128,0.1)", background: active ? "rgba(74,222,128,0.08)" : "rgba(11,26,14,0.6)", transition: "all 0.18s" }}>
                        <div style={{ marginBottom: 6, color: active ? "#4ade80" : "#86efac" }}>{icon}</div>
                        <p style={{ color: active ? "#4ade80" : "#f0fdf4", fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{label}</p>
                        <p style={{ color: "#86efac", fontSize: 10, opacity: 0.6 }}>{desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* COD info */}
                {form.paymentMethod === "cod" && (
                  <div style={{ padding: "14px 16px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.12)", borderRadius: 12 }}>
                    <p style={{ color: "#4ade80", fontWeight: 700, fontSize: 13, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><Banknote size={14} /> Cash on Delivery</p>
                    <p style={{ color: "rgba(134,239,172,0.6)", fontSize: 12 }}>Pay in cash when your order arrives. Our delivery team will collect payment.</p>
                  </div>
                )}

                {/* Bank Transfer */}
                {form.paymentMethod === "bank_transfer" && paySettings && (
                  <div style={{ padding: "16px", background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)", borderRadius: 12 }}>
                    <p style={{ color: "#4ade80", fontWeight: 700, fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Building2 size={14} /> Bank Transfer Details</p>
                    {paySettings.bankName && <InfoRow label="Bank" value={paySettings.bankName} />}
                    {paySettings.bankAccountName && <InfoRow label="Account Name" value={paySettings.bankAccountName} />}
                    {paySettings.bankAccountNo && <InfoRow label="Account Number" value={paySettings.bankAccountNo} />}
                    {paySettings.bankIBAN && <InfoRow label="IBAN" value={paySettings.bankIBAN} />}
                    <InfoRow label="Amount to Transfer" value={formatPrice(total)} />
                    <div style={{ marginTop: 14 }}>
                      <label style={S.label}>Upload Payment Screenshot *</label>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => setScreenshot(e.target.files[0])} />
                      <button type="button" onClick={() => fileRef.current.click()}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 10, color: "#4ade80", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                        <Upload size={14} /> {screenshot ? `\u2713 ${screenshot.name}` : "Upload Screenshot"}
                      </button>
                    </div>
                  </div>
                )}

                {/* JazzCash */}
                {form.paymentMethod === "jazzcash" && paySettings && (
                  <div style={{ padding: "16px", background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)", borderRadius: 12 }}>
                    <p style={{ color: "#4ade80", fontWeight: 700, fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Smartphone size={14} /> JazzCash Details</p>
                    {paySettings.jazzcashNumber && <InfoRow label="JazzCash Number" value={paySettings.jazzcashNumber} />}
                    {paySettings.jazzcashName && <InfoRow label="Account Name" value={paySettings.jazzcashName} />}
                    <InfoRow label="Amount to Send" value={formatPrice(total)} />
                    <p style={{ color: "rgba(134,239,172,0.5)", fontSize: 11, margin: "10px 0" }}>
                      Send money to the above number via JazzCash app, then upload screenshot below.
                    </p>
                    <div style={{ marginTop: 10 }}>
                      <label style={S.label}>Upload Payment Screenshot *</label>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => setScreenshot(e.target.files[0])} />
                      <button type="button" onClick={() => fileRef.current.click()}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 10, color: "#4ade80", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                        <Upload size={14} /> {screenshot ? `\u2713 ${screenshot.name}` : "Upload Screenshot"}
                      </button>
                    </div>
                  </div>
                )}

                {/* EasyPaisa */}
                {form.paymentMethod === "easypaisa" && paySettings && (
                  <div style={{ padding: "16px", background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)", borderRadius: 12 }}>
                    <p style={{ color: "#4ade80", fontWeight: 700, fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Wallet size={14} /> EasyPaisa Details</p>
                    {paySettings.easypaisaNumber && <InfoRow label="EasyPaisa Number" value={paySettings.easypaisaNumber} />}
                    {paySettings.easypaisaName && <InfoRow label="Account Name" value={paySettings.easypaisaName} />}
                    <InfoRow label="Amount to Send" value={formatPrice(total)} />
                    <p style={{ color: "rgba(134,239,172,0.5)", fontSize: 11, margin: "10px 0" }}>
                      Send money via EasyPaisa app or *786#, then upload screenshot below.
                    </p>
                    <div style={{ marginTop: 10 }}>
                      <label style={S.label}>Upload Payment Screenshot *</label>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => setScreenshot(e.target.files[0])} />
                      <button type="button" onClick={() => fileRef.current.click()}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 10, color: "#4ade80", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                        <Upload size={14} /> {screenshot ? `\u2713 ${screenshot.name}` : "Upload Screenshot"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Stripe */}
                {form.paymentMethod === "stripe" && (
                  <div style={{ padding: "14px 16px", background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 12 }}>
                    <p style={{ color: "#60a5fa", fontWeight: 700, fontSize: 13, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}><CreditCard size={14} /> Card Payment via Stripe</p>
                    <p style={{ color: "rgba(134,239,172,0.5)", fontSize: 12 }}>
                      You will be redirected to secure Stripe payment after placing order. Accepts Visa, Mastercard, and international cards.
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div style={S.card}>
                <label style={S.label}>Order Notes <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                <textarea value={form.notes} onChange={e => inp("notes", e.target.value)} rows={3}
                  placeholder="Any special instructions for delivery..."
                  style={{ ...inputStyle("notes"), resize: "vertical" }}
                  onFocus={() => setFocused("notes")} onBlur={() => setFocused("")} />
              </div>
            </div>

            {/* ── RIGHT — Order Summary ── */}
            <div style={{ position: isMobile ? "static" : "sticky", top: 24 }}>
              <div style={S.card}>
                <p style={S.title}>
                  <span style={S.icon}><ShoppingBag size={14} style={{ color: "#4ade80" }} /></span>
                  Order Summary
                  <span style={{ marginLeft: "auto", background: "rgba(74,222,128,0.1)", color: "#4ade80", borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                    {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
                  </span>
                </p>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                  {cartItems.map(item => (
                    <div key={item.cartKey} style={{ display: "flex", gap: 10, padding: "10px", background: "rgba(11,26,14,0.6)", borderRadius: 10, border: "1px solid rgba(74,222,128,0.06)" }}>
                      <div style={{ width: 52, height: 52, borderRadius: 9, overflow: "hidden", background: "#0b1a0e", border: "1px solid rgba(74,222,128,0.1)", flexShrink: 0 }}>
                        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => e.target.src = "https://placehold.co/52x52/0b1a0e/4ade80?text=Bike"} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#f0fdf4", fontSize: 12, fontWeight: 600, lineHeight: 1.4, marginBottom: 2 }}>{item.name}</p>
                        {item.selectedColor && <p style={{ color: "#86efac", fontSize: 10, opacity: 0.6 }}>{item.selectedColor}{item.selectedSize ? ` / ${item.selectedSize}` : ""}</p>}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
                          <span style={{ color: "#86efac", fontSize: 11, background: "rgba(74,222,128,0.08)", padding: "2px 7px", borderRadius: 5 }}>× {item.quantity}</span>
                          <span style={{ color: "#4ade80", fontSize: 13, fontWeight: 800 }}>{formatPrice(item.salePrice * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ borderTop: "1px solid rgba(74,222,128,0.08)", paddingTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#86efac", fontSize: 13 }}>Subtotal</span>
                    <span style={{ color: "#f0fdf4", fontSize: 13, fontWeight: 600 }}>{formatPrice(cartTotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                    <span style={{ color: "#86efac", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}><Truck size={12} /> Shipping</span>
                    <span style={{ color: "#f0fdf4", fontSize: 13, fontWeight: 600 }}>{formatPrice(shippingCost)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid rgba(74,222,128,0.08)", marginTop: 4 }}>
                    <span style={{ color: "#f0fdf4", fontWeight: 800, fontSize: 16 }}>Total</span>
                    <span style={{ color: "#4ade80", fontWeight: 900, fontSize: 22, fontFamily: "'Rajdhani',sans-serif" }}>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{ marginTop: 14, padding: "11px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, color: "#f87171", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertTriangle size={14} /> {error}
                  </div>
                )}

                {/* Place Order */}
                <button type="submit" disabled={loading}
                  style={{ marginTop: 16, width: "100%", padding: "14px", borderRadius: 13, border: "none", background: loading ? "rgba(74,222,128,0.5)" : "linear-gradient(135deg,#16a34a,#4ade80)", color: "#000", fontWeight: 900, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.04em" }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.9" }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1" }}>
                  {loading
                    ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,0.2)", borderTop: "2px solid #000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Placing Order...</>
                    : <><CheckCircle size={17} /> Place Order — {formatPrice(total)}</>}
                </button>

                <p style={{ textAlign: "center", fontSize: 11, color: "rgba(134,239,172,0.4)", marginTop: 10 }}>
                  By placing order you agree to our{" "}
                  <Link to="/terms-and-conditions" style={{ color: "rgba(74,222,128,0.6)", textDecoration: "none" }}>Terms & Conditions</Link>
                </p>

                {/* Trust Badges */}
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                  {[
                    [<Lock size={13} />, "Secure Checkout"],
                    [<Truck size={13} />, "Fast Delivery"],
                    [<RotateCcw size={13} />, "Easy Returns"],
                    [<Phone size={13} />, "24/7 Support"],
                  ].map(([icon, text]) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 9px", background: "rgba(74,222,128,0.04)", borderRadius: 8, border: "1px solid rgba(74,222,128,0.06)" }}>
                      <span style={{ color: "#4ade80" }}>{icon}</span>
                      <span style={{ color: "#86efac", fontSize: 10, fontWeight: 600 }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
