import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import { Link } from "react-router-dom";

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />

      <div className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-[#0d0d0d] border-l border-[#4ade80]/10 z-50 shadow-2xl flex flex-col fade-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#4ade80]/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-xl flex items-center justify-center">
              <ShoppingBag size={17} className="text-[#4ade80]" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base font-display tracking-wide">SHOPPING CART</h2>
              {cartItems.length > 0 && (
                <p className="text-xs text-gray-500">{cartItems.length} item{cartItems.length > 1 ? "s" : ""}</p>
              )}
            </div>
          </div>
          <button onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#1a1a1a] transition-colors text-gray-500 hover:text-white">
            <X size={17} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 bg-[#1a1a1a] border border-[#4ade80]/10 rounded-2xl flex items-center justify-center mb-5">
                <ShoppingBag size={30} className="text-[#4ade80]/30" />
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Cart is empty</h3>
              <p className="text-sm text-gray-500 mb-7">Add some bikes to get started!</p>
              <button onClick={() => setIsCartOpen(false)}
                className="px-7 py-3 bg-[#4ade80] text-black rounded-xl text-sm font-bold hover:bg-[#22c55e] transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartKey}
                className="flex gap-3 p-3 bg-[#1a1a1a] border border-[#4ade80]/5 rounded-2xl hover:border-[#4ade80]/15 transition-colors">
                <div className="w-[68px] h-[68px] rounded-xl overflow-hidden bg-[#111] flex-shrink-0 border border-[#4ade80]/10">
                  <img src={item.image} alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/68x68/111/4ade80?text=Bike"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-0.5">{item.name}</h4>
                  {item.selectedColor && <p className="text-[11px] text-gray-500">Color: {item.selectedColor}</p>}
                  {item.selectedSize  && <p className="text-[11px] text-gray-500">Size: {item.selectedSize}</p>}
                  <p className="text-[#4ade80] font-bold text-sm mt-1">{formatPrice(item.salePrice)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-[#111] border border-[#4ade80]/10 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-[#4ade80]/10 transition-colors text-gray-400 hover:text-[#4ade80]">
                        <Minus size={11} />
                      </button>
                      <span className="px-3 text-sm font-bold text-white min-w-[28px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-[#4ade80]/10 transition-colors text-gray-400 hover:text-[#4ade80]">
                        <Plus size={11} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.cartKey)}
                      className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#4ade80]/10 px-6 py-5 space-y-4 bg-[#0d0d0d]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-medium">Subtotal</span>
              <span className="text-2xl font-black text-white">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-xs text-gray-600 -mt-2">Shipping calculated at checkout</p>
            <Link to="/checkout" onClick={() => setIsCartOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#4ade80] text-black rounded-xl font-bold hover:bg-[#22c55e] transition-colors text-sm">
              Proceed to Checkout <ArrowRight size={15} />
            </Link>
            <button onClick={clearCart}
              className="w-full py-2.5 border border-[#4ade80]/15 text-gray-500 rounded-xl text-sm font-medium hover:bg-[#1a1a1a] hover:text-white transition-colors">
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
