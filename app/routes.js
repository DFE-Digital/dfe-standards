
const express = require('express');
const router = express.Router();

const homeController = require('./controllers/homeController.js');
const standardsController = require('./controllers/standardsController.js');
const categoriesController = require('./controllers/categoriesController.js');

// Home routes
router.get('/', homeController.g_homepage);

// Standards routes
router.get('/standards', standardsController.g_standards);
router.get('/standard/:slug', standardsController.g_standard);

// Standards routes
router.get('/categories', categoriesController.g_categories);

module.exports = router; 