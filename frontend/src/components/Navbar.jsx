import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, Phone, ChevronDown, User, LogOut, Package, MapPin } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import Logo from "./Logo";
import { LoaderContext } from "../App";

const NAV = [
  { label: "Home", path: "/" },
  {
    label: "Shop", path: "/shop",
    children: [
      { label: "All Bikes", path: "/shop" },
      { label: "Mountain Bikes", path: "/shop?category=MOUNTAIN+BIKES" },
      { label: "Road Bikes", path: "/shop?category=ROAD+BIKES" },
      { label: "Gravel Bikes", path: "/shop?category=GRAVEL+BIKES" },
      { label: "E-Bikes", path: "/shop?category=ELECTRIC+BIKES" },
      { label: "Kid's Bike", path: "/shop?category=KID'S+BIKE" },
    ],
  },
  {
    label: "Gear", path: "/shop",
    children: [
      { label: "Parts", path: "/shop?category=PARTS" },
      { label: "Accessories", path: "/shop?category=ACCESSORIES" },
      { label: "Apparel", path: "/shop?category=APPAREL" },
      { label: "Sale", path: "/shop?category=SALE" },
      { label: "Pre-Owned", path: "/shop?category=PRE-OWNED" },
    ],
  },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logoutUser } = useUser();
  const { triggerLoader } = useContext(LoaderContext) || {};
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [srch, setSrch] = useState(false);
  const [query, setQuery] = useState("");
  const [drop, setDrop] = useState(null);
  const [userDrop, setUserDrop] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => { setOpen(false); setSrch(false); }, [loc.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (p) => p === "/" ? loc.pathname === "/" : loc.pathname.startsWith(p);

  const doSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      nav(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSrch(false); setQuery("");
    }
  };

  const navBg = scrolled
    ? "rgba(22,163,74,0.97)"
    : "#16a34a";

  return (
    <>
      {/* Top bar */}
      <div className="topbar" style={{
        background: "#071a09",
        borderBottom: "1px solid rgba(74,222,128,0.15)",
        padding: "6px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 12,
        color: "#86efac",
      }}>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="tel:+923361320540"
            style={{ display: "flex", alignItems: "center", gap: 6, color: "#86efac", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "#4ade80"}
            onMouseLeave={e => e.currentTarget.style.color = "#86efac"}>
            <Phone size={12} /> +0336 1320540
          </a>
          <a href="mailto:hotwheelsbicycles@gmail.com"
            style={{ color: "#86efac", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "#4ade80"}
            onMouseLeave={e => e.currentTarget.style.color = "#86efac"}>
            hotwheelsbicycles@gmail.com
          </a>
        </div>
        <span><MapPin size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> DHA Phase 4 &nbsp;·&nbsp; Free delivery above <strong style={{ color: "#4ade80" }}>₨ 5,000</strong></span>
      </div>

      {/* Main nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: navBg,
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: "1px solid rgba(74,222,128,0.2)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "0 2px 16px rgba(0,0,0,0.3)",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

            {/* Logo */}
            <Link
              to="/"
              style={{ textDecoration: "none", flexShrink: 0 }}
              onClick={() => {
                if (triggerLoader) triggerLoader();
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
            >
              <Logo size="md" />
            </Link>

            {/* Desktop links */}
            <div className="nav-desktop-links" style={{ alignItems: "center", gap: 2 }}>
              {NAV.map((link) =>
                link.children ? (
                  <div key={link.label} style={{ position: "relative" }}
                    onMouseEnter={() => setDrop(link.label)}
                    onMouseLeave={() => setDrop(null)}>
                    <button style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "8px 14px", borderRadius: 8, border: "none",
                      background: "transparent", cursor: "pointer",
                      fontSize: 14, fontWeight: 600,
                      color: isActive(link.path) ? "#4ade80" : "#d1fae5",
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = "#4ade80"}
                      onMouseLeave={e => { if (!isActive(link.path)) e.currentTarget.style.color = "#d1fae5"; }}>
                      {link.label}
                      <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: drop === link.label ? "rotate(180deg)" : "none" }} />
                    </button>
                    {drop === link.label && (
                      <div style={{
                        position: "absolute", top: "100%", left: 0, marginTop: 6,
                        width: 210, background: "#071a09",
                        border: "1px solid rgba(74,222,128,0.22)",
                        borderRadius: 14, padding: "8px 0", zIndex: 300,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                        animation: "fadeUp 0.15s ease both",
                      }}>
                        {link.children.map((c) => (
                          <Link key={c.label} to={c.path}
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", textDecoration: "none", fontSize: 13, color: "#86efac", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.background = "rgba(74,222,128,0.08)"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "#86efac"; e.currentTarget.style.background = "transparent"; }}
                            onClick={() => setDrop(null)}>
                            <span style={{ width: 5, height: 5, background: "#4ade80", borderRadius: "50%", flexShrink: 0 }} />
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={link.label} to={link.path}
                    style={{
                      padding: "8px 14px", borderRadius: 8, textDecoration: "none",
                      fontSize: 14, fontWeight: 600,
                      color: isActive(link.path) ? "#4ade80" : "#d1fae5",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#4ade80"}
                    onMouseLeave={e => { if (!isActive(link.path)) e.currentTarget.style.color = "#d1fae5"; }}>
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Right actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Search */}
              <button onClick={() => setSrch(!srch)} aria-label="Search"
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "none",
                  background: srch ? "#4ade80" : "rgba(74,222,128,0.1)",
                  color: srch ? "#000" : "#4ade80",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (!srch) { e.currentTarget.style.background = "rgba(74,222,128,0.2)"; } }}
                onMouseLeave={e => { if (!srch) { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; } }}>
                <Search size={17} />
              </button>

              {/* Cart */}
              <button onClick={() => setIsCartOpen(true)} aria-label="Cart"
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "none",
                  background: "rgba(74,222,128,0.1)", color: "#4ade80",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", transition: "all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(74,222,128,0.1)"}>
                <ShoppingCart size={17} />
                {cartCount > 0 && (
                  <span className="pulse-glow" style={{
                    position: "absolute", top: -3, right: -3,
                    background: "#4ade80", color: "#000", fontSize: 10, fontWeight: 900,
                    width: 18, height: 18, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              {user ? (
                <div style={{ position: "relative" }} onMouseEnter={() => setUserDrop(true)} onMouseLeave={() => setUserDrop(false)}>
                  <button style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: "rgba(74,222,128,0.1)", color: "#4ade80", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(74,222,128,0.1)"}>
                    {user.profilePicture
                      ? <img src={user.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontWeight: 800, fontSize: 14 }}>{user.name?.[0]?.toUpperCase()}</span>}
                  </button>
                  {userDrop && (
                    <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, width: 200, background: "#071a09", border: "1px solid rgba(74,222,128,0.22)", borderRadius: 14, padding: "8px 0", zIndex: 300, boxShadow: "0 20px 60px rgba(0,0,0,0.8)", animation: "fadeUp 0.15s ease both" }}>
                      <div style={{ padding: "10px 16px 8px", borderBottom: "1px solid rgba(74,222,128,0.1)" }}>
                        <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: 13 }}>{user.name}</p>
                        <p style={{ color: "rgba(134,239,172,0.4)", fontSize: 11 }}>{user.email}</p>
                      </div>
                      {[
                        { to: "/profile", icon: User, label: "My Profile" },
                        { to: "/my-orders", icon: Package, label: "My Orders" },
                      ].map(({ to, icon: Icon, label }) => (
                        <Link key={to} to={to} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", textDecoration: "none", fontSize: 13, color: "#86efac", transition: "all 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.background = "rgba(74,222,128,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "#86efac"; e.currentTarget.style.background = "transparent"; }}
                          onClick={() => setUserDrop(false)}>
                          <Icon size={13} /> {label}
                        </Link>
                      ))}
                      <div style={{ borderTop: "1px solid rgba(74,222,128,0.1)", marginTop: 4, paddingTop: 4 }}>
                        <button onClick={() => { logoutUser(); setUserDrop(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "none", border: "none", fontSize: 13, color: "#f87171", cursor: "pointer", transition: "all 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}>
                          <LogOut size={13} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80", textDecoration: "none", fontSize: 13, fontWeight: 700, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; }}>
                  <User size={14} /> Login
                </Link>
              )}

              {/* Hamburger — mobile only */}
              <button
                className="nav-hamburger"
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "none",
                  background: open ? "#4ade80" : "rgba(74,222,128,0.1)",
                  color: open ? "#000" : "#4ade80",
                  cursor: "pointer", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {srch && (
            <div style={{ paddingBottom: 14 }} className="fade-up">
              <form onSubmit={doSearch} style={{ display: "flex", gap: 8 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4ade80" }} />
                  <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search bikes, accessories..."
                    style={{
                      width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 11, paddingBottom: 11,
                      background: "#0e1f12", border: "1px solid rgba(74,222,128,0.25)",
                      borderRadius: 10, fontSize: 13, color: "#f0fdf4", outline: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = "#4ade80"}
                    onBlur={e => e.target.style.borderColor = "rgba(74,222,128,0.25)"} />
                </div>
                <button type="submit" style={{
                  padding: "0 20px", background: "#4ade80", color: "#000",
                  border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}>
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="fade-up" style={{
            borderTop: "1px solid rgba(74,222,128,0.15)",
            background: "#071a09",
            padding: "8px 16px 20px",
            maxHeight: "calc(100vh - 68px)",
            overflowY: "auto",
          }}>
            {NAV.map((link) => (
              <div key={link.label}>
                <Link to={link.path}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 14px", borderRadius: 10, textDecoration: "none",
                    fontSize: 15, fontWeight: 600, marginBottom: 2,
                    color: isActive(link.path) ? "#4ade80" : "#d1fae5",
                    background: isActive(link.path) ? "rgba(74,222,128,0.08)" : "transparent",
                  }}
                  onClick={() => !link.children && setOpen(false)}>
                  {link.label}
                  {link.children && <ChevronDown size={14} style={{ color: "#4ade80" }} />}
                </Link>
                {link.children && (
                  <div style={{ paddingLeft: 14, marginBottom: 6 }}>
                    {link.children.map((c) => (
                      <Link key={c.label} to={c.path}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, textDecoration: "none", fontSize: 13, color: "#6b9e7a", marginBottom: 1 }}
                        onMouseEnter={e => e.currentTarget.style.color = "#4ade80"}
                        onMouseLeave={e => e.currentTarget.style.color = "#6b9e7a"}
                        onClick={() => setOpen(false)}>
                        <span style={{ width: 4, height: 4, background: "#4ade80", borderRadius: "50%", flexShrink: 0 }} />
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(74,222,128,0.12)", marginTop: 10, paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="tel:+923361320540"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", textDecoration: "none", fontSize: 13, color: "#86efac" }}>
                <Phone size={14} style={{ color: "#4ade80" }} /> +0336 1320540
              </a>
              <button onClick={() => { setIsCartOpen(true); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 14px", borderRadius: 10, background: "#4ade80", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#000" }}>
                <ShoppingCart size={14} /> View Cart {cartCount > 0 && `(${cartCount})`}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
