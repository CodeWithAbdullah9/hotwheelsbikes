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

export default function ShopWorking() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Static data as fallback
  const staticProducts = [
    {
      _id: "1",
      name: "Hot Wheels Bone Shaker",
      category: "Hot Wheels",
      price: 1500,
      salePrice: 1200,
      stock: 25,
      image: "https://hotwheelsbikes.com/wp-content/uploads/2023/01/Rectangle-1-1.png",
      sku: "HW-001",
      description: "Classic bone shaker design with detailed interior"
    },
    {
      _id: "2",
      name: "Hot Wheels Twin Mill",
      category: "Hot Wheels",
      price: 1800,
      salePrice: 1500,
      stock: 3,
      image: "https://hotwheelsbikes.com/wp-content/uploads/2023/01/Rectangle-2-1.png",
      sku: "HW-002",
      description: "Twin engine monster truck"
    },
    {
      _id: "3",
      name: "Mountain Bike Pro",
      category: "Bicycles",
      price: 15000,
      salePrice: 12000,
      stock: 5,
      image: "https://hotwheelsbikes.com/wp-content/uploads/2024/01/mountain-bike.png",
      sku: "BIKE-001",
      description: "Professional mountain bike for trails"
    },
    {
      _id: "4",
      name: "Professional Cycling Helmet",
      category: "Accessories",
      price: 3500,
      salePrice: 2800,
      stock: 25,
      image: "https://hotwheelsbikes.com/wp-content/uploads/2024/01/pro-helmet.png",
      sku: "ACC-001",
      description: "Professional cycling helmet with MIPS protection"
    },
    {
      _id: "5",
      name: "Shimano Deore XT Groupset",
      category: "Parts",
      price: 45000,
      salePrice: 38000,
      stock: 3,
      image: "https://hotwheelsbikes.com/wp-content/uploads/2024/01/shimano-xt.png",
      sku: "PART-001",
      description: "Complete Shimano Deore XT groupset"
    }
  ];

  // Fetch from API with proper error handling
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching products from API...');
        
        const response = await fetch('http://localhost:5001/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors'
        });
        
        console.log('📡 API Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📦 API Response data:', data);
          
          if (data.products && Array.isArray(data.products)) {
            console.log('✅ Loaded products from API:', data.products.length);
            setProducts(data.products);
            return;
          } else {
            console.log('⚠️ API response format invalid');
          }
        } else {
          console.log('❌ API response not ok:', response.status);
        }
        
        throw new Error(`API returned ${response.status}`);
        
      } catch (error) {
        console.error('❌ API Error:', error);
        console.log('🔄 Retrying with different method...');
        
        // Try alternative method
        try {
          const response = await fetch('http://localhost:5001/api/products');
          if (response.ok) {
            const data = await response.json();
            if (data.products && data.products.length > 0) {
              console.log('✅ Loaded products with alternative method:', data.products.length);
              setProducts(data.products);
              return;
            }
          }
        } catch (retryError) {
          console.error('❌ Retry failed:', retryError);
        }
        
        // Only use static data as last resort
        console.log('⚠️ Using static data as fallback');
        setProducts(staticProducts);
        setError('Using sample data - API connection failed');
        
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
          <p>Loading products...</p>
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
            {filteredProducts.length} products found
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
                  overflow: "hidden"
                }}>
                  <img
                    src={product.image || `https://placehold.co/400x400/0f2214/4ade80?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      e.target.src = `https://placehold.co/400x400/0f2214/4ade80?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
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
                    {product.price !== product.salePrice && (
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
                        {product.sku}
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
