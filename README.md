# 🚲 Hot Wheels Bikes — Full Stack E-Commerce Platform

> Pakistan's #1 Bike Store — Established 1990. A complete full-stack e-commerce platform with a customer-facing storefront, admin panel, and Point of Sale (POS) system.

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://hotwheelsbikes.vercel.app)
[![Admin](https://img.shields.io/badge/Admin-Vercel-black?logo=vercel)](https://hotwheelsbikes-admin.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-purple?logo=railway)](https://hotwheelsbikes-production.up.railway.app)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?logo=mongodb)](https://cloud.mongodb.com)

---

## 📸 Overview

| | |
|---|---|
| **Store** | Full e-commerce website with product catalog, cart, checkout, and order tracking |
| **Admin Panel** | Complete back-office for managing products, orders, customers, and reports |
| **POS System** | In-store point-of-sale terminal with barcode scanning and receipt printing |
| **Payments** | Cash on Delivery, Bank Transfer, JazzCash, EasyPaisa, Stripe |

---

## 🏗️ Tech Stack

### Frontend (Customer Store)
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 4 | Utility styling |
| Axios | 1.x | HTTP client |
| Lucide React | Latest | Icons |

### Admin Panel
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | Latest | Build tool |
| Recharts | Latest | Analytics charts |
| Lucide React | Latest | Icons |

### Backend (API Server)
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 4 | Web framework |
| MongoDB | Atlas | Database |
| Mongoose | 8 | ODM |
| JWT | 9 | Authentication |
| Passport.js | 0.7 | Google OAuth |
| Multer | 1.x | File uploads |
| Nodemailer | 8 | Email notifications |
| Stripe | 22 | Card payments |
| bcryptjs | 2.x | Password hashing |

---

## 📁 Project Structure

```
hotwheels-bikes/
├── frontend/               # Customer-facing React storefront
│   ├── src/
│   │   ├── components/     # Navbar, Footer, CartDrawer, ProductCard
│   │   ├── context/        # CartContext, UserContext
│   │   ├── hooks/          # useWindowWidth
│   │   ├── pages/          # Home, Shop, ProductDetail, Checkout, etc.
│   │   └── data/           # Static product data, formatPrice helpers
│   ├── vercel.json         # Vercel proxy config → Railway backend
│   └── vite.config.js
│
├── admin/                  # Admin panel React app
│   ├── src/
│   │   ├── components/     # Layout, Sidebar
│   │   └── pages/          # Dashboard, Inventory, Orders, POS, etc.
│   ├── vercel.json         # Vercel proxy config → Railway backend
│   └── vite.config.js
│
├── backend/                # Node.js + Express API server
│   ├── middleware/         # auth.js (JWT), passport.js (Google OAuth)
│   ├── models/             # Mongoose models
│   │   ├── Admin.js
│   │   ├── Customer.js
│   │   ├── Order.js
│   │   ├── POSSale.js
│   │   ├── Product.js
│   │   ├── Settings.js
│   │   ├── StockLog.js
│   │   └── SystemLog.js
│   ├── routes/             # Express route handlers
│   │   ├── auth.js         # Admin authentication
│   │   ├── customers.js
│   │   ├── logs.js
│   │   ├── orders.js
│   │   ├── payment.js
│   │   ├── pos.js
│   │   ├── products.js
│   │   ├── reports.js
│   │   ├── settings.js
│   │   └── userAuth.js     # Customer authentication + Google OAuth
│   ├── .env.example        # Environment variable template
│   └── server.js           # App entry point
│
└── .gitignore
```

---

## 🚀 Features

### 🛍️ Customer Store
- Product catalog with category filtering, search, and sorting
- Product detail pages with image gallery
- Shopping cart with persistent storage
- Multi-step checkout (COD, Bank Transfer, JazzCash, EasyPaisa, Stripe)
- Payment screenshot upload
- Order confirmation and tracking
- Customer accounts with Google OAuth login
- Order history
- Fully responsive (mobile + desktop)

### 🔧 Admin Panel
- **Dashboard** — Live revenue stats, charts, recent orders, low stock alerts
- **Inventory** — Add/edit/delete products, bulk CSV import/export, stock logs
- **Orders** — Manage online + POS orders, update status, verify payments
- **POS** — In-store sales terminal with barcode scanning, discount/tax, receipt print
- **Customers** — View profiles, order history, block/unblock
- **Reports** — Sales analytics (online vs POS), inventory reports, date filtering
- **Settings** — Store info, payment method config, admin user management
- **System Logs** — Full audit trail of admin actions and stock changes
- Role-based access (super_admin, inventory_manager, pos_operator)

### ⚙️ Backend API
- RESTful API with JWT authentication
- Google OAuth 2.0 for customers
- Soft-delete for products (isActive flag)
- Stock log tracking on every change
- System audit logs for all admin actions
- Email notifications on new orders
- Image upload via Multer
- Stripe webhook handling

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas account)

### 1. Clone the repository

```bash
git clone https://github.com/CodeWithAbdullah9/hotwheelsbikes.git
cd hotwheelsbikes
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see Environment Variables section below)
npm run dev
```

Backend runs on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5174`

### 4. Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

Admin runs on `http://localhost:5190`

### 5. Seed Initial Data

After backend is running, visit:
```
http://localhost:5001/api/seed-init
```

This creates:
- Default admin account
- Store settings
- 45 sample products

---

## 🌍 Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in the values:

```env
# Server
PORT=5001
NODE_ENV=development

# Database — MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# Admin JWT — use a long random string
JWT_SECRET=<random_secret_min_32_chars>
JWT_EXPIRES_IN=7d

# Customer JWT — use a different long random string
USER_JWT_SECRET=<random_secret_min_32_chars>
USER_JWT_EXPIRES_IN=30d

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5174

# Google OAuth (optional — for customer Google login)
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
GOOGLE_CALLBACK_URL=http://localhost:5001/api/user/auth/google/callback

# Stripe (optional — for card payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email notifications (optional — Gmail App Password)
EMAIL_USER=your@gmail.com
EMAIL_PASS=<16-char Gmail App Password>
ADMIN_EMAIL=admin@yourdomain.com

# WhatsApp notifications via CallMeBot (optional)
WHATSAPP_PHONE=923xxxxxxxxx
WHATSAPP_APIKEY=<callmebot apikey>
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

---

## 🌐 Deployment

### Architecture
```
[Customer Browser] → [Vercel — Frontend]  ─┐
[Admin Browser]   → [Vercel — Admin Panel] ─┤→ [Railway — Backend API] → [MongoDB Atlas]
```

### Backend — Railway
1. Connect GitHub repo to Railway
2. Set root directory to `backend/`
3. Add all environment variables from `.env.example`
4. Railway auto-deploys on every push to `main`

### Frontend & Admin — Vercel
1. Connect GitHub repo to Vercel (two separate projects)
2. Set root directory to `frontend/` or `admin/`
3. No environment variables needed — API calls are proxied via `vercel.json`
4. Vercel auto-deploys on every push to `main`

The `vercel.json` in both frontend and admin proxies all `/api/*` requests to Railway:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://hotwheelsbikes-production.up.railway.app/api/:path*"
    }
  ]
}
```

---

## 🔑 Default Admin Credentials

After running `/api/seed-init`:

| Field | Value |
|---|---|
| Email | `admin@hotwheels.com` |
| Password | `admin123` |

> ⚠️ **Change the password immediately** after first login via Settings → Security.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Admin login |
| PUT | `/api/auth/change-password` | Admin JWT | Change password |
| POST | `/api/user/register` | Public | Customer register |
| POST | `/api/user/login` | Public | Customer login |
| GET | `/api/user/auth/google` | Public | Google OAuth start |

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products/public` | Public | All active products (storefront) |
| GET | `/api/products` | Admin JWT | All products with filters |
| POST | `/api/products` | Admin JWT | Create product |
| PUT | `/api/products/:id` | Admin JWT | Update product |
| DELETE | `/api/products/:id` | Super Admin | Soft delete |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | Public | Place online order |
| POST | `/api/orders/pos` | Admin JWT | Create POS sale |
| GET | `/api/orders` | Admin JWT | List all orders |
| PUT | `/api/orders/:id/status` | Admin JWT | Update order status |

### Other
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Server health check |
| GET | `/api/seed-init` | Public | One-time seed (run once) |
| GET | `/api/reports/dashboard` | Admin JWT | Dashboard stats |
| GET | `/api/reports/sales` | Admin JWT | Sales analytics |

---

## 🔒 Security Notes

- All `.env` files are in `.gitignore` — never tracked by git
- Admin routes protected by JWT middleware
- Role-based authorization (super_admin / inventory_manager / pos_operator)
- Passwords hashed with bcryptjs
- Products use soft-delete (never hard deleted)
- System logs track all admin actions with IP and timestamp

---

## 📄 License

Private project — All rights reserved © 2025 Hot Wheels Bikes.
