require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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
// Note: No session middleware — auth is JWT-based, sessions not needed
app.use(passport.initialize());
app.use('/uploads', express.static('uploads'));

// Root route — confirms server is alive
app.get('/', (_, res) => res.json({ status: 'Hot Wheels Bikes API', version: '1.0.0', health: '/api/health' }));

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
    const productCount = await Product.countDocuments({ isActive: true });
    let productsAdded = 0;

    if (productCount < 45) {
      // Seed all 45 products (upsert by SKU to avoid duplicates)
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
        // Additional products (total 45)
        { name: 'Trinx M500 Pro 26" Mountain Bike', series: 'Mountain Bikes', year: 2024, sku: 'TM500P26', price: 78000, salePrice: 68000, costPrice: 52000, stock: 9, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg', category: 'MOUNTAIN BIKES', description: 'Trinx M500 Pro 26 inch mountain bike, 21-speed.', lowStockAlert: 3 },
        { name: 'Trinx C700 Road Bike 700C', series: 'Road Bikes', year: 2024, sku: 'TC700RB', price: 145000, salePrice: 128000, costPrice: 100000, stock: 6, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/unnamed.png', category: 'ROAD BIKES', description: 'Trinx C700 road bike with Shimano gears.', lowStockAlert: 2 },
        { name: 'Trinx R600 Pro Road Bike', series: 'Road Bikes', year: 2024, sku: 'TR600PRO', price: 220000, salePrice: 195000, costPrice: 160000, stock: 4, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/unnamed.png', category: 'ROAD BIKES', description: 'Trinx R600 Pro aluminium road bike.', lowStockAlert: 2 },
        { name: 'Active 2.0 E-Bike 250W', series: 'Electric Bikes', year: 2024, sku: 'ACT20EB', price: 195000, salePrice: 165000, costPrice: 130000, stock: 5, image: 'https://hotwheelsbikes.com/wp-content/uploads/2025/01/81e-efWTckL.jpg', category: 'ELECTRIC BIKES', description: 'Active 2.0 electric bike 250W motor.', lowStockAlert: 2 },
        { name: 'Balance Bike 12" Kids 2-5 Years', series: "Kid's Bikes", year: 2024, sku: 'BB12K', price: 18000, salePrice: 15000, costPrice: 11000, stock: 20, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/02bc13e51e4d60cf118138e5c0dc99ed.jpg_720x720q80.jpg_-1.webp', category: "KID'S BIKE", description: '12 inch balance bike for toddlers.', lowStockAlert: 5 },
        { name: 'Shimano Acera Shifter Set 8-Speed', series: 'Parts', year: 2024, sku: 'SHA8SPD', price: 3500, salePrice: 2900, costPrice: 2000, stock: 30, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-23.png', category: 'PARTS', description: 'Shimano Acera 8-speed shifter set.', lowStockAlert: 5 },
        { name: 'KMC Chain 8-Speed X8', series: 'Parts', year: 2024, sku: 'KMCX8', price: 2200, salePrice: 1800, costPrice: 1200, stock: 40, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-22.png', category: 'PARTS', description: 'KMC X8 8-speed bike chain.', lowStockAlert: 8 },
        { name: 'Prowheel Crankset 170mm', series: 'Parts', year: 2024, sku: 'PWC170', price: 5500, salePrice: 4700, costPrice: 3200, stock: 15, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-23.png', category: 'PARTS', description: 'Prowheel triple crankset 170mm.', lowStockAlert: 5 },
        { name: 'Velo Comfort Saddle', series: 'Parts', year: 2024, sku: 'VCS001', price: 2800, salePrice: 2400, costPrice: 1600, stock: 25, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-22.png', category: 'PARTS', description: 'Velo comfort saddle with gel padding.', lowStockAlert: 5 },
        { name: 'Rockbros Cycling Gloves Full Finger', series: 'Accessories', year: 2024, sku: 'RBG-FF', price: 2500, salePrice: 2100, costPrice: 1400, stock: 30, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-20.png', category: 'ACCESSORIES', description: 'Rockbros full finger cycling gloves.', lowStockAlert: 5 },
        { name: 'Lezyne Floor Pump Alloy Drive', series: 'Accessories', year: 2024, sku: 'LEZ-FP', price: 6500, salePrice: 5500, costPrice: 3800, stock: 18, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-20.png', category: 'ACCESSORIES', description: 'Lezyne alloy floor pump with gauge.', lowStockAlert: 4 },
        { name: 'Garmin Edge 530 GPS Computer', series: 'Accessories', year: 2024, sku: 'GRM-530', price: 45000, salePrice: 39000, costPrice: 32000, stock: 8, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-22.png', category: 'ACCESSORIES', description: 'Garmin Edge 530 cycling GPS computer.', lowStockAlert: 3 },
        { name: 'Cycling Windproof Jacket', series: 'Apparel', year: 2024, sku: 'CYJ-WP', price: 12000, salePrice: 9800, costPrice: 7000, stock: 18, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/BT20_WEB_Editorial_Helmets_DM_1.png', category: 'APPAREL', description: 'Windproof cycling jacket.', lowStockAlert: 4 },
        { name: 'Pearl Izumi Cycling Shoes', series: 'Apparel', year: 2024, sku: 'PIS-001', price: 22000, salePrice: 18500, costPrice: 14000, stock: 12, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/BT20_WEB_Editorial_Helmets_DM_1.png', category: 'APPAREL', description: 'Pearl Izumi road cycling shoes.', lowStockAlert: 3 },
        { name: 'Trinx Hybrid X1 700C', series: 'Road Bikes', year: 2024, sku: 'THX1700', price: 98000, salePrice: 85000, costPrice: 65000, stock: 7, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/unnamed.png', category: 'ROAD BIKES', description: 'Trinx hybrid bike 700C wheels.', lowStockAlert: 2 },
        { name: 'Pre-Owned Giant Escape 3 (2021)', series: 'Pre-Owned', year: 2021, sku: 'PO-GE3', price: 65000, salePrice: 42000, costPrice: 30000, stock: 1, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg', category: 'PRE-OWNED', description: 'Pre-owned Giant Escape 3 hybrid bike.', lowStockAlert: 1 },
        { name: 'Aluminium MTB Handlebar 720mm', series: 'Parts', year: 2024, sku: 'SPCHB720', price: 4200, salePrice: 3500, costPrice: 2400, stock: 20, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-23.png', category: 'PARTS', description: 'Aluminium MTB flat handlebar 720mm.', lowStockAlert: 5 },
        { name: 'Maxxis Ardent MTB Tyre 27.5x2.25', series: 'Parts', year: 2024, sku: 'MAX275', price: 7500, salePrice: 6500, costPrice: 4500, stock: 16, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-22.png', category: 'PARTS', description: 'Maxxis Ardent folding MTB tyre.', lowStockAlert: 4 },
        { name: 'Kids BMX Bike 20" Steel Frame', series: "Kid's Bikes", year: 2024, sku: 'KBMX20', price: 28000, salePrice: 22500, costPrice: 16000, stock: 14, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/02bc13e51e4d60cf118138e5c0dc99ed.jpg_720x720q80.jpg_-1.webp', category: "KID'S BIKE", description: '20 inch kids BMX bike, steel frame.', lowStockAlert: 5 },
        { name: 'Cycling Sunglasses UV400', series: 'Accessories', year: 2024, sku: 'CSUV400', price: 3200, salePrice: 2700, costPrice: 1800, stock: 35, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-20.png', category: 'ACCESSORIES', description: 'Cycling sunglasses UV400 protection.', lowStockAlert: 8 },
        { name: 'Trinx Folding Bike M016 20"', series: 'Mountain Bikes', year: 2024, sku: 'TM01620', price: 75000, salePrice: 64000, costPrice: 48000, stock: 8, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/11/cc6cf063a4ee35b4369b8e6b892e22fc.jpg_720x720q80.jpg_.webp', category: 'MOUNTAIN BIKES', description: 'Trinx folding mountain bike 20 inch.', lowStockAlert: 3 },
        { name: 'Electric Fat Tire Bike 750W', series: 'Electric Bikes', year: 2024, sku: 'EFT750', price: 280000, salePrice: 245000, costPrice: 200000, stock: 4, image: 'https://hotwheelsbikes.com/wp-content/uploads/2025/01/81e-efWTckL.jpg', category: 'ELECTRIC BIKES', description: 'Electric fat tire bike 750W motor, 48V.', lowStockAlert: 2 },
        { name: 'Fox Racing MTB Helmet', series: 'Accessories', year: 2024, sku: 'FOX-MTB', price: 28000, salePrice: 24000, costPrice: 18000, stock: 10, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/BT20_WEB_Editorial_Helmets_DM_1.png', category: 'ACCESSORIES', description: 'Fox Racing full-face MTB helmet.', lowStockAlert: 3 },
      ];
      // Upsert by SKU — safe to run multiple times, won't create duplicates
      for (const p of webProducts) {
        await Product.findOneAndUpdate(
          { sku: p.sku },
          { $setOnInsert: { ...p, isActive: true } },
          { upsert: true }
        );
      }
      const newCount = await Product.countDocuments({ isActive: true });
      productsAdded = newCount - productCount;
    }

    const finalCount = await Product.countDocuments({ isActive: true });
    res.json({ success: true, message: 'Seed complete', products: finalCount, productsAdded, adminCreated: !adminExists });
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
