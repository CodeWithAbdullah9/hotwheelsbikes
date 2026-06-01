require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const session  = require('express-session');
const passport = require('./middleware/passport');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5190'],
  credentials: true
}));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'hw_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/user',      require('./routes/userAuth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/reports',   require('./routes/reports'));
app.use('/api/settings',  require('./routes/settings'));
app.use('/api/logs',      require('./routes/logs'));
app.use('/api/payment',   require('./routes/payment'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
