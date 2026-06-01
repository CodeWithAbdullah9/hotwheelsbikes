const nodemailer = require('nodemailer');
const https = require('https');

// ─── WhatsApp Notification via CallMeBot ────────────────────────────────────
// Setup: Send "I allow callmebot to send me messages" to +34 644 59 77 88 on WhatsApp
// Then set WHATSAPP_PHONE and WHATSAPP_APIKEY in .env
async function sendWhatsAppNotification(message) {
  const phone = process.env.WHATSAPP_PHONE;
  const apiKey = process.env.WHATSAPP_APIKEY;
  if (!phone || !apiKey) return;

  const encoded = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apiKey}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      res.on('data', () => { });
      res.on('end', () => resolve());
    }).on('error', (err) => {
      console.error('WhatsApp notification failed:', err.message);
      resolve();
    });
  });
}

// Transporter — Gmail ya koi bhi SMTP
function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });
}

// Admin ko new order notification
async function notifyAdminNewOrder(order) {
  const transporter = getTransporter();
  if (!transporter || !process.env.ADMIN_EMAIL) return;

  const itemsList = order.items.map(i =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">Rs. ${i.price.toLocaleString()}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">Rs. ${i.subtotal.toLocaleString()}</td>
    </tr>`
  ).join('');

  const paymentMethodLabel = {
    cod: 'Cash on Delivery',
    bank_transfer: 'Bank Transfer',
    jazzcash: 'JazzCash',
    easypaisa: 'EasyPaisa',
    stripe: 'Card (Stripe)',
  }[order.paymentMethod] || order.paymentMethod;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
      <div style="background:#16a34a;padding:20px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:22px">New Order Received!</h1>
        <p style="color:#d1fae5;margin:8px 0 0">Hot Wheels Bikes</p>
      </div>
      <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:20px">
          <p style="margin:0;font-size:18px;font-weight:bold;color:#15803d">Order #${order.orderNumber}</p>
          <p style="margin:4px 0 0;color:#6b7280;font-size:14px">Total: <strong style="color:#15803d">Rs. ${order.total.toLocaleString()}</strong></p>
        </div>

        <h3 style="color:#374151;margin:0 0 12px">Customer Details</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr><td style="padding:6px 0;color:#6b7280;width:120px">Name:</td><td style="padding:6px 0;font-weight:600">${order.customer.name}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Phone:</td><td style="padding:6px 0;font-weight:600">${order.customer.phone}</td></tr>
          ${order.customer.email ? `<tr><td style="padding:6px 0;color:#6b7280">Email:</td><td style="padding:6px 0">${order.customer.email}</td></tr>` : ''}
          <tr><td style="padding:6px 0;color:#6b7280">Address:</td><td style="padding:6px 0">${order.customer.address || 'N/A'}</td></tr>
        </table>

        <h3 style="color:#374151;margin:0 0 12px">Order Items</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:8px;text-align:left;font-size:13px">Product</th>
              <th style="padding:8px;text-align:center;font-size:13px">Qty</th>
              <th style="padding:8px;text-align:right;font-size:13px">Price</th>
              <th style="padding:8px;text-align:right;font-size:13px">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsList}</tbody>
        </table>

        <div style="border-top:2px solid #e5e7eb;padding-top:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="color:#6b7280">Subtotal:</span>
            <span>Rs. ${order.subtotal.toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="color:#6b7280">Shipping:</span>
            <span>Rs. ${(order.shippingCost || 0).toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:bold;color:#15803d;margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb">
            <span>Total:</span>
            <span>Rs. ${order.total.toLocaleString()}</span>
          </div>
        </div>

        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px;margin-top:20px">
          <p style="margin:0;font-weight:600;color:#92400e">Payment Method: ${paymentMethodLabel}</p>
          ${order.paymentMethod !== 'cod' ? '<p style="margin:4px 0 0;color:#92400e;font-size:13px">Please verify payment before processing this order.</p>' : ''}
        </div>

        <div style="text-align:center;margin-top:24px">
          <a href="http://localhost:5190/orders" style="background:#16a34a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
            View in Admin Panel
          </a>
        </div>
      </div>
      <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px">Hot Wheels Bikes — DHA Phase 4, Karachi</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Hot Wheels Bikes" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${order.orderNumber} — Rs. ${order.total.toLocaleString()} (${paymentMethodLabel})`,
      html,
    });
    console.log(`Email sent to admin for order ${order.orderNumber}`);
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
}

// Customer ko order confirmation email
async function sendOrderConfirmationToCustomer(order) {
  const transporter = getTransporter();
  if (!transporter || !order.customer.email) return;

  const itemsList = order.items.map(i =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">Rs. ${i.subtotal.toLocaleString()}</td>
    </tr>`
  ).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
      <div style="background:#16a34a;padding:20px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:22px">Order Confirmed!</h1>
        <p style="color:#d1fae5;margin:8px 0 0">Thank you for shopping with Hot Wheels Bikes</p>
      </div>
      <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
        <p style="color:#374151">Hi <strong>${order.customer.name}</strong>,</p>
        <p style="color:#6b7280">Your order has been received and is being processed. We will contact you shortly to confirm.</p>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0">
          <p style="margin:0;font-size:18px;font-weight:bold;color:#15803d">Order #${order.orderNumber}</p>
          <p style="margin:4px 0 0;color:#6b7280;font-size:14px">Total: <strong style="color:#15803d">Rs. ${order.total.toLocaleString()}</strong></p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:8px;text-align:left;font-size:13px">Product</th>
              <th style="padding:8px;text-align:center;font-size:13px">Qty</th>
              <th style="padding:8px;text-align:right;font-size:13px">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsList}</tbody>
        </table>

        <div style="border-top:2px solid #e5e7eb;padding-top:16px;text-align:right">
          <p style="font-size:18px;font-weight:bold;color:#15803d">Total: Rs. ${order.total.toLocaleString()}</p>
        </div>

        <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin-top:20px">
          <p style="margin:0;font-weight:600;color:#374151">Delivery Address:</p>
          <p style="margin:4px 0 0;color:#6b7280">${order.customer.address || 'N/A'}</p>
        </div>

        <p style="color:#6b7280;margin-top:20px;font-size:14px">
          Questions? Contact us:<br>
          Phone: <a href="tel:+923361320540" style="color:#16a34a">+0336 1320540</a><br>
          WhatsApp: <a href="https://wa.me/923361320540" style="color:#16a34a">Chat with us</a>
        </p>
      </div>
      <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px">Hot Wheels Bikes — DHA Phase 4, Karachi</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Hot Wheels Bikes" <${process.env.EMAIL_USER}>`,
      to: order.customer.email,
      subject: `Order Confirmed #${order.orderNumber} — Hot Wheels Bikes`,
      html,
    });
    console.log(`Confirmation email sent to ${order.customer.email}`);
  } catch (err) {
    console.error('Customer email failed:', err.message);
  }
}

module.exports = { notifyAdminNewOrder, sendOrderConfirmationToCustomer, sendWhatsAppNotification };
