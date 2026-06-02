import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Package, ChevronRight, ShoppingBag, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { formatPrice } from "../data/products";
import { useWindowWidth } from "../hooks/useWindowWidth";

const STATUS_CONFIG = {
  pending: { label: "Order Placed", color: "#fbbf24", bg: "rgba(251,191,36,0.1)", icon: Clock },
  processing: { label: "Processing", color: "#60a5fa", bg: "rgba(96,165,250,0.1)", icon: Package },
  shipped: { label: "Shipped", color: "#c084fc", bg: "rgba(192,132,252,0.1)", icon: Truck },
  delivered: { label: "Delivered", color: "#4ade80", bg: "rgba(74,222,128,0.1)", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "#f87171", bg: "rgba(248,113,113,0.1)", icon: XCircle },
};

export default function MyOrders() {
  const { user, loading: authLoading } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const width = useWindowWidth();
  const isMobile = width < 640;

  useEffect(() => {
    if (!authLoading && !user) navigate("/login", { state: { from: "/my-orders" } });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("hw_user_token");
    setLoading(true);
    axios.get(`/api/user/orders?page=${page}&limit=8`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setOrders(r.data.orders); setPages(r.data.pages); setTotal(r.data.total); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [user, page]);

  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: "#0b1a0e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "3px solid rgba(74,222,128,0.2)", borderTop: "3px solid #4ade80", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0b1a0e", padding: "40px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", marginBottom: 28, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
          <div>
            <h1 style={{ color: "#f0fdf4", fontWeight: 800, fontSize: 24, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.04em", marginBottom: 4 }}>
              My Orders
            </h1>
            <p style={{ color: "rgba(134,239,172,0.5)", fontSize: 13 }}>
              {total} order{total !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link to="/shop" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 12, color: "#4ade80", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <div style={{ width: 36, height: 36, border: "3px solid rgba(74,222,128,0.2)", borderTop: "3px solid #4ade80", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <ShoppingBag size={56} style={{ color: "rgba(74,222,128,0.2)", margin: "0 auto 16px" }} />
            <h3 style={{ color: "#f0fdf4", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No orders yet</h3>
            <p style={{ color: "rgba(134,239,172,0.4)", fontSize: 13, marginBottom: 24 }}>Start shopping to see your orders here</p>
            <Link to="/shop" style={{ padding: "12px 28px", background: "#4ade80", color: "#000", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
              Shop Now
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {orders.map(order => {
              const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const Icon = sc.icon;
              return (
                <div key={order._id} style={{ background: "#0f2214", border: "1px solid rgba(74,222,128,0.1)", borderRadius: 18, padding: "20px 24px", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(74,222,128,0.1)"}>

                  {/* Order Header */}
                  <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", marginBottom: 14, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 8 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Package size={16} style={{ color: "#4ade80" }} />
                      </div>
                      <div>
                        <p style={{ color: "#4ade80", fontWeight: 800, fontSize: 14, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.04em" }}>{order.orderNumber}</p>
                        <p style={{ color: "rgba(134,239,172,0.4)", fontSize: 11 }}>{new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 99, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, border: `1px solid ${sc.color}25` }}>
                        <Icon size={11} /> {sc.label}
                      </span>
                      <span style={{ color: "#4ade80", fontWeight: 900, fontSize: 16, fontFamily: "'Rajdhani',sans-serif" }}>{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(11,26,14,0.6)", borderRadius: 10 }}>
                        <p style={{ color: "#d1fae5", fontSize: 13, fontWeight: 500 }}>{item.name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ color: "rgba(134,239,172,0.4)", fontSize: 12 }}>× {item.quantity}</span>
                          <span style={{ color: "#f0fdf4", fontSize: 13, fontWeight: 700 }}>{formatPrice(item.subtotal)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(74,222,128,0.06)" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span style={{ color: "rgba(134,239,172,0.4)", fontSize: 12 }}>
                        Payment: <span style={{ color: "#d1fae5", fontWeight: 600 }}>
                          {{
                            cod: "Cash on Delivery",
                            bank_transfer: "Bank Transfer",
                            jazzcash: "JazzCash",
                            easypaisa: "EasyPaisa",
                            stripe: "Card (Stripe)",
                            card: "Card",
                            cash: "Cash",
                          }[order.paymentMethod] || order.paymentMethod}
                        </span>
                      </span>
                      <span style={{ color: "rgba(134,239,172,0.4)", fontSize: 12 }}>
                        Shipping: <span style={{ color: "#d1fae5", fontWeight: 600 }}>{formatPrice(order.shippingCost)}</span>
                      </span>
                    </div>
                    {order.status === "cancelled" && order.cancelReason && (
                      <span style={{ color: "#f87171", fontSize: 11 }}>Reason: {order.cancelReason}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)}
                style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${page === i + 1 ? "rgba(74,222,128,0.4)" : "rgba(74,222,128,0.1)"}`, background: page === i + 1 ? "rgba(74,222,128,0.12)" : "transparent", color: page === i + 1 ? "#4ade80" : "rgba(134,239,172,0.4)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
