import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Check, ChevronRight, Zap, Shield, Truck, RotateCcw, Heart, Minus, Plus, Bike } from "lucide-react";
import { products, formatPrice, getDiscount } from "../data/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

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

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", background: T.bgBase, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
        <div style={{ marginBottom: 20 }}>
          <Bike size={72} color="rgba(74,222,128,0.3)" />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: T.textMain, marginBottom: 8, fontFamily: "'Rajdhani',sans-serif" }}>Product Not Found</h2>
        <p style={{ color: T.textMuted, marginBottom: 28, fontSize: 15 }}>This bike doesn't exist or has been removed.</p>
        <Link to="/shop" className="btn-primary" style={{ fontSize: 14, padding: "13px 28px" }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice !== product.salePrice
    ? getDiscount(product.originalPrice, product.salePrice) : null;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ background: T.bgBase, minHeight: "100vh" }}>

      {/* Breadcrumb */}
      <div style={{ background: T.bgSurface, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 32px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMuted, flexWrap: "wrap" }}>
            {[
              { label: "Home", to: "/" },
              { label: "Shop", to: "/shop" },
              { label: product.category, to: `/shop?category=${encodeURIComponent(product.category)}` },
            ].map((c) => (
              <span key={c.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Link to={c.to} style={{ color: T.textMuted, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = T.green}
                  onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
                  {c.label}
                </Link>
                <ChevronRight size={11} style={{ color: T.border }} />
              </span>
            ))}
            <span style={{ color: T.textBody, fontWeight: 600 }}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }} className="about-grid">

          {/* ── Images ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ position: "relative", background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 24, overflow: "hidden", aspectRatio: "1/1" }}>
              {discount && (
                <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10, background: T.green, color: "#000", fontSize: 13, fontWeight: 800, padding: "6px 14px", borderRadius: 10 }}>
                  -{discount}% OFF
                </div>
              )}
              <button onClick={() => setWished(!wished)}
                style={{
                  position: "absolute", top: 16, right: 16, zIndex: 10,
                  width: 40, height: 40, background: "rgba(11,26,14,0.8)", backdropFilter: "blur(8px)",
                  border: `1px solid ${T.border}`, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "transform 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <Heart size={16} style={{ color: wished ? T.green : T.textMuted, fill: wished ? T.green : "none" }} />
              </button>
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.target.src = `https://placehold.co/600x600/0f2214/4ade80?text=Bike`; }}
              />
            </div>

            {product.images?.length > 1 && (
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }} className="scrollbar-hide">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    style={{
                      flexShrink: 0, width: 80, height: 80, borderRadius: 16, overflow: "hidden",
                      border: selectedImage === i ? `2px solid ${T.green}` : `2px solid ${T.border}`,
                      boxShadow: selectedImage === i ? "0 0 15px rgba(74,222,128,0.3)" : "none",
                      cursor: "pointer", transition: "all 0.2s", background: "none", padding: 0,
                    }}>
                    <img src={img} alt={`View ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.src = `https://placehold.co/80x80/0f2214/4ade80?text=Bike`; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Link to={`/shop?category=${encodeURIComponent(product.category)}`}
                style={{
                  fontSize: 11, fontWeight: 800, color: T.green,
                  background: "rgba(74,222,128,0.1)", border: `1px solid ${T.borderMid}`,
                  padding: "6px 14px", borderRadius: 99, textDecoration: "none",
                  textTransform: "uppercase", letterSpacing: "0.12em", transition: "all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(74,222,128,0.1)"}>
                {product.category}
              </Link>
              <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>SKU: {product.sku}</span>
            </div>

            <h1 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 700, color: T.textMain, fontFamily: "'Rajdhani',sans-serif", lineHeight: 1.1, letterSpacing: "0.01em" }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 40, fontWeight: 900, color: T.textMain, fontFamily: "'Rajdhani',sans-serif" }}>{formatPrice(product.salePrice)}</span>
              {product.originalPrice !== product.salePrice && (
                <>
                  <span style={{ fontSize: 20, color: T.textMuted, textDecoration: "line-through", opacity: 0.6 }}>{formatPrice(product.originalPrice)}</span>
                  <span style={{ background: "rgba(74,222,128,0.1)", color: T.green, fontSize: 13, fontWeight: 800, padding: "4px 12px", borderRadius: 10, border: `1px solid ${T.borderMid}` }}>
                    Save {formatPrice(product.originalPrice - product.salePrice)}
                  </span>
                </>
              )}
            </div>

            {product.saleEnds && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24", fontSize: 13, padding: "12px 16px", borderRadius: 14 }}>
                <Zap size={14} style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>
                  Sale ends: {new Date(product.saleEnds).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            )}

            <div style={{ height: 1, background: T.border }} />

            {product.colors?.length > 0 && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: T.textBody, display: "block", marginBottom: 10 }}>
                  Color: <span style={{ color: T.green }}>{selectedColor}</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {product.colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      style={{
                        padding: "8px 16px", fontSize: 13, borderRadius: 10, fontWeight: 600,
                        border: selectedColor === color ? `2px solid ${T.green}` : `1px solid ${T.border}`,
                        background: selectedColor === color ? "rgba(74,222,128,0.12)" : T.bgSurface,
                        color: selectedColor === color ? T.green : T.textMuted,
                        cursor: "pointer", transition: "all 0.15s",
                      }}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: T.textBody, display: "block", marginBottom: 10 }}>
                  Frame Size: <span style={{ color: T.green }}>{selectedSize}</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      style={{
                        width: 48, height: 48, fontSize: 13, borderRadius: 10, fontWeight: 700,
                        border: selectedSize === size ? `2px solid ${T.green}` : `1px solid ${T.border}`,
                        background: selectedSize === size ? "rgba(74,222,128,0.12)" : T.bgSurface,
                        color: selectedSize === size ? T.green : T.textMuted,
                        cursor: "pointer", transition: "all 0.15s",
                      }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: T.textBody, display: "block", marginBottom: 10 }}>Quantity</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: "12px 16px", background: "none", border: "none", color: T.textMuted, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = T.green}
                    onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
                    <Minus size={15} />
                  </button>
                  <span style={{ padding: "12px 20px", fontWeight: 900, color: T.textMain, minWidth: 52, textAlign: "center", fontSize: 18, fontFamily: "'Rajdhani',sans-serif" }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: "12px 16px", background: "none", border: "none", color: T.textMuted, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = T.green}
                    onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
                    <Plus size={15} />
                  </button>
                </div>
                <span style={{ fontSize: 12, color: T.green, fontWeight: 700, background: "rgba(74,222,128,0.1)", border: `1px solid ${T.borderMid}`, padding: "6px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}><Check size={12} /> In Stock</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleAddToCart}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "15px", borderRadius: 16, fontWeight: 700, fontSize: 14,
                  cursor: "pointer", transition: "all 0.2s",
                  background: added ? T.green : T.bgSurface,
                  border: added ? `1px solid ${T.green}` : `1px solid ${T.borderMid}`,
                  color: added ? "#000" : T.green,
                }}
                onMouseEnter={e => { if (!added) { e.currentTarget.style.background = T.green; e.currentTarget.style.color = "#000"; } }}
                onMouseLeave={e => { if (!added) { e.currentTarget.style.background = T.bgSurface; e.currentTarget.style.color = T.green; } }}>
                {added ? <><Check size={17} /> Added!</> : <><ShoppingCart size={17} /> Add to Cart</>}
              </button>
              <button onClick={() => { addToCart(product, quantity, selectedColor, selectedSize); navigate("/contact"); }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: "center", padding: "15px", fontSize: 14 }}>
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: <Truck size={13} />, text: "Free delivery above ₨5,000" },
                { icon: <Shield size={13} />, text: "100% genuine product" },
                { icon: <RotateCcw size={13} />, text: "Easy returns policy" },
                { icon: <Zap size={13} />, text: "Fast customer support" },
              ].map((b) => (
                <div key={b.text}
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.textMuted, background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 12px" }}>
                  <span style={{ color: T.green, flexShrink: 0 }}>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginTop: 64 }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: 24 }}>
            {["description", "specs"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: "14px 28px", fontSize: 13, fontWeight: 700,
                  textTransform: "capitalize", cursor: "pointer",
                  background: "none", border: "none",
                  borderBottom: activeTab === tab ? `2px solid ${T.green}` : "2px solid transparent",
                  color: activeTab === tab ? T.green : T.textMuted,
                  marginBottom: -1, transition: "all 0.2s",
                }}>
                {tab === "specs" ? "Specifications" : "Description"}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28 }}>
              <p style={{ color: T.textMuted, lineHeight: 1.85, fontSize: 15 }}>{product.description}</p>
            </div>
          )}

          {activeTab === "specs" && product.specs && (
            <div style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28 }}>
              <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, listStyle: "none" }}>
                {product.specs.map((spec, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: T.textMuted }}>
                    <span style={{ width: 20, height: 20, background: "rgba(74,222,128,0.1)", color: T.green, border: `1px solid ${T.borderMid}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Check size={10} />
                    </span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
              <div>
                <p style={{ color: T.green, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: 8 }}>You might also like</p>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: T.textMain, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.02em" }}>RELATED PRODUCTS</h2>
              </div>
              <Link to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="btn-link">
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="prod-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
