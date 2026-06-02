# 🚲 Hot Wheels Bikes — Full Stack E-Commerce Platform

> Pakistan's #1 Bike Store — Established 1990. A complete full-stack e-commerce platform with a customer-facing storefront, admin panel, and Point of Sale (POS) system.

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
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router 7 | Client-side routing |
| Tailwind CSS 4 | Utility styling |
| Axios | HTTP client |
| Lucide React | Icons |

### Admin Panel
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework & build tool |
| Recharts | Analytics charts |
| Lucide React | Icons |

### Backend (API Server)
| Technology | Purpose |
|---|---|
| Node.js + Express 4 | Web framework |
| MongoDB Atlas + Mongoose 8 | Database & ODM |
| JWT | Authentication |
| Passport.js | Google OAuth |
| Multer | File uploads |
| Nodemailer | Email notifications |
| Stripe | Card payments |
| bcryptjs | Password hashing |

---

## 📁 Project Structure

```
hotwheels-bikes/
├── frontend/               # Customer-facing React storefront
│   ├── src/
│   │   ├── components/     # Navbar, Footer, CartDrawer, ProductCard
│   │   ├── context/        # CartContext, UserContext
│   │   ├── hooks/          # useWindowWidth
│   │   └── pages/          # Home, Shop, ProductDetail, Checkout, etc.
│   └── vercel.json         # Vercel rewrite config
│
├── admin/                  # Admin panel React app
│   ├── src/
│   │   ├── components/     # Layout, Sidebar
│   │   └── pages/          # Dashboard, Inventory, Orders, POS, etc.
│   └── vercel.json         # Vercel rewrite config
│
└── backend/                # Node.js + Express API server
    ├── middleware/          # auth.js (JWT), passport.js (Google OAuth)
    ├── models/              # Mongoose schemas
    ├── routes/              # Express route handlers
    ├── .env.example         # Environment variable template
    └── server.js            # App entry point
```

---

## 🚀 Features

### 🛍️ Customer Store
- Product catalog with category filtering, search, and sorting
- Product detail pages
- Shopping cart with persistent storage
- Multi-step checkout with multiple payment methods
- Payment screenshot upload for bank/wallet payments
- Order confirmation and tracking
- Customer accounts with Google OAuth login
- Fully responsive (mobile + desktop)

### 🔧 Admin Panel
- **Dashboard** — Live revenue stats, charts, recent orders, low stock alerts
- **Inventory** — Add/edit/delete products, bulk CSV import/export, stock logs
- **Orders** — Manage online + POS orders, update status, verify payments
- **POS** — In-store sales terminal with barcode scanning, discount/tax, receipt print
- **Customers** — View profiles, order history, block/unblock
- **Reports** — Sales analytics (online vs POS), inventory reports, date filtering
- **Settings** — Store config, payment method setup, admin user management
- **Logs** — Full audit trail of admin actions and stock changes
- Role-based access (super_admin, inventory_manager, pos_operator)

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

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
# Fill in your own values in .env
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

---

## ⚙️ Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure with your own credentials.

> ⚠️ **Never commit `.env` files.** They are already in `.gitignore`.

---

## 🌐 Deployment

The project is deployed using:

- **Frontend** → Vercel
- **Admin Panel** → Vercel
- **Backend API** → Railway
- **Database** → MongoDB Atlas

Both Vercel apps use `vercel.json` to proxy `/api/*` requests to the Railway backend — no environment variables needed on Vercel.

---

## 🔒 Security

- All environment secrets are stored server-side only, never in source code
- Admin routes protected by JWT middleware
- Role-based authorization (super_admin / inventory_manager / pos_operator)
- Passwords hashed with bcryptjs
- Products use soft-delete (never permanently removed)
- System logs track all admin actions with IP and timestamp

---

## 📄 License

Private project — All rights reserved © 2025 Hot Wheels Bikes.
