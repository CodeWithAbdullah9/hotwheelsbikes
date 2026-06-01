require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function checkRealData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Check products
  const products = await Product.find();
  console.log(`\n📦 Products: ${products.length} found`);
  products.forEach(p => {
    console.log(`  - ${p.name} (Stock: ${p.stock}, Price: Rs.${p.price})`);
  });

  // Check orders
  const orders = await Order.find();
  console.log(`\n📋 Orders: ${orders.length} found`);
  orders.forEach(o => {
    console.log(`  - ${o.orderNumber} (${o.customer.name}) - Rs.${o.total} - ${o.status}`);
  });

  // Calculate real stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const onlineOrders = orders.filter(o => o.source === 'online').length;
  const posOrders = orders.filter(o => o.source === 'pos').length;
  
  console.log(`\n📊 Real Statistics:`);
  console.log(`  - Total Revenue: Rs.${totalRevenue}`);
  console.log(`  - Online Orders: ${onlineOrders}`);
  console.log(`  - POS Orders: ${posOrders}`);
  console.log(`  - Total Orders: ${orders.length}`);

  process.exit(0);
}

checkRealData().catch(err => {
  console.error(err);
  process.exit(1);
});
