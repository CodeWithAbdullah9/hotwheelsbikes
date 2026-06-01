import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const T = {
  bgBase:    "#0b1a0e",
  bgSurface: "#0f2214", 
  bgRaised:  "#132a18",
  green:     "#4ade80",
  textMain:  "#f0fdf4",
  textBody:  "#d1fae5",
  textMuted: "#86efac",
  border:    "rgba(74,222,128,0.15)",
};

export default function ShopComplete() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching all products from backend...');
        
        const response = await fetch('http://localhost:5002/api/products/public', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 API Response:', data);
        console.log('🔢 Products count:', data.products?.length || 0);
        
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          console.log('✅ Successfully loaded', data.products.length, 'products');
        } else {
          throw new Error('No products found in API response');
        }
        
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        setError(`Failed to load products: ${error.message}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];
  
  // Get current category from URL
  const currentCategory = searchParams.get('category') || 'all';
  
  // Filter products by category
  const filteredProducts = currentCategory === 'all' 
    ? products 
    : products.filter(p => p.category === currentCategory);

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: T.bgBase,
        color: T.textMain
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: "3px solid rgba(74,222,128,0.2)", 
            borderTopColor: T.green, 
            borderRadius: "50%", 
            animation: "spin 1s linear infinite", 
            margin: "0 auto 16px" 
          }}></div>
          <p>Loading all products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: T.bgBase,
        color: T.textMain,
        padding: "20px"
      }}>
        <div style={{ textAlign: "center", maxWidth: "500px" }}>
          <h3 style={{ color: "#ff6b6b", marginBottom: "16px" }}>Error</h3>
          <p style={{ marginBottom: "20px" }}>{error}</p>
          <p style={{ fontSize: "14px", color: T.textMuted }}>
            Please make sure backend server is running on http://localhost:5002
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              background: T.green,
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.bgBase, minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ 
            color: T.textMain, 
            fontSize: "48px", 
            fontWeight: "bold", 
            marginBottom: "16px" 
          }}>
            Hot Wheels Bikes
          </h1>
          <p style={{ color: T.textBody, fontSize: "18px" }}>
            {filteredProducts.length} of {products.length} products found
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{ 
          display: "flex", 
          gap: "12px", 
          marginBottom: "32px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => setSearchParams({})}
            style={{
              padding: "12px 24px",
              background: currentCategory === 'all' ? T.green : T.bgRaised,
              color: currentCategory === 'all' ? "#000" : T.textMain,
              border: `1px solid ${T.border}`,
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            All Products ({products.length})
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSearchParams({ category })}
              style={{
                padding: "12px 24px",
                background: currentCategory === category ? T.green : T.bgRaised,
                color: currentCategory === category ? "#000" : T.textMain,
                border: `1px solid ${T.border}`,
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              {category} ({products.filter(p => p.category === category).length})
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "80px 0",
            color: T.textMuted 
          }}>
            <h3>No products found</h3>
            <p>Try selecting a different category</p>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: "24px" 
          }}>
            {filteredProducts.map(product => (
              <div
                key={product._id}
                style={{
                  background: T.bgRaised,
                  border: `1px solid ${T.border}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                {/* Product Image */}
                <div style={{ 
                  aspectRatio: "1/1", 
                  background: T.bgSurface,
                  overflow: "hidden",
                  position: "relative"
                }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    onLoad={(e) => {
                      console.log('✅ Image loaded:', product.name);
                    }}
                    onError={(e) => {
                      console.log('❌ Image failed to load:', product.image);
                      // Try backend uploads URL
                      const backendImage = `http://localhost:5002/uploads/products/${product.image.split('/').pop()}`;
                      console.log('🔄 Trying backend image:', backendImage);
                      e.target.src = backendImage;
                      
                      // If backend also fails, use placeholder
                      e.target.onerror = () => {
                        console.log('❌ Backend image also failed, using placeholder');
                        e.target.src = `https://placehold.co/400x400/0f2214/4ade80?text=${encodeURIComponent(product.name.substring(0, 20))}`;
                      };
                    }}
                  />
                  {product.stock === 0 && (
                    <div style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#ff6b6b",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div style={{ padding: "20px" }}>
                  <div style={{
                    fontSize: "12px",
                    color: T.green,
                    fontWeight: "600",
                    marginBottom: "8px",
                    textTransform: "uppercase"
                  }}>
                    {product.category}
                  </div>
                  
                  <h3 style={{
                    color: T.textMain,
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    lineHeight: "1.4"
                  }}>
                    {product.name}
                  </h3>

                  {product.description && (
                    <p style={{
                      color: T.textMuted,
                      fontSize: "13px",
                      marginBottom: "12px",
                      lineHeight: "1.4"
                    }}>
                      {product.description.length > 80 
                        ? product.description.substring(0, 80) + "..."
                        : product.description
                      }
                    </p>
                  )}

                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    marginBottom: "12px"
                  }}>
                    <span style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: T.textMain
                    }}>
                      Rs.{(product.salePrice || product.price).toLocaleString()}
                    </span>
                    {product.salePrice && product.salePrice !== product.price && (
                      <span style={{
                        fontSize: "14px",
                        color: T.textMuted,
                        textDecoration: "line-through"
                      }}>
                        Rs.{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{
                      fontSize: "12px",
                      color: product.stock > 0 ? T.green : "#ff6b6b",
                      fontWeight: "600"
                    }}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                    </span>
                    
                    {product.sku && (
                      <span style={{
                        fontSize: "12px",
                        color: T.textMuted
                      }}>
                        SKU: {product.sku}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
