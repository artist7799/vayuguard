const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const airQualityRoutes = require('./routes/airQuality.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/air-quality', airQualityRoutes);

// Root route placeholder
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to VayuGuard Backend REST API',
    healthCheck: '/api/health',
    authEndpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me'
    },
    airQualityEndpoints: {
      current: 'GET /api/air-quality/current',
      history: 'GET /api/air-quality/history',
      summary: 'GET /api/air-quality/summary',
      getById: 'GET /api/air-quality/:id',
      create: 'POST /api/air-quality (Auth Required)'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
