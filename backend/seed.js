require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Settings = require('./models/Settings');

const products = [
  // Hot Wheels Cars (15 products) - Using actual Hot Wheels product images
  { name: 'Hot Wheels Bone Shaker', series: 'Classics', year: 2023, sku: 'HW-001', barcode: '1234567890001', price: 1500, salePrice: 1200, costPrice: 800, stock: 25, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/c634106062727b64f1aa761126e57295.jpg_720x720q80.jpg', category: 'Hot Wheels', description: 'Classic bone shaker design with detailed interior' },
  { name: 'Hot Wheels Twin Mill', series: 'Legends', year: 2023, sku: 'HW-002', barcode: '1234567890002', price: 1800, salePrice: 1500, costPrice: 900, stock: 3, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/cb3fd2cd4691c58e130c512e1008c623.jpg_720x720q80.jpg_.webp', category: 'Hot Wheels', description: 'Twin engine monster truck' },
  { name: 'Hot Wheels Deora III', series: 'Originals', year: 2022, sku: 'HW-003', barcode: '1234567890003', price: 2000, salePrice: 1800, costPrice: 1000, stock: 0, image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/10/unnamed.png', category: 'Hot Wheels', description: 'Classic surf truck design' },
  { name: 'Hot Wheels Rip Rod', series: 'X-Raycers', year: 2023, sku: 'HW-004', barcode: '1234567890004', price: 1200, salePrice: 1000, costPrice: 600, stock: 15, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'Transparent X-ray car design' },
  { name: 'Hot Wheels Rodger Dodger', series: 'Muscle', year: 2022, sku: 'HW-005', barcode: '1234567890005', price: 1600, salePrice: 1400, costPrice: 800, stock: 4, image: 'https://images.unsplash.com/photo-1605559424843-9e4c228718c5?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'Classic muscle car' },
  { name: 'Hot Wheels Camaro Z28', series: 'Muscle', year: 2023, sku: 'HW-006', barcode: '1234567890006', price: 1700, salePrice: 1500, costPrice: 850, stock: 20, image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'Chevrolet Camaro Z28 replica' },
  { name: 'Hot Wheels Porsche 911', series: 'Car Culture', year: 2023, sku: 'HW-007', barcode: '1234567890007', price: 2200, salePrice: 1900, costPrice: 1200, stock: 12, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'German sports car classic' },
  { name: 'Hot Wheels Ferrari F40', series: 'Car Culture', year: 2023, sku: 'HW-008', barcode: '1234567890008', price: 2500, salePrice: 2200, costPrice: 1400, stock: 8, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'Italian supercar legend' },
  { name: 'Hot Wheels Lamborghini Countach', series: 'Car Culture', year: 2023, sku: 'HW-009', barcode: '1234567890009', price: 2800, salePrice: 2500, costPrice: 1600, stock: 6, image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'Italian supercar icon' },
  { name: 'Hot Wheels Nissan Skyline', series: 'J-Imports', year: 2023, sku: 'HW-010', barcode: '1234567890010', price: 2000, salePrice: 1800, costPrice: 1100, stock: 18, image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'Japanese sports car' },
  { name: 'Hot Wheels Toyota Supra', series: 'J-Imports', year: 2023, sku: 'HW-011', barcode: '1234567890011', price: 2300, salePrice: 2000, costPrice: 1200, stock: 14, image: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d11f?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'Japanese sports car legend' },
  { name: 'Hot Wheels Mazda RX-7', series: 'J-Imports', year: 2023, sku: 'HW-012', barcode: '1234567890012', price: 2100, salePrice: 1850, costPrice: 1150, stock: 16, image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'Rotary engine sports car' },
  { name: 'Hot Wheels Ford Mustang', series: 'Muscle', year: 2023, sku: 'HW-013', barcode: '1234567890013', price: 1900, salePrice: 1650, costPrice: 950, stock: 22, image: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'American muscle car icon' },
  { name: 'Hot Wheels Dodge Charger', series: 'Muscle', year: 2023, sku: 'HW-014', barcode: '1234567890014', price: 2000, salePrice: 1750, costPrice: 1000, stock: 11, image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'Classic American muscle car' },
  { name: 'Hot Wheels Corvette C8', series: 'Car Culture', year: 2023, sku: 'HW-015', barcode: '1234567890015', price: 2600, salePrice: 2300, costPrice: 1400, stock: 7, image: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=400&h=400&fit=crop', category: 'Hot Wheels', description: 'Modern American supercar' },

  // Bicycles (10 products) - Using actual bicycle images
  { name: 'Mountain Bike Pro', series: 'Mountain', year: 2023, sku: 'BIKE-001', barcode: '9876543210001', price: 15000, salePrice: 13000, costPrice: 9000, stock: 5, image: 'https://images.unsplash.com/photo-1576435728678-38d01d52e38c?w=400&h=400&fit=crop', category: 'Bicycles', description: 'Professional mountain bike with 21 gears' },
  { name: 'Road Racer 3000', series: 'Road', year: 2023, sku: 'BIKE-002', barcode: '9876543210002', price: 12000, salePrice: 10000, costPrice: 7000, stock: 8, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop', category: 'Bicycles', description: 'Lightweight road racing bike' },
  { name: 'City Commuter', series: 'Urban', year: 2023, sku: 'BIKE-003', barcode: '9876543210003', price: 8000, salePrice: 7000, costPrice: 5000, stock: 15, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop', category: 'Bicycles', description: 'Perfect for daily city commuting' },
  { name: 'Kids BMX Pro', series: 'BMX', year: 2023, sku: 'BIKE-004', barcode: '9876543210004', price: 6000, salePrice: 5000, costPrice: 3500, stock: 20, image: 'https://images.unsplash.com/photo-1585528470541-9e6a8c7535a7?w=400&h=400&fit=crop', category: 'Bicycles', description: 'Professional BMX for kids' },
  { name: 'Electric E-Bike', series: 'Electric', year: 2023, sku: 'BIKE-005', barcode: '9876543210005', price: 25000, salePrice: 22000, costPrice: 18000, stock: 3, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', category: 'Bicycles', description: 'Electric bike with 50km range' },
  { name: 'Hybrid Bike Pro', series: 'Hybrid', year: 2023, sku: 'BIKE-006', barcode: '9876543210006', price: 10000, salePrice: 8500, costPrice: 6000, stock: 12, image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=400&fit=crop', category: 'Bicycles', description: 'Perfect for both road and trail' },
  { name: 'Folding Bike Compact', series: 'Urban', year: 2023, sku: 'BIKE-007', barcode: '9876543210007', price: 9000, salePrice: 7500, costPrice: 5500, stock: 9, image: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop', category: 'Bicycles', description: 'Compact folding bike for easy storage' },
  { name: 'Kids Balance Bike', series: 'Kids', year: 2023, sku: 'BIKE-008', barcode: '9876543210008', price: 3000, salePrice: 2500, costPrice: 1800, stock: 25, image: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=400&h=400&fit=crop', category: 'Bicycles', description: 'Perfect balance bike for toddlers' },
  { name: 'Cyclocross Bike', series: 'Cyclocross', year: 2023, sku: 'BIKE-009', barcode: '9876543210009', price: 14000, salePrice: 12000, costPrice: 8500, stock: 6, image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&h=400&fit=crop', category: 'Bicycles', description: 'Versatile bike for all terrains' },
  { name: 'Track Bike Fixed', series: 'Track', year: 2023, sku: 'BIKE-010', barcode: '9876543210010', price: 11000, salePrice: 9500, costPrice: 6500, stock: 7, image: 'https://images.unsplash.com/photo-1528629297340-d1d466945dc5?w=400&h=400&fit=crop', category: 'Bicycles', description: 'Fixed gear track bike for racing' },

  // Accessories (10 products) - Using actual accessory images
  { name: 'Helmet Pro', series: 'Safety', year: 2023, sku: 'ACC-001', barcode: '5555555550001', price: 1500, salePrice: 1200, costPrice: 800, stock: 30, image: 'https://images.unsplash.com/photo-1576368755264-fc8e1c3b8b6c?w=400&h=400&fit=crop', category: 'Accessories', description: 'Professional cycling helmet' },
  { name: 'Bike Lock Ultra', series: 'Security', year: 2023, sku: 'ACC-002', barcode: '5555555550002', price: 800, salePrice: 600, costPrice: 400, stock: 25, image: 'https://images.unsplash.com/photo-1555662395-3c643f3b8f8e?w=400&h=400&fit=crop', category: 'Accessories', description: 'Heavy duty bike lock' },
  { name: 'Water Bottle 750ml', series: 'Hydration', year: 2023, sku: 'ACC-003', barcode: '5555555550003', price: 300, salePrice: 250, costPrice: 150, stock: 50, image: 'https://images.unsplash.com/photo-1602143407151-01114192003f?w=400&h=400&fit=crop', category: 'Accessories', description: 'Insulated water bottle' },
  { name: 'Bike Pump Pro', series: 'Maintenance', year: 2023, sku: 'ACC-004', barcode: '5555555550004', price: 1200, salePrice: 1000, costPrice: 600, stock: 18, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', category: 'Accessories', description: 'High pressure bike pump' },
  { name: 'LED Light Set', series: 'Safety', year: 2023, sku: 'ACC-005', barcode: '5555555550005', price: 800, salePrice: 600, costPrice: 450, stock: 22, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop', category: 'Accessories', description: 'Front and rear LED lights' },
  { name: 'Cycling Gloves', series: 'Apparel', year: 2023, sku: 'ACC-006', barcode: '5555555550006', price: 600, salePrice: 450, costPrice: 300, stock: 35, image: 'https://images.unsplash.com/photo-1584273568862-b8c5cf8d6c5d?w=400&h=400&fit=crop', category: 'Accessories', description: 'Professional cycling gloves' },
  { name: 'Bike Phone Mount', series: 'Accessories', year: 2023, sku: 'ACC-007', barcode: '5555555550007', price: 400, salePrice: 300, costPrice: 200, stock: 40, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', category: 'Accessories', description: 'Universal phone mount for bikes' },
  { name: 'Cycling Shorts', series: 'Apparel', year: 2023, sku: 'ACC-008', barcode: '5555555550008', price: 1200, salePrice: 900, costPrice: 600, stock: 28, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop', category: 'Accessories', description: 'Professional cycling shorts' },
  { name: 'Bike Bell Classic', series: 'Safety', year: 2023, sku: 'ACC-009', barcode: '5555555550009', price: 200, salePrice: 150, costPrice: 100, stock: 60, image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&h=400&fit=crop', category: 'Accessories', description: 'Classic brass bike bell' },
  { name: 'Cycling Sunglasses', series: 'Safety', year: 2023, sku: 'ACC-010', barcode: '5555555550010', price: 800, salePrice: 650, costPrice: 400, stock: 20, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', category: 'Accessories', description: 'UV protection cycling sunglasses' },

  // Parts (10 products) - Using actual bike part images
  { name: 'Mountain Tires Set', series: 'Parts', year: 2023, sku: 'PART-001', barcode: '7777777770001', price: 3000, salePrice: 2500, costPrice: 1800, stock: 12, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', category: 'Parts', description: 'Set of 2 mountain bike tires' },
  { name: 'Road Tires Set', series: 'Parts', year: 2023, sku: 'PART-002', barcode: '7777777770002', price: 2500, salePrice: 2200, costPrice: 1500, stock: 15, image: 'https://images.unsplash.com/photo-1576435728678-38d01d52e38c?w=400&h=400&fit=crop', category: 'Parts', description: 'Set of 2 road bike tires' },
  { name: 'Brake Pads Set', series: 'Parts', year: 2023, sku: 'PART-003', barcode: '7777777770003', price: 800, salePrice: 600, costPrice: 400, stock: 30, image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&h=400&fit=crop', category: 'Parts', description: 'Universal brake pads set' },
  { name: 'Chain Lubricant', series: 'Maintenance', year: 2023, sku: 'PART-004', barcode: '7777777770004', price: 400, salePrice: 350, costPrice: 200, stock: 40, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', category: 'Parts', description: 'Professional chain lubricant' },
  { name: 'Gear Shifter Set', series: 'Parts', year: 2023, sku: 'PART-005', barcode: '7777777770005', price: 1500, salePrice: 1200, costPrice: 800, stock: 10, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop', category: 'Parts', description: '21-speed gear shifter set' },
  { name: 'Bike Chain Set', series: 'Parts', year: 2023, sku: 'PART-006', barcode: '7777777770006', price: 600, salePrice: 450, costPrice: 300, stock: 25, image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=400&fit=crop', category: 'Parts', description: 'High quality bike chain' },
  { name: 'Handlebar Grips', series: 'Parts', year: 2023, sku: 'PART-007', barcode: '7777777770007', price: 300, salePrice: 250, costPrice: 150, stock: 45, image: 'https://images.unsplash.com/photo-1584273568862-b8c5cf8d6c5d?w=400&h=400&fit=crop', category: 'Parts', description: 'Comfortable handlebar grips' },
  { name: 'Pedal Set Pro', series: 'Parts', year: 2023, sku: 'PART-008', barcode: '7777777770008', price: 800, salePrice: 650, costPrice: 400, stock: 18, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop', category: 'Parts', description: 'Professional pedal set' },
  { name: 'Seat Post Clamp', series: 'Parts', year: 2023, sku: 'PART-009', barcode: '7777777770009', price: 200, salePrice: 150, costPrice: 100, stock: 35, image: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop', category: 'Parts', description: 'Adjustable seat post clamp' },
  { name: 'Spoke Reflector Set', series: 'Safety', year: 2023, sku: 'PART-010', barcode: '7777777770010', price: 150, salePrice: 120, costPrice: 80, stock: 50, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop', category: 'Parts', description: 'High visibility spoke reflectors' },
];

const customers = [
  { name: 'Ahmed Khan', email: 'ahmed@email.com', phone: '+92 300 1234567', city: 'Karachi', totalOrders: 5, totalSpent: 12000 },
  { name: 'Sara Ali', email: 'sara@email.com', phone: '+92 321 9876543', city: 'Karachi', totalOrders: 3, totalSpent: 7500 },
  { name: 'Hassan Raza', email: 'hassan@email.com', phone: '+92 333 5551234', city: 'Lahore', totalOrders: 8, totalSpent: 18000 },
  { name: 'Fatima Noor', email: 'fatima@email.com', phone: '+92 345 7778888', city: 'Karachi', totalOrders: 2, totalSpent: 4000 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([Admin.deleteMany(), Product.deleteMany(), Customer.deleteMany(), Settings.deleteMany()]);

  // Single Super Admin — full access
  // Default credentials: see README.md — change immediately after first login
  await Admin.create({ name: 'Admin', email: 'admin@hotwheels.com', password: 'admin123', role: 'super_admin' });

  await Product.insertMany(products);
  await Customer.insertMany(customers);
  await Settings.create({ storeName: 'Hot Wheels Bikes', currency: 'PKR', taxRate: 0, shippingCost: 200 });

  console.log('✅ Seed complete!');
  console.log('   Admin → admin@hotwheels.com / admin123 (change immediately)');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
