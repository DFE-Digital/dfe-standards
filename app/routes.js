
const express = require('express');
const router = express.Router();

const homeController = require('./controllers/homeController.js');
const standardsController = require('./controllers/standardsController.js');
const categoriesController = require('./controllers/categoriesController.js');

// Home routes
router.get('/', homeController.g_homepage);

// Standards routes
router.get('/standards', standardsController.g_standards);
router.get('/standards/export', standardsController.g_standards_export);
router.get('/standard/:slug', standardsController.g_standard);

// Proposed Standards routes
router.get('/proposed', standardsController.g_proposedstandards);
router.get('/proposed/standard/:documentId', standardsController.g_proposedstandard);

// Standards routes
router.get('/categories', categoriesController.g_categories);

module.exports = router; 