import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown, Search, Bike } from "lucide-react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { useWindowWidth } from "../hooks/useWindowWidth";

const colorOptions = ["Black", "Blue", "Green", "Orange", "Red", "Yellow", "Pink", "Purple"];
const sizeOptions = ["50", "52", "54", "56", "58", "60"];

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

/* Per-category hero config — badge is now dynamic, set at render time */
const categoryHero = {
  "all": { img: "https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg", label: "Browse Our Collection", desc: "Pakistan's largest selection — Hot Wheels, Bicycles, Accessories, and Parts." },
  "Hot Wheels": { img: "https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp", label: "Hot Wheels Collection", desc: "Premium die-cast cars and collectibles. Classic and modern designs." },
  "Bicycles": { img: "https://hotwheelsbikes.com/wp-content/uploads/2024/10/unnamed.png", label: "All Bicycles", desc: "Mountain, road, electric, and kids bikes. Perfect for every rider and terrain." },
  "Accessories": { img: "https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg", label: "Cycling Accessories", desc: "Helmets, gloves, shoes, and more. Everything you need for the perfect ride." },
  "Parts": { img: "https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp", label: "Bike Parts", desc: "Genuine parts and components for all bike types. Keep your ride running perfectly." },
};

export default function Shop({ defaultCategory }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isSmall = width < 480;

  const categoryParam = searchParams.get("category") || defaultCategory || "all";
  const searchParam = searchParams.get("search") || "";

  useEffect(() => { if (searchParam) setSearchQuery(searchParam); }, [searchParam]);

  // Fetch REAL products from database
  useEffect(() => {
    const fetchRealProducts = async () => {
      try {
        console.log('🔥 Fetching products from API...');
        const response = await axios.get('/api/products/public');
        console.log('✅ API Response received:', response.data);
        console.log('✅ Products count:', response.data.products?.length);

        if (response.data.success && response.data.products) {
          console.log('✅ Setting products:', response.data.products.length);
          setProducts(response.data.products);
        } else {
          console.log('❌ No products in response');
          setProducts([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching products:', error.message);
        console.error('❌ Full error:', error);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchRealProducts();
  }, []);

  // Get categories from real products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.map(cat => ({ id: cat, label: cat }));
  }, [products]);

  const activeCategory = categoryParam === "all" ? "all" : categoryParam;

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [categoryParam]);

  const setCategory = (cat) => {
    const p = new URLSearchParams(searchParams);
    cat === "all" ? p.delete("category") : p.set("category", cat);
    setSearchParams(p);
  };

  const toggleColor = (c) => setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  const toggleSize = (s) => setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const clearFilters = () => {
    setSelectedColors([]); setSelectedSizes([]);
    setPriceRange([0, 300000]); setSearchQuery("");
    setSearchParams({});
  };

  const filtered = useMemo(() => {
    let r = [...products];
    if (activeCategory !== "all") r = r.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    r = r.filter((p) => (p.salePrice || p.price) >= priceRange[0] && (p.salePrice || p.price) <= priceRange[1]);
    // Color and size filters disabled - Product model doesn't have these fields
    // if (selectedColors.length) r = r.filter((p) => p.colors?.some((c) => selectedColors.includes(c)));
    // if (selectedSizes.length)  r = r.filter((p) => p.sizes?.some((s)  => selectedSizes.includes(s)));
    switch (sortBy) {
      case "price-asc": r.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
      case "price-desc": r.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
      case "name-asc": r.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "discount": r.sort((a, b) => {
        const discA = a.price > 0 ? (a.price - (a.salePrice || a.price)) / a.price : 0;
        const discB = b.price > 0 ? (b.price - (b.salePrice || b.price)) / b.price : 0;
        return discB - discA;
      }); break;
    }
    return r;
  }, [products, activeCategory, searchQuery, priceRange, sortBy]);

  const hasActiveFilters = selectedColors.length || selectedSizes.length ||
    priceRange[0] !== 0 || priceRange[1] !== 300000 || searchQuery.trim();

  const categoryLabel = activeCategory === "all"
    ? "All Products"
    : activeCategory;

  const heroBase = categoryHero[activeCategory] || categoryHero["all"];
  // Dynamic badge: show real product count from DB
  const heroBadgeCount = activeCategory === "all" ? products.length : products.filter(p => p.category === activeCategory).length;
  const hero = {
    ...heroBase,
    badge: loading ? "Loading..." : `${heroBadgeCount} Product${heroBadgeCount !== 1 ? "s" : ""}`,
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px",
    background: T.bgSurface, border: `1px solid ${T.border}`,
    borderRadius: 10, fontSize: 13, color: T.textMain,
    outline: "none", transition: "border-color 0.2s",
  };

  const FilterContent = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ color: T.textMain, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "'Rajdhani',sans-serif" }}>
          Filters
        </h3>
        {hasActiveFilters && (
          <button onClick={clearFilters}
            style={{ fontSize: 12, color: T.green, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.color = T.greenMid}
            onMouseLeave={e => e.currentTarget.style.color = T.green}>
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 8 }}>Search</label>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.textMuted }} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bikes..."
            style={{ ...inputStyle, paddingLeft: 32 }}
            onFocus={e => e.target.style.borderColor = T.green}
            onBlur={e => e.target.style.borderColor = T.border} />
        </div>
      </div>

      {/* Price */}
      <div>
        <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 10 }}>Price Range</label>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textMuted, marginBottom: 8, fontWeight: 600 }}>
          <span>Rs.{priceRange[0].toLocaleString()}</span>
          <span>Rs.{priceRange[1].toLocaleString()}</span>
        </div>
        <input type="range" min={0} max={300000} step={5000} value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          style={{ width: "100%" }} />
      </div>

      {/* Colors */}
      <div>
        <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 10 }}>Color</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {colorOptions.map((color) => (
            <button key={color} onClick={() => toggleColor(color)}
              style={{
                padding: "6px 12px", fontSize: 12, borderRadius: 8, fontWeight: 600,
                border: selectedColors.includes(color) ? `1px solid ${T.green}` : `1px solid ${T.border}`,
                background: selectedColors.includes(color) ? T.green : T.bgSurface,
                color: selectedColors.includes(color) ? "#000" : T.textMuted,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!selectedColors.includes(color)) { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.green; } }}
              onMouseLeave={e => { if (!selectedColors.includes(color)) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}>
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 10 }}>Frame Size</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {sizeOptions.map((size) => (
            <button key={size} onClick={() => toggleSize(size)}
              style={{
                width: 42, height: 42, fontSize: 12, borderRadius: 10, fontWeight: 700,
                border: selectedSizes.includes(size) ? `1px solid ${T.green}` : `1px solid ${T.border}`,
                background: selectedSizes.includes(size) ? T.green : T.bgSurface,
                color: selectedSizes.includes(size) ? "#000" : T.textMuted,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!selectedSizes.includes(size)) { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.green; } }}
              onMouseLeave={e => { if (!selectedSizes.includes(size)) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}>
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: T.bgBase, minHeight: "100vh" }}>

      {/* ── Header with bg image ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${hero.img}')`,
          backgroundSize: "cover", backgroundPosition: "center 40%",
          transition: "background-image 0.4s",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(5,20,10,0.70),rgba(5,20,10,0.60))" }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px", pointerEvents: "none",
        }} />
        {/* Glow blob */}
        <div style={{ position: "absolute", top: "50%", right: "15%", width: 400, height: 400, background: "rgba(74,222,128,0.06)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(to top,${T.bgBase},transparent)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px clamp(16px,4vw,32px) 64px", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: T.green, fontSize: 11, fontWeight: 700, padding: "6px 16px", borderRadius: 99, marginBottom: 18, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            <span style={{ width: 6, height: 6, background: T.green, borderRadius: "50%", boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
            {hero.badge}
          </div>

          <h1 style={{ color: T.textMain, fontSize: "clamp(36px,5.5vw,64px)", fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", letterSpacing: "0.02em", marginBottom: 14, lineHeight: 1 }}>
            {searchQuery
              ? <>Results for <span style={{ color: T.green }}>"{searchQuery}"</span></>
              : <>{categoryLabel.split(" ").map((w, i, arr) => (
                <span key={i} style={{ color: i === arr.length - 1 ? T.green : T.textMain }}>{w}{i < arr.length - 1 ? " " : ""}</span>
              ))}</>
            }
          </h1>

          {!searchQuery && (
            <p style={{ color: T.textBody, fontSize: 16, lineHeight: 1.7, maxWidth: 520, marginBottom: 20 }}>
              {hero.desc}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: T.textMuted, fontSize: 13, fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, background: T.green, borderRadius: "50%" }} />
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </span>
            {activeCategory !== "all" && (
              <button onClick={() => setCategory("all")}
                style={{ fontSize: 12, color: T.textMuted, background: "rgba(74,222,128,0.08)", border: `1px solid ${T.border}`, padding: "5px 14px", borderRadius: 99, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = T.green; e.currentTarget.style.borderColor = T.borderMid; }}
                onMouseLeave={e => { e.currentTarget.style.color = T.textMuted; e.currentTarget.style.borderColor = T.border; }}>
                View All Bikes →
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px clamp(16px,4vw,32px)" }}>

        {/* Category tabs - dynamic from DB */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 28 }} className="scrollbar-hide">
          {[{ id: "all", label: "All Products" }, ...categories.map(c => ({ id: c.id, label: c.label }))].map((cat) => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              style={{
                flexShrink: 0, padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                border: activeCategory === cat.id ? `1px solid ${T.green}` : `1px solid ${T.border}`,
                background: activeCategory === cat.id ? T.green : T.bgRaised,
                color: activeCategory === cat.id ? "#000" : T.textMuted,
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: activeCategory === cat.id ? "0 0 20px rgba(74,222,128,0.3)" : "none",
              }}
              onMouseEnter={e => { if (activeCategory !== cat.id) { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.green; } }}
              onMouseLeave={e => { if (activeCategory !== cat.id) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}>
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 28 }}>
          {/* Desktop sidebar */}
          <aside style={{ width: 240, flexShrink: 0, display: "none" }} className="lg-sidebar">
            <div style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 20, padding: 20, position: "sticky", top: 88 }}>
              <FilterContent />
            </div>
          </aside>

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => setFiltersOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 16px", background: T.bgRaised,
                  border: `1px solid ${T.border}`, borderRadius: 12,
                  fontSize: 13, fontWeight: 600, color: T.textMuted,
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.green; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
                <SlidersHorizontal size={15} />
                Filters
                {hasActiveFilters && <span style={{ width: 8, height: 8, background: T.green, borderRadius: "50%" }} />}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Sort:</span>
                <div style={{ position: "relative" }}>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      appearance: "none", padding: "10px 32px 10px 12px",
                      background: T.bgRaised, border: `1px solid ${T.border}`,
                      borderRadius: 12, fontSize: 13, fontWeight: 600,
                      color: T.textMuted, outline: "none", cursor: "pointer",
                    }}
                    onFocus={e => e.target.style.borderColor = T.green}
                    onBlur={e => e.target.style.borderColor = T.border}>
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: T.textMuted, pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {selectedColors.map((c) => (
                  <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(74,222,128,0.1)", color: T.green, fontSize: 12, fontWeight: 700, borderRadius: 99, border: `1px solid ${T.borderMid}` }}>
                    {c} <button onClick={() => toggleColor(c)} style={{ background: "none", border: "none", cursor: "pointer", color: T.green, display: "flex" }}><X size={11} /></button>
                  </span>
                ))}
                {selectedSizes.map((s) => (
                  <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(74,222,128,0.1)", color: T.green, fontSize: 12, fontWeight: 700, borderRadius: 99, border: `1px solid ${T.borderMid}` }}>
                    Size {s} <button onClick={() => toggleSize(s)} style={{ background: "none", border: "none", cursor: "pointer", color: T.green, display: "flex" }}><X size={11} /></button>
                  </span>
                ))}
                {searchQuery && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(74,222,128,0.1)", color: T.green, fontSize: 12, fontWeight: 700, borderRadius: 99, border: `1px solid ${T.borderMid}` }}>
                    "{searchQuery}" <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: T.green, display: "flex" }}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid or empty */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                  <Bike size={72} color="rgba(74,222,128,0.3)" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: T.textMain, marginBottom: 8, fontFamily: "'Rajdhani',sans-serif" }}>No bikes found</h3>
                <p style={{ color: T.textMuted, marginBottom: 28, fontSize: 14 }}>Try adjusting your filters or search query.</p>
                <button onClick={clearFilters}
                  style={{ padding: "12px 28px", background: T.green, color: "#000", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.greenMid}
                  onMouseLeave={e => e.currentTarget.style.background = T.green}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: isSmall ? "1fr" : isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
                {filtered.map((product) => <ProductCard key={product._id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      {filtersOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, backdropFilter: "blur(4px)" }} onClick={() => setFiltersOpen(false)} />
          <div className="fade-up" style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: T.bgRaised, borderTop: `1px solid ${T.borderMid}`,
            zIndex: 51, borderRadius: "24px 24px 0 0",
            padding: 24, maxHeight: "88vh", overflowY: "auto",
          }}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 99, margin: "0 auto 20px" }} />
            <FilterContent />
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={clearFilters}
                style={{ flex: 1, padding: "14px", border: `1px solid ${T.border}`, borderRadius: 12, fontSize: 13, fontWeight: 700, color: T.textMuted, background: "transparent", cursor: "pointer" }}>
                Clear All
              </button>
              <button onClick={() => setFiltersOpen(false)}
                style={{ flex: 1, padding: "14px", background: T.green, color: "#000", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
