import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye, Heart, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

const T = {
  bgRaised: "#132a18",
  bgSurface: "#0f2214",
  green: "#4ade80",
  greenMid: "#22c55e",
  textMain: "#f0fdf4",
  textBody: "#d1fae5",
  textMuted: "#86efac",
  border: "rgba(74,222,128,0.15)",
  borderMid: "rgba(74,222,128,0.28)",
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Support both static data (id + slug) and API data (_id)
  const productLink = product.slug
    ? `/product/${product.slug}`
    : `/product/${product._id}`;

  const displayPrice = product.salePrice || product.price || 0;
  const originalPrice = product.originalPrice || product.price || 0;
  const hasDiscount = displayPrice > 0 && originalPrice > 0 && displayPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    // Normalise so CartContext always gets consistent fields
    const productToAdd = {
      ...product,
      id: product.id || product._id,
      _id: product._id || product.id,
      salePrice: displayPrice,
    };
    addToCart(productToAdd, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      style={{
        background: T.bgRaised,
        border: hovered ? `1px solid ${T.borderMid}` : `1px solid ${T.border}`,
        borderRadius: 20, overflow: "hidden",
        transition: "all 0.3s",
        boxShadow: hovered ? "0 8px 40px rgba(74,222,128,0.12)" : "none",
        display: "flex", flexDirection: "column",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image ── */}
      <div style={{ position: "relative", overflow: "hidden", background: T.bgSurface, aspectRatio: "1/1" }}>
        <Link to={productLink}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.5s",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
            onError={(e) => { e.target.src = "https://placehold.co/400x400/0f2214/4ade80?text=Bike"; }}
          />
        </Link>

        {/* Discount badge */}
        {discountPercent && (
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span style={{ background: T.green, color: "#000", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8, letterSpacing: "0.06em" }}>
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          style={{
            position: "absolute", top: 12, right: 12,
            width: 32, height: 32,
            background: "rgba(11,26,14,0.75)", backdropFilter: "blur(8px)",
            border: `1px solid ${T.border}`, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s",
            opacity: hovered ? 1 : 0,
          }}>
          <Heart size={13} style={{ color: wished ? T.green : T.textMuted, fill: wished ? T.green : "none" }} />
        </button>

        {/* Quick view */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, padding: 12,
          transform: hovered ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s",
        }}>
          <Link to={productLink}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              width: "100%", background: "rgba(11,26,14,0.85)", backdropFilter: "blur(8px)",
              color: T.green, fontSize: 12, fontWeight: 700,
              padding: "10px", borderRadius: 12,
              border: `1px solid ${T.borderMid}`, textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.green; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(11,26,14,0.85)"; e.currentTarget.style.color = T.green; }}>
            <Eye size={12} /> Quick View
          </Link>
        </div>
      </div>

      {/* ── Info ── */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <span style={{
            display: "inline-block", fontSize: 10, fontWeight: 700,
            color: T.green, background: "rgba(74,222,128,0.1)",
            border: `1px solid ${T.border}`, padding: "3px 10px",
            borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            {product.category}
          </span>
          {product.stock <= 0 && (
            <span style={{
              display: "inline-block", fontSize: 10, fontWeight: 700,
              color: "#ef4444", background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)", padding: "3px 10px",
              borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              Out of Stock
            </span>
          )}
        </div>

        <Link to={productLink} style={{ textDecoration: "none" }}>
          <h3 style={{
            fontSize: 14, fontWeight: 600,
            color: hovered ? T.green : T.textBody,
            lineHeight: 1.4, marginBottom: 8,
            transition: "color 0.2s",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
            minHeight: "2.8rem",
          }}>
            {product.name}
          </h3>
        </Link>

        {product.sku && (
          <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 8, fontFamily: "'Courier New', monospace", letterSpacing: "0.05em" }}>
            SKU: {product.sku}
          </p>
        )}

        <div style={{ marginTop: "auto" }}>
          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: T.textMain, fontFamily: "'Rajdhani',sans-serif" }}>
              Rs.{displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: 12, color: T.textMuted, textDecoration: "line-through", opacity: 0.6 }}>
                Rs.{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "10px", fontSize: 12, fontWeight: 700,
              borderRadius: 12, border: "none",
              cursor: product.stock > 0 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              background: added
                ? T.green
                : product.stock <= 0
                  ? "rgba(107,114,128,0.1)"
                  : "rgba(74,222,128,0.08)",
              color: added
                ? "#000"
                : product.stock <= 0
                  ? "#6b7280"
                  : T.green,
              outline: `1px solid ${added ? T.green : product.stock <= 0 ? "rgba(107,114,128,0.2)" : T.border}`,
              opacity: product.stock <= 0 ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (product.stock > 0 && !added) { e.currentTarget.style.background = T.green; e.currentTarget.style.color = "#000"; } }}
            onMouseLeave={e => { if (product.stock > 0 && !added) { e.currentTarget.style.background = "rgba(74,222,128,0.08)"; e.currentTarget.style.color = T.green; } }}
          >
            {added
              ? <><Check size={13} /> Added!</>
              : product.stock <= 0
                ? "Out of Stock"
                : <><ShoppingCart size={13} /> Add to Cart</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
