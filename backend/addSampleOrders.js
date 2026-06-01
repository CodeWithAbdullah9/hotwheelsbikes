require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');

async function addSampleOrders() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Get some products
  const products = await Product.find().limit(10);
  
  if (products.length === 0) {
    console.log('No products found. Please run seed first.');
    process.exit(1);
  }

  const sampleOrders = [
    {
      customer: {
        name: 'Ahmed Khan',
        email: 'ahmed@email.com',
        phone: '+92 300 1234567',
        address: 'Karachi, Pakistan'
      },
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          price: products[0].price,
          quantity: 2,
          subtotal: products[0].price * 2
        },
        {
          product: products[1]._id,
          name: products[1].name,
          price: products[1].price,
          quantity: 1,
          subtotal: products[1].price
        }
      ],
      subtotal: (products[0].price * 2) + products[1].price,
      discount: 200,
      tax: 0,
      shippingCost: 200,
      total: (products[0].price * 2) + products[1].price + 200 - 200,
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      status: 'delivered',
      source: 'online',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      customer: {
        name: 'Sara Ali',
        email: 'sara@email.com',
        phone: '+92 321 9876543',
        address: 'Lahore, Pakistan'
      },
      items: [
        {
          product: products[2]._id,
          name: products[2].name,
          price: products[2].price,
          quantity: 1,
          subtotal: products[2].price
        }
      ],
      subtotal: products[2].price,
      discount: 0,
      tax: 0,
      shippingCost: 200,
      total: products[2].price + 200,
      paymentMethod: 'card',
      paymentStatus: 'paid',
      status: 'shipped',
      source: 'online',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      customer: {
        name: 'Walk-in Customer',
        phone: 'N/A'
      },
      items: [
        {
          product: products[3]._id,
          name: products[3].name,
          price: products[3].price,
          quantity: 3,
          subtotal: products[3].price * 3
        }
      ],
      subtotal: products[3].price * 3,
      discount: 500,
      tax: 300,
      shippingCost: 0,
      total: (products[3].price * 3) - 500 + 300,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      status: 'delivered',
      source: 'pos',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    },
    {
      customer: {
        name: 'Hassan Raza',
        email: 'hassan@email.com',
        phone: '+92 333 5551234',
        address: 'Islamabad, Pakistan'
      },
      items: [
        {
          product: products[4]._id,
          name: products[4].name,
          price: products[4].price,
          quantity: 1,
          subtotal: products[4].price
        },
        {
          product: products[5]._id,
          name: products[5].name,
          price: products[5].price,
          quantity: 2,
          subtotal: products[5].price * 2
        }
      ],
      subtotal: products[4].price + (products[5].price * 2),
      discount: 0,
      tax: 0,
      shippingCost: 200,
      total: products[4].price + (products[5].price * 2) + 200,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'pending',
      status: 'processing',
      source: 'online',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
      customer: {
        name: 'Fatima Noor',
        email: 'fatima@email.com',
        phone: '+92 345 7778888',
        address: 'Peshawar, Pakistan'
      },
      items: [
        {
          product: products[6]._id,
          name: products[6].name,
          price: products[6].price,
          quantity: 1,
          subtotal: products[6].price
        }
      ],
      subtotal: products[6].price,
      discount: 100,
      tax: 0,
      shippingCost: 200,
      total: products[6].price + 200 - 100,
      paymentMethod: 'jazzcash',
      paymentStatus: 'paid',
      status: 'pending',
      source: 'online',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    }
  ];

  // Clear existing orders
  await Order.deleteMany({});
  
  // Insert sample orders one by one to handle order number generation
  for (const order of sampleOrders) {
    await Order.create(order);
  }
  
  console.log('✅ Sample orders added successfully!');
  console.log(`   Added ${sampleOrders.length} orders`);
  process.exit(0);
}

addSampleOrders().catch(err => {
  console.error(err);
  process.exit(1);
});
