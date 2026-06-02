import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ReturnsPolicy from "./pages/ReturnsPolicy";
import { ChevronUp, Bike } from "lucide-react";
import { useLocation } from "react-router-dom";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export const LoaderContext = createContext(null);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Loader() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0b1a0e",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 32,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)",
        backgroundSize: "60px 60px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 500, height: 500,
        background: "radial-gradient(circle,rgba(74,222,128,0.12) 0%,transparent 70%)",
        borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ position: "relative", width: 90, height: 90 }}>
          <div style={{
            position: "absolute", inset: 0,
            border: "3px solid rgba(74,222,128,0.15)",
            borderTop: "3px solid #4ade80",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }} />
          <div style={{
            position: "absolute", inset: 10,
            border: "2px solid rgba(74,222,128,0.1)",
            borderBottom: "2px solid #22c55e",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite reverse",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bike size={28} color="#4ade80" style={{ animation: "pulse 1.4s ease-in-out infinite" }} />
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: "'Rajdhani',sans-serif", fontWeight: 700,
            letterSpacing: "0.08em", fontSize: 28, lineHeight: 1,
            color: "#f0fdf4", marginBottom: 4,
          }}>
            HOT WHEELS <span style={{ color: "#4ade80" }}>BIKES</span>
          </h1>
          <p style={{ color: "#86efac", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Est. 1990 · DHA Phase 4, Karachi
          </p>
        </div>
        <div style={{ width: 200, height: 3, background: "rgba(74,222,128,0.15)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", background: "linear-gradient(90deg,#22c55e,#4ade80)",
            borderRadius: 99, animation: "loadBar 1.6s ease-in-out forwards",
          }} />
        </div>
        <p style={{ color: "#4ade80", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", animation: "pulse 1.4s ease-in-out infinite" }}>
          Loading...
        </p>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes loadBar { 0% { width: 0%; } 30% { width: 40%; } 70% { width: 75%; } 100% { width: 100%; } }
      `}</style>
    </div>
  );
}

function FloatingButtons({ showTop, scrollToTop }) {
  return (
    <>
      <a
        href="https://wa.me/923361320540"
        target="_blank" rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: "fixed", bottom: 88, right: 28, zIndex: 999,
          width: 50, height: 50, borderRadius: "50%",
          background: "#25d366", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(37,211,102,0.45)",
          transition: "transform 0.25s, box-shadow 0.25s",
          textDecoration: "none",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,211,102,0.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(37,211,102,0.45)"; }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
      <button
        onClick={scrollToTop} aria-label="Scroll to top"
        style={{
          position: "fixed", bottom: 32, right: 28, zIndex: 999,
          width: 46, height: 46, borderRadius: "50%",
          border: "2px solid #4ade80", background: "#16a34a",
          color: "#fff", cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(74,222,128,0.35)",
          opacity: showTop ? 1 : 0,
          transform: showTop ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
          pointerEvents: showTop ? "auto" : "none",
          transition: "opacity 0.3s, transform 0.3s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#4ade80"; e.currentTarget.style.color = "#000"; e.currentTarget.style.transform = "translateY(-3px) scale(1.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
      >
        <ChevronUp size={22} strokeWidth={2.5} />
      </button>
    </>
  );
}

export default function App() {
  const [showTop, setShowTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1600);
    const t2 = setTimeout(() => setLoading(false), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const triggerLoader = () => {
    setFadeOut(false); setLoading(true);
    const t1 = setTimeout(() => setFadeOut(true), 1000);
    const t2 = setTimeout(() => setLoading(false), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  };

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <UserProvider>
          <CartProvider>
            <LoaderContext.Provider value={{ triggerLoader }}>
              {loading && (
                <div style={{ opacity: fadeOut ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: fadeOut ? "none" : "auto" }}>
                  <Loader />
                </div>
              )}
              <ScrollToTop />
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/mountain-bike" element={<Shop defaultCategory="MOUNTAIN BIKES" />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsConditions />} />
                    <Route path="/returns-policy" element={<ReturnsPolicy />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <CartDrawer />
                <FloatingButtons showTop={showTop} scrollToTop={scrollToTop} />
              </div>
            </LoaderContext.Provider>
          </CartProvider>
        </UserProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
