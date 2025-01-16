// app/controllers/standardsController.js
const strapiService = require('../../services/strapiService.js');
const logger = require('../../utils/logger');


/**
 * Handler to get and render standards titles
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.g_standards = async (req, res, next) => {
    try {
        const standards = await strapiService.getStandardsForList();
        const categories = await strapiService.getCategoryTitles();

        console.log(categories)

        if (!standards || standards.length === 0) {
            logger.info('No standards found');
            return res.render('standards/index', {
                standards: [],
                title: 'Standards',
                message: 'No standards available at this time.',
                categories
            });
        }

        res.render('standards/index', { standards, categories });
    } catch (error) {
        logger.error('Error fetching standards:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load standards. Please try again later.'
        });
    }
};

/**
 * Handler to get and render a given standard
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.g_standard = async (req, res, next) => {
    try {
        const {slug} = req.params;

        console.log(slug);

        const standard = await strapiService.getStandard(slug);

        console.log(standard);

        if (!standard || standard.length === 0) {
            logger.info('No standard found');
            return res.render('standards/standard/index', {
                standard: []
            });
        }

        res.render('standards/standard/index', { standard: standard[0] });
    } catch (error) {
        logger.error('Error fetching standard:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load standard. Please try again later.'
        });
    }
};
