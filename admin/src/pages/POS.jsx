import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, Printer, Banknote, CreditCard, Building2, Smartphone, ShoppingBag, Search, Camera, ShoppingCart, Keyboard } from 'lucide-react';
import api from '../api';

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [taxType, setTaxType] = useState('percentage');
  const [taxValue, setTaxValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cartAnimating, setCartAnimating] = useState(null);
  const searchInputRef = useRef(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [categories, setCategories] = useState(['All']);

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get('/products?limit=1000');
      const productData = res.data.products || [];
      setProducts(productData);

      const uniqueCategories = ['All', ...new Set(productData.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (cart.length > 0 && !loading) {
          setShowCheckoutModal(true);
        }
      }
      if (e.key === 'Escape') {
        setSearchTerm('');
        setBarcodeInput('');
      }
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'F2') {
        e.preventDefault();
        if (cart.length > 0 && window.confirm('Clear current cart?')) {
          clearCart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, loading]);

  useEffect(() => {
    let barcodeBuffer = '';
    let barcodeTimeout;

    const handleKeyPress = (e) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key.length === 1) {
        barcodeBuffer += e.key;

        clearTimeout(barcodeTimeout);
        barcodeTimeout = setTimeout(() => {
          if (barcodeBuffer.length > 3) {
            const product = products.find(p => p.barcode === barcodeBuffer);
            if (product) {
              addToCart(product);
            }
          }
          barcodeBuffer = '';
        }, 50);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [products]);

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountValue(0);
    setTaxValue(0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory && product;
  });

  const addToCart = (product) => {
    if (product.stock === 0) return;

    setCartAnimating(product._id);
    setTimeout(() => setCartAnimating(null), 300);

    setCart(prevCart => {
      const existing = prevCart.find(item => item.product === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) return prevCart;
        return prevCart.map(item =>
          item.product === product._id
            ? { ...item, quantity: existing.quantity + 1 }
            : item
        );
      }
      return [...prevCart, {
        product: product._id,
        name: product.name,
        price: (product.salePrice && product.salePrice > 0 && product.salePrice < product.price) ? product.salePrice : product.price,
        originalPrice: product.price,
        quantity: 1,
        stock: product.stock,
        sku: product.sku,
        category: product.category
      }];
    });
  };

  const handleBarcodeSearch = () => {
    if (!barcodeInput) return;

    const product = products.find(p =>
      p.barcode === barcodeInput ||
      p.sku?.toLowerCase() === barcodeInput.toLowerCase()
    );

    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      alert('Product not found!');
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find(item => item.product === productId);
    if (newQuantity > item.stock) {
      alert(`Only ${item.stock} items available in stock!`);
      return;
    }

    setCart(cart.map(item =>
      item.product === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percentage') {
      return (subtotal * discountValue) / 100;
    }
    return discountValue;
  };

  const calculateTaxAmount = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const amountAfterDiscount = subtotal - discountAmount;

    if (taxType === 'percentage') {
      return (amountAfterDiscount * taxValue) / 100;
    }
    return taxValue;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const taxAmount = calculateTaxAmount();
    return subtotal - discountAmount + taxAmount;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const subtotal = calculateSubtotal();
      const discountAmount = calculateDiscountAmount();
      const taxAmount = calculateTaxAmount();
      const total = calculateTotal();

      const orderData = {
        customer: {
          name: customerName.trim() || 'Walk-in Customer',
          phone: customerPhone.trim() || 'N/A'
        },
        items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod,
        discount: {
          type: discountType,
          value: discountValue,
          amount: discountAmount
        },
        tax: {
          type: taxType,
          value: taxValue,
          amount: taxAmount
        },
        subtotal: subtotal,
        total: total
      };

      const res = await api.post('/orders/pos', orderData);
      setLastOrder(res.data.order);
      setShowSuccess(true);
      setShowCheckoutModal(false);
      clearCart();
      fetchProducts();
    } catch (err) {
      console.error('Checkout failed:', err);
      const errorMessage = err.response?.data?.message || 'Checkout failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    if (!lastOrder) return;

    const receiptContent = `
╔════════════════════════════════════════════╗
║            HOT WHEELS BIKES               ║
║            Point of Sale Receipt           ║
╠════════════════════════════════════════════╣
║ Order #: ${lastOrder.orderNumber || 'N/A'}
║ Date: ${new Date(lastOrder.createdAt || Date.now()).toLocaleString()}
║ Cashier: Admin
╠════════════════════════════════════════════╣
║ Customer: ${lastOrder.customer?.name || 'Walk-in Customer'}
║ Phone: ${lastOrder.customer?.phone || 'N/A'}
╠════════════════════════════════════════════╣
║ ITEMS                                     ║
${lastOrder.items?.map(item =>
      `║ ${(item.name || 'Product').slice(0, 25).padEnd(25)} x${item.quantity} = Rs.${(item.price * item.quantity).toLocaleString()}`
    ).join('\n') || '║ No items'}
╠════════════════════════════════════════════╣
║ Subtotal:                         Rs. ${(lastOrder.subtotal || 0).toLocaleString()}
║ Discount: ${lastOrder.discount?.type === 'percentage' ? `${lastOrder.discount?.value}%` : `Rs.${lastOrder.discount?.value}`}                         -Rs. ${(lastOrder.discount?.amount || 0).toLocaleString()}
║ Tax: ${lastOrder.tax?.type === 'percentage' ? `${lastOrder.tax?.value}%` : `Rs.${lastOrder.tax?.value}`}                          +Rs. ${(lastOrder.tax?.amount || 0).toLocaleString()}
╠════════════════════════════════════════════╣
║ TOTAL:                            Rs. ${(lastOrder.total || 0).toLocaleString()}
╠════════════════════════════════════════════╣
║ Payment: ${(lastOrder.paymentMethod || 'N/A').toUpperCase()}
║ Status: ${(lastOrder.status || 'COMPLETED').toUpperCase()}
╠════════════════════════════════════════════╣
║         THANK YOU FOR SHOPPING!           ║
║              * * *                        ║
╚════════════════════════════════════════════╝
    `.trim();

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${lastOrder.orderNumber || 'Order'}</title>
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            margin: 0; 
            padding: 20px;
            background: white;
          }
          pre { 
            margin: 0; 
            white-space: pre-wrap;
            font-size: 12px;
            line-height: 1.4;
          }
          @media print {
            body { margin: 0; padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <pre>${receiptContent}</pre>
        <button onclick="window.print();window.close();" style="margin-top:20px;padding:10px 20px;cursor:pointer;">Print Receipt</button>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Success Modal
  if (showSuccess) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          background: 'var(--raised)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          borderRadius: 28,
          padding: 40,
          maxWidth: 450,
          width: '100%',
          textAlign: 'center',
          animation: 'slideUp 0.3s ease'
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: 'rgba(74, 222, 128, 0.15)',
            border: '2px solid #4ade80',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <span style={{ fontSize: 48 }}><CheckCircle size={48} style={{ color: '#4ade80' }} /></span>
          </div>
          <h2 style={{ color: '#4ade80', fontSize: 24, marginBottom: 12 }}>
            Order Completed!
          </h2>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--text)', marginBottom: 8 }}>
            {lastOrder?.orderNumber || 'N/A'}
          </div>
          <div style={{ fontSize: 18, color: '#4ade80', marginBottom: 24 }}>
            Total: Rs. {lastOrder?.total?.toLocaleString() || 0}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={printReceipt}
              style={{ padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #16a34a, #4ade80)', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <Printer size={16} style={{ marginRight: 6 }} /> Print Receipt
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                setLastOrder(null);
              }}
              style={{ padding: '12px 24px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}
            >
              New Sale
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Checkout Modal
  if (showCheckoutModal) {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const taxAmount = calculateTaxAmount();
    const total = calculateTotal();

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          background: 'var(--raised)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          borderRadius: 28,
          padding: 32,
          maxWidth: 550,
          width: '100%',
          animation: 'slideUp 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, color: 'var(--text)', margin: 0 }}>Complete Sale</h2>
            <button
              onClick={() => setShowCheckoutModal(false)}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 24, cursor: 'pointer' }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Customer Name (Optional)</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Walk-in Customer"
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Phone (Optional)</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter phone number"
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
            </select>
          </div>

          {/* Discount Section */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Discount</label>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <button
                type="button"
                onClick={() => setDiscountType('percentage')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 10,
                  border: `1px solid ${discountType === 'percentage' ? '#4ade80' : 'var(--border)'}`,
                  background: discountType === 'percentage' ? 'rgba(74,222,128,0.15)' : 'var(--surface)',
                  color: discountType === 'percentage' ? '#4ade80' : 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 10,
                  border: `1px solid ${discountType === 'fixed' ? '#4ade80' : 'var(--border)'}`,
                  background: discountType === 'fixed' ? 'rgba(74,222,128,0.15)' : 'var(--surface)',
                  color: discountType === 'fixed' ? '#4ade80' : 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                Fixed Amount (Rs.)
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                min="0"
                max={discountType === 'percentage' ? 100 : undefined}
                step={discountType === 'percentage' ? 1 : 100}
                style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <span style={{ color: 'var(--muted)', minWidth: 60 }}>
                {discountType === 'percentage' ? '%' : 'Rs.'}
              </span>
            </div>
          </div>

          {/* Tax Section */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Tax</label>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <button
                type="button"
                onClick={() => setTaxType('percentage')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 10,
                  border: `1px solid ${taxType === 'percentage' ? '#4ade80' : 'var(--border)'}`,
                  background: taxType === 'percentage' ? 'rgba(74,222,128,0.15)' : 'var(--surface)',
                  color: taxType === 'percentage' ? '#4ade80' : 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => setTaxType('fixed')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 10,
                  border: `1px solid ${taxType === 'fixed' ? '#4ade80' : 'var(--border)'}`,
                  background: taxType === 'fixed' ? 'rgba(74,222,128,0.15)' : 'var(--surface)',
                  color: taxType === 'fixed' ? '#4ade80' : 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                Fixed Amount (Rs.)
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="number"
                value={taxValue}
                onChange={(e) => setTaxValue(Number(e.target.value))}
                min="0"
                step={taxType === 'percentage' ? 1 : 100}
                style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <span style={{ color: 'var(--muted)', minWidth: 60 }}>
                {taxType === 'percentage' ? '%' : 'Rs.'}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'var(--surface)',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'var(--muted)' }}>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#f87171' }}>Discount ({discountType === 'percentage' ? `${discountValue}%` : `Rs. ${discountValue}`}):</span>
                <span style={{ color: '#f87171', fontWeight: 600 }}>-Rs. {discountAmount.toLocaleString()}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#60a5fa' }}>Tax ({taxType === 'percentage' ? `${taxValue}%` : `Rs. ${taxValue}`}):</span>
                <span style={{ color: '#60a5fa', fontWeight: 600 }}>+Rs. {taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 20,
              fontWeight: 'bold',
              color: '#4ade80',
              paddingTop: 12,
              marginTop: 8,
              borderTop: '1px solid var(--border)'
            }}>
              <span>Total:</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Cart Items Summary */}
          {cart.length > 0 && (
            <div style={{ marginBottom: 24, maxHeight: 200, overflow: 'auto' }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Cart Items</label>
              {cart.map(item => (
                <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span>{item.name} x{item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setShowCheckoutModal(false)}
              style={{ flex: 1, padding: '14px', fontSize: 14, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{ flex: 2, padding: '14px', fontSize: 14, fontWeight: 'bold', borderRadius: 12, background: 'linear-gradient(135deg, #16a34a, #4ade80)', border: 'none', color: '#000', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, marginRight: 10, display: 'inline-block' }} />
                  Processing...
                </>
              ) : (
                'Confirm Sale'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: 20,
      minHeight: 'calc(100vh - 80px)',
      padding: 20
    }}>
      {/* Products Section */}
      <div style={{ overflow: 'auto' }}>
        <div style={{ padding: 24, borderRadius: 20, background: 'var(--raised)', border: '1px solid var(--border)' }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text)' }}>
              <ShoppingBag size={22} style={{ color: '#4ade80' }} /> Product Catalog
              <span style={{ fontSize: 12, background: 'rgba(74,222,128,0.15)', padding: '4px 10px', borderRadius: 20, color: '#4ade80' }}>
                {filteredProducts.length} items
              </span>
            </h2>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 16 }}>
              <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4ade80' }}>{products.length}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Total Products</div>
              </div>
              <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4ade80' }}>{products.filter(p => p.stock > 0).length}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>In Stock</div>
              </div>
              <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f87171' }}>{products.filter(p => p.stock === 0).length}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Out of Stock</div>
              </div>
              <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fbbf24' }}>{products.filter(p => p.stock > 0 && p.stock <= 5).length}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Low Stock</div>
              </div>
              <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#60a5fa' }}>{categories.length - 1}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Categories</div>
              </div>
            </div>
          </div>

          {/* Search and Barcode */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products by name, SKU, or description... (Press / to focus)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '14px 16px', borderRadius: 14, width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div style={{ position: 'relative', width: 200 }}>
              <input
                type="text"
                placeholder="Scan Barcode"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                style={{ padding: '14px 16px', borderRadius: 14, width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 30,
                  background: selectedCategory === category ? 'linear-gradient(135deg, #16a34a, #4ade80)' : 'var(--surface)',
                  color: selectedCategory === category ? '#000' : 'var(--text)',
                  border: selectedCategory === category ? 'none' : '1px solid var(--border)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 13,
                  transition: 'all 0.2s'
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid - No Images */}
          {loadingProducts ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px', border: '3px solid rgba(74,222,128,0.2)', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: 'var(--text)' }}>Loading products...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {filteredProducts.map(product => (
                <div
                  key={product._id}
                  data-product-id={product._id}
                  onClick={() => addToCart(product)}
                  style={{
                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                    opacity: product.stock > 0 ? 1 : 0.5,
                    border: `1px solid ${cartAnimating === product._id ? '#4ade80' : 'var(--border)'}`,
                    borderRadius: 16,
                    padding: 20,
                    background: 'var(--surface)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (product.stock > 0) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = '#4ade80';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(74,222,128,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {product.stock === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: '#ef4444',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 'bold'
                    }}>
                      Out of Stock
                    </div>
                  )}

                  {/* Product Info - No Image */}
                  <div style={{ marginBottom: 12 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: 'var(--text)', paddingRight: product.stock === 0 ? '80px' : '0' }}>
                      {product.name}
                    </h3>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(74,222,128,0.15)', padding: '4px 10px', borderRadius: 8, fontSize: 11, color: '#4ade80' }}>
                        {product.category || 'Uncategorized'}
                      </span>
                      {product.sku && (
                        <span style={{ background: 'rgba(96,165,250,0.15)', padding: '4px 10px', borderRadius: 8, fontSize: 11, color: '#60a5fa' }}>
                          SKU: {product.sku}
                        </span>
                      )}
                    </div>
                  </div>

                  {product.description && (
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.4 }}>
                      {product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
                    </p>
                  )}

                  <div style={{ marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontSize: 22, fontWeight: 'bold', color: '#4ade80' }}>
                      Rs. {(product.salePrice && product.salePrice < product.price ? product.salePrice : product.price).toLocaleString()}
                    </div>
                    {product.salePrice && product.salePrice < product.price && (
                      <div style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'line-through' }}>
                        Rs. {product.price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: product.stock > 5 ? '#4ade80' : product.stock > 0 ? '#fbbf24' : '#ef4444',
                    background: product.stock > 5 ? 'rgba(74,222,128,0.1)' : product.stock > 0 ? 'rgba(251,191,36,0.1)' : 'rgba(239,68,68,0.1)',
                    padding: '6px 12px',
                    borderRadius: 8,
                    display: 'inline-block'
                  }}>
                    📦 Stock: {product.stock}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loadingProducts && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <p style={{ color: 'var(--muted)', fontSize: 16 }}>No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div style={{
        background: 'var(--raised)',
        borderRadius: 20,
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: 'fit-content',
        position: 'sticky',
        top: 20
      }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ fontSize: 20, margin: 0, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingCart size={20} style={{ color: '#4ade80' }} /> Cart</h2>
            {cart.length > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Total</div>
                <div style={{ fontSize: 22, fontWeight: 'bold', color: '#4ade80' }}>
                  Rs. {calculateTotal().toLocaleString()}
                </div>
              </div>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} • {cart.reduce((s, i) => s + i.quantity, 0)} units
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', maxHeight: 'calc(100vh - 500px)', padding: '0 20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5, display: 'flex', justifyContent: 'center' }}>
                <ShoppingCart size={64} color="rgba(74,222,128,0.3)" />
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 16 }}>Your cart is empty</p>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>Click on products to add</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product} style={{
                padding: '16px 0',
                borderBottom: '1px solid var(--border)',
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ marginBottom: 8 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: 14, color: 'var(--text)' }}>{item.name}</h4>
                  <div style={{ fontSize: 12, color: '#4ade80' }}>
                    Rs. {item.price.toLocaleString()} × {item.quantity}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 'bold', marginTop: 6, color: 'var(--text)' }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      style={{ width: 32, height: 32, padding: 0, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)' }}
                    >
                      −
                    </button>
                    <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 600, color: 'var(--text)' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      style={{ width: 32, height: 32, padding: 0, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)' }}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product)}
                    style={{ width: 32, height: 32, padding: 0, borderRadius: 8, background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: 20, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setShowCheckoutModal(true)}
            disabled={cart.length === 0 || loading}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 16,
              fontWeight: 'bold',
              borderRadius: 12,
              background: cart.length > 0 ? 'linear-gradient(135deg, #16a34a, #4ade80)' : 'var(--surface)',
              color: cart.length > 0 ? '#000' : 'var(--muted)',
              border: 'none',
              cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            {cart.length === 0 ? 'Add items to continue' : <><CreditCard size={14} style={{ marginRight: 6 }} /> Complete Sale</>}
          </button>

          <div style={{ fontSize: 11, textAlign: 'center', marginTop: 12, color: 'var(--muted)' }}>
            Ctrl+Enter to checkout • F2 to clear cart
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          display: inline-block;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}