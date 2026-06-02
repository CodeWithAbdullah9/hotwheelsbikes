/**
 * addProducts45.js
 * Run: node addProducts45.js
 * Adds 23 more products to reach a total of 45 in the live database.
 * Safe to run multiple times — uses skipDuplicates to avoid inserting the same SKU twice.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const newProducts = [
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

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const before = await Product.countDocuments({ isActive: true });
    console.log(`📦 Products before: ${before}`);

    let added = 0;
    let skipped = 0;

    for (const p of newProducts) {
        const exists = await Product.findOne({ sku: p.sku });
        if (exists) {
            console.log(`⏭  Skipping (already exists): ${p.name} [${p.sku}]`);
            skipped++;
        } else {
            await Product.create(p);
            console.log(`✅ Added: ${p.name} [${p.sku}]`);
            added++;
        }
    }

    const after = await Product.countDocuments({ isActive: true });
    console.log(`\n🎉 Done! Added: ${added}, Skipped: ${skipped}`);
    console.log(`📦 Products after: ${after}`);
    await mongoose.disconnect();
}

run().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
