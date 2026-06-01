require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Web frontend ki exact products — yahi admin panel mein bhi dikhni chahiue
const webProducts = [
    // ── MOUNTAIN BIKES ──────────────────────────────────────────────────────
    {
        name: '27.5" MTB Bicycle X1 Elite Trinx',
        series: 'Mountain Bikes', year: 2024, sku: 'TX1E275',
        price: 185000, salePrice: 161500, costPrice: 120000, stock: 10,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg',
        category: 'MOUNTAIN BIKES',
        description: '27.5 inch MTB Bicycle X1 Elite by Trinx. Elite level mountain bike for demanding trails and competitive riding.',
        lowStockAlert: 3,
    },
    {
        name: 'Trinx M116 Pro 29 MTB Cycle',
        series: 'Mountain Bikes', year: 2024, sku: 'TM116P29',
        price: 117000, salePrice: 106500, costPrice: 80000, stock: 8,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp',
        category: 'MOUNTAIN BIKES',
        description: 'Trinx M116 Pro 29 inch MTB cycle. Professional grade mountain bike with premium components for serious riders.',
        lowStockAlert: 3,
    },
    {
        name: '26" Folding Bicycle Star Rim Alloy Wheel Dual Suspension',
        series: 'Mountain Bikes', year: 2024, sku: 'FB26SR',
        price: 87500, salePrice: 45000, costPrice: 35000, stock: 12,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/11/cc6cf063a4ee35b4369b8e6b892e22fc.jpg_720x720q80.jpg_.webp',
        category: 'MOUNTAIN BIKES',
        description: '26 inch folding bicycle with star rim alloy wheel and dual suspension. Perfect for city commuting and off-road adventures.',
        lowStockAlert: 3,
    },
    {
        name: '27.5" Bicycle M116 Elite TRINX',
        series: 'Mountain Bikes', year: 2024, sku: 'TM116E275',
        price: 110000, salePrice: 97000, costPrice: 75000, stock: 7,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp',
        category: 'MOUNTAIN BIKES',
        description: '27.5 inch Bicycle M116 Elite by TRINX. High performance mountain bike with elite components.',
        lowStockAlert: 3,
    },

    // ── ROAD BIKES ──────────────────────────────────────────────────────────
    {
        name: 'Swift 1.0 Road Bike with Dropbar Handle Trinx',
        series: 'Road Bikes', year: 2024, sku: 'SW10RB',
        price: 260000, salePrice: 221500, costPrice: 180000, stock: 5,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/unnamed.png',
        category: 'ROAD BIKES',
        description: 'Swift 1.0 Road Bike with dropbar handle by Trinx. Professional road bike for speed enthusiasts and long-distance riders.',
        lowStockAlert: 2,
    },

    // ── GRAVEL BIKES ────────────────────────────────────────────────────────
    {
        name: 'Trinx G1000 Gravel Bike 700C',
        series: 'Gravel Bikes', year: 2024, sku: 'TG1000',
        price: 195000, salePrice: 175000, costPrice: 140000, stock: 6,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg',
        category: 'GRAVEL BIKES',
        description: 'Trinx G1000 Gravel Bike 700C. Versatile gravel bike built for mixed terrain.',
        lowStockAlert: 2,
    },

    // ── ELECTRIC BIKES ──────────────────────────────────────────────────────
    {
        name: 'Electric Scooter E10 Pro',
        series: 'Electric Bikes', year: 2024, sku: 'SCE10',
        price: 170000, salePrice: 133000, costPrice: 100000, stock: 8,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2025/01/81e-efWTckL.jpg',
        category: 'ELECTRIC BIKES',
        description: 'Free toolkit included. E10 model with 30 to 60 KM speed. 20-40 KM battery timing. 48 Volt Battery 13ah. Motor Power 1200W.',
        lowStockAlert: 3,
    },
    {
        name: 'Electric Scooty For Kids & Adults',
        series: 'Electric Bikes', year: 2024, sku: 'ESKIDS',
        price: 110000, salePrice: 80000, costPrice: 65000, stock: 10,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/Sade660d6c4b6410aa8c0195466cc9804y.jpg_720x720q80.jpg_.webp',
        category: 'ELECTRIC BIKES',
        description: 'Electric Scooty suitable for both kids and adults. Fun, eco-friendly and easy to ride.',
        lowStockAlert: 3,
    },

    // ── KID'S BIKES ─────────────────────────────────────────────────────────
    {
        name: '20" Kids Bicycle MTB 7 to 10 Years, Cycles for Boys',
        series: "Kid's Bikes", year: 2024, sku: 'KB20MTB',
        price: 35000, salePrice: 24500, costPrice: 18000, stock: 15,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/02bc13e51e4d60cf118138e5c0dc99ed.jpg_720x720q80.jpg_-1.webp',
        category: "KID'S BIKE",
        description: '20 inch kids MTB bicycle designed for boys aged 7 to 10 years. Sturdy build with safe braking system.',
        lowStockAlert: 5,
    },
    {
        name: 'Star Girl 16" Bicycle 6 to 8 Years Kids Royal Baby',
        series: "Kid's Bikes", year: 2024, sku: 'SG16RB',
        price: 40000, salePrice: 33500, costPrice: 25000, stock: 12,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/S2b17dd9462d2455b967d3eb689421c44i.jpg_720x720q80.jpg_.webp',
        category: "KID'S BIKE",
        description: 'Star Girl 16 inch bicycle for girls aged 6 to 8 years. Royal Baby brand with beautiful design and safe features.',
        lowStockAlert: 5,
    },
    {
        name: '12" MK Chimpunk Bicycle For 3 to 5 Year Kids RoyalBaby',
        series: "Kid's Bikes", year: 2024, sku: 'MKC12',
        price: 24500, salePrice: 24500, costPrice: 18000, stock: 10,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/9e325b12a3501db7dfda7cc6886bb686.jpg_720x720q80.jpg_.webp',
        category: "KID'S BIKE",
        description: '12 inch MK Chimpunk bicycle for boys aged 3 to 5 years. RoyalBaby brand with training wheels and safety features.',
        lowStockAlert: 5,
    },

    // ── PARTS ───────────────────────────────────────────────────────────────
    {
        name: 'Shimano Rear Derailleur Altus M310',
        series: 'Parts', year: 2024, sku: 'SHM310',
        price: 8500, salePrice: 7200, costPrice: 5000, stock: 20,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-23.png',
        category: 'PARTS',
        description: 'Shimano Altus M310 rear derailleur. Reliable 8-speed shifting for mountain and hybrid bikes.',
        lowStockAlert: 5,
    },
    {
        name: 'Kenda MTB Tyre 26x2.10',
        series: 'Parts', year: 2024, sku: 'KND26',
        price: 4500, salePrice: 3800, costPrice: 2500, stock: 25,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-23.png',
        category: 'PARTS',
        description: 'Kenda MTB tyre 26x2.10 inch. Durable knobby tyre for off-road and trail riding.',
        lowStockAlert: 5,
    },
    {
        name: 'Promax Mechanical Disc Brake Set',
        series: 'Parts', year: 2024, sku: 'PMX-DB',
        price: 6500, salePrice: 5500, costPrice: 4000, stock: 18,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-22.png',
        category: 'PARTS',
        description: 'Promax mechanical disc brake set. Reliable stopping power for mountain and hybrid bikes.',
        lowStockAlert: 5,
    },

    // ── ACCESSORIES ─────────────────────────────────────────────────────────
    {
        name: 'Cateye Volt 400 Front Light',
        series: 'Accessories', year: 2024, sku: 'CAT400',
        price: 5500, salePrice: 4800, costPrice: 3200, stock: 22,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-22.png',
        category: 'ACCESSORIES',
        description: 'Cateye Volt 400 front light. 400 lumen output with USB rechargeable battery.',
        lowStockAlert: 5,
    },
    {
        name: 'Bontrager Road Bike Helmet',
        series: 'Accessories', year: 2024, sku: 'BTR-H1',
        price: 18000, salePrice: 15500, costPrice: 11000, stock: 15,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/BT20_WEB_Editorial_Helmets_DM_1.png',
        category: 'ACCESSORIES',
        description: 'Bontrager road bike helmet. Lightweight with excellent ventilation and MIPS protection.',
        lowStockAlert: 5,
    },
    {
        name: 'Topeak Aero Wedge Saddle Bag',
        series: 'Accessories', year: 2024, sku: 'TPK-SB',
        price: 3500, salePrice: 2900, costPrice: 2000, stock: 30,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Ad_Card_E317.png',
        category: 'ACCESSORIES',
        description: 'Topeak Aero Wedge saddle bag. Compact and lightweight bag for essentials on every ride.',
        lowStockAlert: 5,
    },
    {
        name: 'Elite Fly Water Bottle 750ml',
        series: 'Accessories', year: 2024, sku: 'ELT-WB',
        price: 1800, salePrice: 1500, costPrice: 900, stock: 50,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/Rectangle-20.png',
        category: 'ACCESSORIES',
        description: 'Elite Fly 750ml water bottle. BPA-free, lightweight and easy to squeeze.',
        lowStockAlert: 10,
    },

    // ── APPAREL ─────────────────────────────────────────────────────────────
    {
        name: 'Pro Cycling Jersey Short Sleeve',
        series: 'Apparel', year: 2024, sku: 'CYJ-SS',
        price: 7500, salePrice: 6200, costPrice: 4500, stock: 25,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/BT20_WEB_Editorial_Helmets_DM_1.png',
        category: 'APPAREL',
        description: 'Pro cycling jersey short sleeve. Moisture-wicking fabric with 3 rear pockets and full zip.',
        lowStockAlert: 5,
    },
    {
        name: 'Pro Cycling Bib Shorts',
        series: 'Apparel', year: 2024, sku: 'CYB-BS',
        price: 9500, salePrice: 8000, costPrice: 6000, stock: 20,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/07/BT20_WEB_Editorial_Helmets_DM_1.png',
        category: 'APPAREL',
        description: 'Pro cycling bib shorts with premium chamois padding. Comfortable for long rides.',
        lowStockAlert: 5,
    },

    // ── SALE ────────────────────────────────────────────────────────────────
    {
        name: 'Trinx M136 27.5 MTB - SALE',
        series: 'Mountain Bikes', year: 2024, sku: 'TM136S',
        price: 95000, salePrice: 68000, costPrice: 55000, stock: 8,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp',
        category: 'SALE',
        description: 'Trinx M136 27.5 MTB on sale. Great value mountain bike with quality components.',
        lowStockAlert: 3,
    },

    // ── PRE-OWNED ────────────────────────────────────────────────────────────
    {
        name: 'Pre-Owned Trek Marlin 5 (2022)',
        series: 'Pre-Owned', year: 2022, sku: 'PO-TM5',
        price: 85000, salePrice: 55000, costPrice: 40000, stock: 1,
        image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg',
        category: 'PRE-OWNED',
        description: 'Pre-owned Trek Marlin 5 (2022). Excellent condition, fully serviced and ready to ride.',
        lowStockAlert: 1,
    },
];

async function seedWebProducts() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Purani products delete karo
    await Product.deleteMany({});
    console.log('Old products cleared');

    // Web wali products insert karo
    const inserted = await Product.insertMany(webProducts);
    console.log(`✅ ${inserted.length} web products seeded successfully!`);
    console.log('Categories:', [...new Set(webProducts.map(p => p.category))].join(', '));

    process.exit(0);
}

seedWebProducts().catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
