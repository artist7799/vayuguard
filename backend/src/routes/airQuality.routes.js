const express = require('express');
const airQualityController = require('../controllers/airQuality.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Public read routes
router.get('/current', (req, res) => airQualityController.getCurrent(req, res));
router.get('/history', (req, res) => airQualityController.getHistory(req, res));
router.get('/summary', (req, res) => airQualityController.getSummary(req, res));
router.get('/:id', (req, res) => airQualityController.getById(req, res));

// Protected write route
router.post('/', authMiddleware, (req, res) => airQualityController.create(req, res));

module.exports = router;
