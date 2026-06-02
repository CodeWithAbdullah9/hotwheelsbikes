import { useState, useEffect } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle, Package, MapPin, Phone, Mail, ArrowRight, Home, Truck, User, RefreshCw, Banknote, CreditCard, Smartphone, DollarSign, ClipboardList, Settings2, Check, XCircle } from "lucide-react";
import { formatPrice } from "../data/products";
import axios from "axios";
import { useWindowWidth } from "../hooks/useWindowWidth";

const S = {
  page: { minHeight: "100vh", background: "#0b1a0e", padding: "48px 24px" },
  wrap: { maxWidth: 760, margin: "0 auto" },
  card: { background: "#0f2214", border: "1px solid rgba(74,222,128,0.12)", borderRadius: 20, padding: "24px 28px", marginBottom: 16 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label: { color: "#86efac", fontSize: 12 },
  value: { color: "#f0fdf4", fontSize: 13, fontWeight: 600 },
};

const PAYMENT_INFO = {
  cod: { label: "Cash on Delivery", icon: <Banknote size={28} />, color: "#fbbf24" },
  card: { label: "Card Payment", icon: <CreditCard size={28} />, color: "#60a5fa" },
  online: { label: "Online Transfer", icon: <Smartphone size={28} />, color: "#c084fc" },
  cash: { label: "Cash", icon: <DollarSign size={28} />, color: "#fbbf24" },
};

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: <ClipboardList size={18} /> },
  { key: "processing", label: "Processing", icon: <Settings2 size={18} /> },
  { key: "shipped", label: "Shipped", icon: <Truck size={18} /> },
  { key: "delivered", label: "Delivered", icon: <Check size={18} /> },
];

export default function OrderConfirmation() {
  const { state } = useLocation();
  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const width = useWindowWidth();
  const isMobile = width < 640;

  const fetchOrder = async () => {
    if (!order?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/orders/public/${order._id}`);
      setOrder(res.data);
      setLastFetch(new Date());
    } catch { /* fallback to state data */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!state?.order && !order) return <Navigate to="/" replace />;

  const currentStep = STATUS_STEPS.findIndex(s => s.key === order?.status);
  const pm = PAYMENT_INFO[order?.paymentMethod] || { label: order?.paymentMethod, icon: <DollarSign size={28} />, color: "#4ade80" };

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 20px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(74,222,128,0.08)", border: "2px solid rgba(74,222,128,0.2)", animation: "pulse 2s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: 6, borderRadius: "50%", background: "rgba(74,222,128,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={38} style={{ color: "#4ade80" }} />
            </div>
          </div>
          <h1 style={{ color: "#f0fdf4", fontWeight: 900, fontSize: 30, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.06em", marginBottom: 8 }}>ORDER CONFIRMED!</h1>
          <p style={{ color: "#86efac", fontSize: 14, marginBottom: 16, opacity: 0.7 }}>Thank you! We'll contact you shortly to confirm your order.</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 99 }}>
            <Package size={15} style={{ color: "#4ade80" }} />
            <span style={{ color: "#4ade80", fontWeight: 800, fontSize: 15, letterSpacing: "0.08em", fontFamily: "'Rajdhani',sans-serif" }}>{order?.orderNumber}</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={fetchOrder} disabled={loading}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "transparent", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 99, color: "rgba(134,239,172,0.5)", fontSize: 11, cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"; e.currentTarget.style.color = "#4ade80"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.15)"; e.currentTarget.style.color = "rgba(134,239,172,0.5)"; }}>
              <RefreshCw size={11} style={{ animation: loading ? "spin 0.7s linear infinite" : "none" }} />
              {loading ? "Refreshing..." : lastFetch ? `Updated ${lastFetch.toLocaleTimeString()}` : "Refresh Status"}
            </button>
          </div>
        </div>

        {/* Status Tracker */}
        <div style={S.card}>
          <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: 14, marginBottom: 24 }}>Order Status</p>
          <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
            <div style={{ position: "absolute", top: 20, left: "12.5%", right: "12.5%", height: 2, background: "rgba(74,222,128,0.08)", zIndex: 0 }} />
            <div style={{ position: "absolute", top: 20, left: "12.5%", height: 2, background: "#4ade80", zIndex: 1, width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 75)}%`, transition: "width 0.5s ease" }} />
            {STATUS_STEPS.map((step, i) => {
              const isActive = i === currentStep;
              const isDone = i < currentStep;
              return (
                <div key={step.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    border: isActive ? "2px solid #4ade80" : isDone ? "2px solid rgba(74,222,128,0.4)" : "2px solid rgba(74,222,128,0.1)",
                    background: isActive ? "rgba(74,222,128,0.15)" : isDone ? "rgba(74,222,128,0.08)" : "#0b1a0e",
                    boxShadow: isActive ? "0 0 16px rgba(74,222,128,0.3)" : "none", transition: "all 0.3s",
                    color: isActive ? "#4ade80" : isDone ? "rgba(74,222,128,0.6)" : "rgba(134,239,172,0.3)",
                  }}>{step.icon}</div>
                  <p style={{ fontSize: 11, fontWeight: 700, marginTop: 8, textAlign: "center", color: isActive ? "#4ade80" : isDone ? "rgba(74,222,128,0.6)" : "rgba(134,239,172,0.3)" }}>{step.label}</p>
                </div>
              );
            })}
          </div>
          {order?.status === "cancelled" && (
            <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
              <p style={{ color: "#f87171", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><XCircle size={14} /> Order Cancelled{order.cancelReason ? ` — ${order.cancelReason}` : ""}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div style={S.card}>
          <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Order Details</p>
          {order?.items && order.items.length > 0 ? (
            order.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < order.items.length - 1 ? "1px solid rgba(74,222,128,0.06)" : "none" }}>
                <div>
                  <p style={{ color: "#f0fdf4", fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{item.name}</p>
                  <p style={{ color: "#86efac", fontSize: 11, opacity: 0.6 }}>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <span style={{ color: "#4ade80", fontWeight: 800, fontSize: 14 }}>{formatPrice(item.subtotal)}</span>
              </div>
            ))
          ) : (
            <p style={{ color: "rgba(134,239,172,0.5)", fontSize: 13, textAlign: "center", padding: "20px" }}>No items in this order</p>
          )}
          <div style={{ borderTop: "1px solid rgba(74,222,128,0.08)", marginTop: 12, paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={S.row}><span style={S.label}>Subtotal</span><span style={S.value}>{formatPrice(order?.subtotal)}</span></div>
            {order?.shippingCost > 0 && (
              <div style={S.row}>
                <span style={{ ...S.label, display: "flex", alignItems: "center", gap: 5 }}><Truck size={12} /> Shipping</span>
                <span style={S.value}>{formatPrice(order.shippingCost)}</span>
              </div>
            )}
            <div style={{ ...S.row, borderTop: "1px solid rgba(74,222,128,0.08)", paddingTop: 10, marginTop: 4 }}>
              <span style={{ color: "#f0fdf4", fontWeight: 800, fontSize: 15 }}>Total</span>
              <span style={{ color: "#4ade80", fontWeight: 900, fontSize: 22, fontFamily: "'Rajdhani',sans-serif" }}>{formatPrice(order?.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery + Payment */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div style={{ ...S.card, marginBottom: 0 }}>
            <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Delivery Info</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><User size={12} style={{ color: "#4ade80" }} /><span style={{ color: "#d1fae5", fontSize: 13 }}>{order?.customer.name}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Phone size={12} style={{ color: "#4ade80" }} /><span style={{ color: "#d1fae5", fontSize: 13 }}>{order?.customer.phone}</span></div>
              {order?.customer.email && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Mail size={12} style={{ color: "#4ade80" }} /><span style={{ color: "#d1fae5", fontSize: 12 }}>{order.customer.email}</span></div>}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><MapPin size={12} style={{ color: "#4ade80", marginTop: 2 }} /><span style={{ color: "#d1fae5", fontSize: 12, lineHeight: 1.5 }}>{order?.customer.address}</span></div>
            </div>
          </div>
          <div style={{ ...S.card, marginBottom: 0 }}>
            <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Payment</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "rgba(11,26,14,0.8)", border: `1px solid ${pm.color}25`, borderRadius: 12, marginBottom: 12 }}>
              <span style={{ color: pm.color }}>{pm.icon}</span>
              <div>
                <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: 13 }}>{pm.label}</p>
                <span style={{
                  display: "inline-block", padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700, marginTop: 3,
                  background: order?.paymentStatus === "paid" ? "rgba(74,222,128,0.12)" : "rgba(251,191,36,0.12)",
                  color: order?.paymentStatus === "paid" ? "#4ade80" : "#fbbf24",
                  border: `1px solid ${order?.paymentStatus === "paid" ? "rgba(74,222,128,0.2)" : "rgba(251,191,36,0.2)"}`,
                }}>
                  {order?.paymentStatus === "paid" ? "Paid" : "Pending"}
                </span>
              </div>
            </div>
            <div style={{ padding: "10px 14px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.1)", borderRadius: 10 }}>
              <p style={{ color: "#4ade80", fontSize: 12, fontWeight: 700, marginBottom: 2, display: "flex", alignItems: "center", gap: 6 }}><Phone size={12} /> We'll call to confirm</p>
              <p style={{ color: "rgba(134,239,172,0.5)", fontSize: 11 }}>Our team contacts you within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", background: "#0f2214", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 14, color: "#f0fdf4", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
            <Home size={15} /> Back to Home
          </Link>
          <Link to="/shop" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", background: "linear-gradient(135deg,#16a34a,#4ade80)", borderRadius: 14, color: "#000", textDecoration: "none", fontWeight: 800, fontSize: 13 }}>
            Continue Shopping <ArrowRight size={15} />
          </Link>
        </div>

        {/* WhatsApp */}
        <div style={{ padding: "16px 20px", background: "rgba(37,211,102,0.04)", border: "1px solid rgba(37,211,102,0.12)", borderRadius: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, background: "#25d366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          </div>
          <div>
            <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>Need help with your order?</p>
            <a href="https://wa.me/923361320540" target="_blank" rel="noopener noreferrer" style={{ color: "#25d366", fontSize: 12, textDecoration: "none", fontWeight: 600 }}>Chat with us on WhatsApp →</a>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:0.7}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}
