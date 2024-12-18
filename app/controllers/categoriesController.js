// app/controllers/standardsController.js
const strapiService = require('../../services/strapiService.js');
const logger = require('../../utils/logger');


exports.g_categories = async (req, res, next) => {
    try {
        const categories = await strapiService.getCategories();

        // Add in standards and show the number of standards in each category

        if (!categories || categories.length === 0) {
            logger.info('No categories found');
            return res.render('categories/index', {
                categories: []
            });
        }

        res.render('categories/index', { categories });
    } catch (error) {
        logger.error('Error fetching categories:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load categories. Please try again later.'
        });
    }
};

