require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./middleware/passport');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins in production (Vercel URLs change)
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'hw_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/userAuth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/pos', require('./routes/pos'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/payment', require('./routes/payment'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

// One-time seed endpoint (auto-disables after first run)
app.get('/api/seed-init', async (req, res) => {
  try {
    const Admin = require('./models/Admin');
    const Product = require('./models/Product');
    const Settings = require('./models/Settings');

    // Admin
    const adminExists = await Admin.findOne({ email: 'admin@hotwheels.com' });
    if (!adminExists) {
      await Admin.create({ name: 'Admin', email: 'admin@hotwheels.com', password: 'admin123', role: 'super_admin' });
    }

    // Settings
    const settingsExists = await Settings.findOne();
    if (!settingsExists) {
      await Settings.create({ storeName: 'Hot Wheels Bikes', currency: 'PKR', taxRate: 0, shippingCost: 200 });
    }

    // Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const webProducts = [
        { name: '27.5" MTB Bicycle X1 Elite Trinx', series: 'Mountain Bikes', year: 2024, sku: 'TX1E275', price: 185000, salePrice: 161500, costPrice: 120000, stock: 10, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg', category: 'MOUNTAIN BIKES', description: '27.5 inch MTB Bicycle X1 Elite by Trinx.', lowStockAlert: 3 },
        { name: 'Trinx M116 Pro 29 MTB Cycle', series: 'Mountain Bikes', year: 2024, sku: 'TM116P29', price: 117000, salePrice: 106500, costPrice: 80000, stock: 8, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp', category: 'MOUNTAIN BIKES', description: 'Trinx M116 Pro 29 inch MTB cycle.', lowStockAlert: 3 },
        { name: '26" Folding Bicycle Star Rim Alloy Wheel', series: 'Mountain Bikes', year: 2024, sku: 'FB26SR', price: 87500, salePrice: 45000, costPrice: 35000, stock: 12, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/11/cc6cf063a4ee35b4369b8e6b892e22fc.jpg_720x720q80.jpg_.webp', category: 'MOUNTAIN BIKES', description: '26 inch folding bicycle.', lowStockAlert: 3 },
        { name: '27.5" Bicycle M116 Elite TRINX', series: 'Mountain Bikes', year: 2024, sku: 'TM116E275', price: 110000, salePrice: 97000, costPrice: 75000, stock: 7, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp', category: 'MOUNTAIN BIKES', description: '27.5 inch M116 Elite TRINX.', lowStockAlert: 3 },
        { name: 'Swift 1.0 Road Bike Trinx', series: 'Road Bikes', year: 2024, sku: 'SW10RB', price: 260000, salePrice: 221500, costPrice: 180000, stock: 5, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/unnamed.png', category: 'ROAD BIKES', description: 'Swift 1.0 Road Bike with dropbar handle.', lowStockAlert: 2 },
        { name: 'Trinx G1000 Gravel Bike 700C', series: 'Gravel Bikes', year: 2024, sku: 'TG1000', price: 195000, salePrice: 175000, costPrice: 140000, stock: 6, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg', category: 'GRAVEL BIKES', description: 'Trinx G1000 Gravel Bike 700C.', lowStockAlert: 2 },
        { name: 'Electric Scooter E10 Pro', series: 'Electric Bikes', year: 2024, sku: 'SCE10', price: 170000, salePrice: 133000, costPrice: 100000, stock: 8, image: 'https://hotwheelsbikes.com/wp-content/uploads/2025/01/81e-efWTckL.jpg', category: 'ELECTRIC BIKES', description: 'E10 Pro electric scooter 1200W.', lowStockAlert: 3 },
        { name: 'Electric Scooty For Kids & Adults', series: 'Electric Bikes', year: 2024, sku: 'ESKIDS', price: 110000, salePrice: 80000, costPrice: 65000, stock: 10, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/Sade660d6c4b6410aa8c0195466cc9804y.jpg_720x720q80.jpg_.webp', category: 'ELECTRIC BIKES', description: 'Electric scooty for kids and adults.', lowStockAlert: 3 },
        { name: '20" Kids Bicycle MTB 7-10 Years', series: "Kid's Bikes", year: 2024, sku: 'KB20MTB', price: 35000, salePrice: 24500, costPrice: 18000, stock: 15, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/02bc13e51e4d60cf118138e5c0dc99ed.jpg_720x720q80.jpg_-1.webp', category: "KID'S BIKE", description: '20 inch kids MTB bicycle.', lowStockAlert: 5 },
        { name: 'Star Girl 16" Bicycle Kids Royal Baby', series: "Kid's Bikes", year: 2024, sku: 'SG16RB', price: 40000, salePrice: 33500, costPrice: 25000, stock: 12, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/S2b17dd9462d2455b967d3eb689421c44i.jpg_720x720q80.jpg_.webp', category: "KID'S BIKE", description: 'Star Girl 16 inch bicycle.', lowStockAlert: 5 },
        { name: '12" MK Chimpunk Bicycle RoyalBaby', series: "Kid's Bikes", year: 2024, sku: 'MKC12', price: 24500, salePrice: 24500, costPrice: 18000, stock: 10, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/9e325b12a3501db7dfda7cc6886bb686.jpg_720x720q80.jpg_.webp', category: "KID'S BIKE", description: '12 inch kids bicycle.', lowStockAlert: 5 },
        { name: 'Shimano Rear Derailleur Altus M310', series: 'Parts', year: 2024, sku: 'SHM310', price: 8500, salePrice: 7200, costPrice: 5000, stock: 20, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-23.png', category: 'PARTS', description: 'Shimano Altus M310 rear derailleur.', lowStockAlert: 5 },
        { name: 'Kenda MTB Tyre 26x2.10', series: 'Parts', year: 2024, sku: 'KND26', price: 4500, salePrice: 3800, costPrice: 2500, stock: 25, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-23.png', category: 'PARTS', description: 'Kenda MTB tyre 26x2.10.', lowStockAlert: 5 },
        { name: 'Promax Mechanical Disc Brake Set', series: 'Parts', year: 2024, sku: 'PMX-DB', price: 6500, salePrice: 5500, costPrice: 4000, stock: 18, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-22.png', category: 'PARTS', description: 'Promax mechanical disc brake set.', lowStockAlert: 5 },
        { name: 'Cateye Volt 400 Front Light', series: 'Accessories', year: 2024, sku: 'CAT400', price: 5500, salePrice: 4800, costPrice: 3200, stock: 22, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-22.png', category: 'ACCESSORIES', description: 'Cateye Volt 400 front light.', lowStockAlert: 5 },
        { name: 'Bontrager Road Bike Helmet', series: 'Accessories', year: 2024, sku: 'BTR-H1', price: 18000, salePrice: 15500, costPrice: 11000, stock: 15, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/BT20_WEB_Editorial_Helmets_DM_1.png', category: 'ACCESSORIES', description: 'Bontrager road bike helmet.', lowStockAlert: 5 },
        { name: 'Topeak Aero Wedge Saddle Bag', series: 'Accessories', year: 2024, sku: 'TPK-SB', price: 3500, salePrice: 2900, costPrice: 2000, stock: 30, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Ad_Card_E317.png', category: 'ACCESSORIES', description: 'Topeak saddle bag.', lowStockAlert: 5 },
        { name: 'Elite Fly Water Bottle 750ml', series: 'Accessories', year: 2024, sku: 'ELT-WB', price: 1800, salePrice: 1500, costPrice: 900, stock: 50, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-20.png', category: 'ACCESSORIES', description: 'Elite Fly water bottle.', lowStockAlert: 10 },
        { name: 'Pro Cycling Jersey Short Sleeve', series: 'Apparel', year: 2024, sku: 'CYJ-SS', price: 7500, salePrice: 6200, costPrice: 4500, stock: 25, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/BT20_WEB_Editorial_Helmets_DM_1.png', category: 'APPAREL', description: 'Pro cycling jersey.', lowStockAlert: 5 },
        { name: 'Pro Cycling Bib Shorts', series: 'Apparel', year: 2024, sku: 'CYB-BS', price: 9500, salePrice: 8000, costPrice: 6000, stock: 20, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/BT20_WEB_Editorial_Helmets_DM_1.png', category: 'APPAREL', description: 'Pro cycling bib shorts.', lowStockAlert: 5 },
        { name: 'Trinx M136 27.5 MTB - SALE', series: 'Mountain Bikes', year: 2024, sku: 'TM136S', price: 95000, salePrice: 68000, costPrice: 55000, stock: 8, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp', category: 'SALE', description: 'Trinx M136 on sale.', lowStockAlert: 3 },
        { name: 'Pre-Owned Trek Marlin 5 (2022)', series: 'Pre-Owned', year: 2022, sku: 'PO-TM5', price: 85000, salePrice: 55000, costPrice: 40000, stock: 1, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg', category: 'PRE-OWNED', description: 'Pre-owned Trek Marlin 5.', lowStockAlert: 1 },
      ];
      await Product.insertMany(webProducts);
    }

    const finalCount = await Product.countDocuments();
    res.json({ success: true, message: 'Seed complete', products: finalCount, adminCreated: !adminExists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
