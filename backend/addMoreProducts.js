require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function addMoreProducts() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  const moreProducts = [
    // More Hot Wheels
    {
      name: 'Hot Wheels Ferrari 488',
      series: 'Classics',
      year: 2024,
      category: 'Hot Wheels',
      price: 3500,
      salePrice: 2800,
      stock: 8,
      sku: 'HW-011',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2023/01/ferrari-488.png',
      description: 'Ferrari 488 GTB replica with detailed interior and authentic design',
      lowStockAlert: 5
    },
    {
      name: 'Hot Wheels Lamborghini Huracan',
      series: 'Classics',
      year: 2024,
      category: 'Hot Wheels',
      price: 3200,
      salePrice: 2600,
      stock: 12,
      sku: 'HW-012',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2023/01/lamborghini-huracan.png',
      description: 'Lamborghini Huracan performante with racing livery',
      lowStockAlert: 5
    },
    {
      name: 'Hot Wheels McLaren P1',
      series: 'Classics',
      year: 2024,
      category: 'Hot Wheels',
      price: 4000,
      salePrice: 3500,
      stock: 6,
      sku: 'HW-013',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2023/01/mclaren-p1.png',
      description: 'McLaren P1 hypercar with hybrid technology design',
      lowStockAlert: 5
    },
    {
      name: 'Hot Wheels Bugatti Chiron',
      series: 'Classics',
      year: 2024,
      category: 'Hot Wheels',
      price: 4500,
      salePrice: 3800,
      stock: 4,
      sku: 'HW-014',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2023/01/bugatti-chiron.png',
      description: 'Bugatti Chiron supercar with detailed engine and aerodynamics',
      lowStockAlert: 3
    },
    {
      name: 'Hot Wheels Porsche 918',
      series: 'Classics',
      year: 2024,
      category: 'Hot Wheels',
      price: 3800,
      salePrice: 3200,
      stock: 7,
      sku: 'HW-015',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2023/01/porsche-918.png',
      description: 'Porsche 918 Spyder hybrid supercar replica',
      lowStockAlert: 5
    },

    // More Bicycles
    {
      name: 'Professional Road Bike Carbon',
      series: 'Road Bikes',
      year: 2024,
      category: 'Bicycles',
      price: 85000,
      salePrice: 75000,
      stock: 3,
      sku: 'BIKE-006',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/carbon-road-bike.png',
      description: 'Professional carbon fiber road bike with Shimano Ultegra components',
      lowStockAlert: 2
    },
    {
      name: 'Mountain Bike Full Suspension',
      series: 'Mountain Bikes',
      year: 2024,
      category: 'Bicycles',
      price: 65000,
      salePrice: 55000,
      stock: 5,
      sku: 'BIKE-007',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/full-suspension-mtb.png',
      description: 'Full suspension mountain bike with 27.5" wheels and hydraulic disc brakes',
      lowStockAlert: 3
    },
    {
      name: 'Hybrid City Bike',
      series: 'Hybrid Bikes',
      year: 2024,
      category: 'Bicycles',
      price: 35000,
      salePrice: 28000,
      stock: 8,
      sku: 'BIKE-008',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/hybrid-city-bike.png',
      description: 'Comfortable hybrid bike perfect for city commuting and light trails',
      lowStockAlert: 5
    },
    {
      name: 'Electric Mountain Bike E-MTB',
      series: 'Electric Bikes',
      year: 2024,
      category: 'Bicycles',
      price: 120000,
      salePrice: 95000,
      stock: 2,
      sku: 'BIKE-009',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/electric-mountain-bike.png',
      description: 'Electric mountain bike with 250W motor and long-range battery',
      lowStockAlert: 2
    },
    {
      name: 'Kids Mountain Bike 24"',
      series: 'Kids Bikes',
      year: 2024,
      category: 'Bicycles',
      price: 18000,
      salePrice: 15000,
      stock: 12,
      sku: 'BIKE-010',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/kids-mountain-bike.png',
      description: '24" mountain bike perfect for kids aged 9-12 with 21 speeds',
      lowStockAlert: 5
    },

    // More Accessories
    {
      name: 'Professional Cycling Helmet',
      series: 'Safety Gear',
      year: 2024,
      category: 'Accessories',
      price: 3500,
      salePrice: 2800,
      stock: 25,
      sku: 'ACC-006',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/pro-helmet.png',
      description: 'Professional cycling helmet with MIPS protection technology',
      lowStockAlert: 10
    },
    {
      name: 'Cycling Gloves Premium',
      series: 'Apparel',
      year: 2024,
      category: 'Accessories',
      price: 1200,
      salePrice: 900,
      stock: 40,
      sku: 'ACC-007',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/cycling-gloves.png',
      description: 'Premium cycling gloves with gel padding and breathable fabric',
      lowStockAlert: 15
    },
    {
      name: 'Cycling Shorts Professional',
      series: 'Apparel',
      year: 2024,
      category: 'Accessories',
      price: 4500,
      salePrice: 3800,
      stock: 20,
      sku: 'ACC-008',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/cycling-shorts.png',
      description: 'Professional cycling shorts with chamois padding for long rides',
      lowStockAlert: 10
    },
    {
      name: 'Cycling Shoes Clipless',
      series: 'Apparel',
      year: 2024,
      category: 'Accessories',
      price: 6500,
      salePrice: 5500,
      stock: 15,
      sku: 'ACC-009',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/cycling-shoes.png',
      description: 'Clipless cycling shoes compatible with major pedal systems',
      lowStockAlert: 8
    },
    {
      name: 'Cycling Sunglasses',
      series: 'Accessories',
      year: 2024,
      category: 'Accessories',
      price: 2800,
      salePrice: 2200,
      stock: 30,
      sku: 'ACC-010',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/cycling-sunglasses.png',
      description: 'UV protection cycling sunglasses with interchangeable lenses',
      lowStockAlert: 12
    },

    // More Parts
    {
      name: 'Shimano Deore XT Groupset',
      series: 'Components',
      year: 2024,
      category: 'Parts',
      price: 45000,
      salePrice: 38000,
      stock: 3,
      sku: 'PART-006',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/shimano-xt.png',
      description: 'Complete Shimano Deore XT groupset for high-performance mountain bikes',
      lowStockAlert: 2
    },
    {
      name: 'Fox Suspension Fork',
      series: 'Components',
      year: 2024,
      category: 'Parts',
      price: 25000,
      salePrice: 20000,
      stock: 4,
      sku: 'PART-007',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/fox-fork.png',
      description: 'Fox 34 suspension fork with 120mm travel for trail riding',
      lowStockAlert: 2
    },
    {
      name: 'Carbon Handlebars',
      series: 'Components',
      year: 2024,
      category: 'Parts',
      price: 8500,
      salePrice: 7000,
      stock: 8,
      sku: 'PART-008',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/carbon-bars.png',
      description: 'Lightweight carbon fiber handlebars with ergonomic design',
      lowStockAlert: 5
    },
    {
      name: 'Hydraulic Disc Brakes Set',
      series: 'Components',
      year: 2024,
      category: 'Parts',
      price: 12000,
      salePrice: 9500,
      stock: 6,
      sku: 'PART-009',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/disc-brakes.png',
      description: 'Complete hydraulic disc brake set with rotors and hoses',
      lowStockAlert: 3
    },
    {
      name: 'Tubeless Wheelset',
      series: 'Components',
      year: 2024,
      category: 'Parts',
      price: 18000,
      salePrice: 15000,
      stock: 5,
      sku: 'PART-010',
      image: 'https://hotwheelsbikes.com/wp-content/uploads/2024/01/wheelset.png',
      description: 'Tubeless ready wheelset with quick release hubs',
      lowStockAlert: 3
    }
  ];

  console.log(`Adding ${moreProducts.length} more products...`);
  
  for (const product of moreProducts) {
    await Product.create(product);
    console.log(`✅ Added: ${product.name}`);
  }

  console.log(`\n🎉 Successfully added ${moreProducts.length} more products!`);
  
  const totalProducts = await Product.countDocuments();
  console.log(`📊 Total products in database: ${totalProducts}`);

  process.exit(0);
}

addMoreProducts().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
