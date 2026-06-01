# Hot Wheels Bikes — Full Stack E-Commerce

Pakistan's #1 Bike Store — DHA Phase 4, Karachi

## Project Structure

```
hotwheels-bikes/
├── frontend/     # React + Vite (Customer Website) — Port 5174
├── admin/        # React + Vite (Admin Panel)       — Port 5190
└── backend/      # Node.js + Express + MongoDB       — Port 5001
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
# Copy .env.example to .env and fill in your values
npm run dev
```

### 2. Frontend (Customer Website)
```bash
cd frontend
npm install
npm run dev
```

### 3. Admin Panel
```bash
cd admin
npm install
npm run dev
```

## Environment Variables (backend/.env)

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/hotwheels_admin
JWT_SECRET=your_jwt_secret
USER_JWT_SECRET=your_user_jwt_secret

# Email Notifications
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@yourdomain.com

# WhatsApp Notifications (CallMeBot)
WHATSAPP_PHONE=923xxxxxxxxx
WHATSAPP_APIKEY=your_callmebot_apikey
```

## Seed Database

```bash
cd backend
node seedWebProducts.js   # Seeds 22 web products
node seed.js              # Seeds admin user + sample data
```

## Admin Login
- URL: http://localhost:5190
- Email: admin@hotwheels.com
- Password: admin123

## Features
- Full e-commerce storefront with cart & checkout
- Multiple payment methods (COD, Bank Transfer, JazzCash, EasyPaisa, Stripe)
- Automatic customer account creation on order
- Email + WhatsApp notifications on new orders
- Admin panel with inventory, orders, POS, reports
- Google OAuth login
