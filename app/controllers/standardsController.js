// app/controllers/standardsController.js
const strapiService = require('../../services/strapiService.js');
const logger = require('../../utils/logger');
const ExcelJS = require('exceljs');

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

// Export
exports.g_standards_export = async (req, res, next) => {
    try {
        const standards = await strapiService.getStandardsForList();

        if (!standards || standards.length === 0) {
            return res.status(404).json({ message: 'No standards found' });
        }

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Standards');

        // Define columns for the Excel sheet
        worksheet.columns = [
            { header: 'Standard ID', key: 'standardId', width: 15 },
            { header: 'Title', key: 'title', width: 40 },
            { header: 'Link', key: 'slug', width: 50 },
            { header: 'Summary', key: 'summary', width: 50 },
            { header: 'Categories', key: 'categories', width: 50 },
            { header: 'Sub-categories', key: 'subcategories', width: 50 },
            { header: 'Owner', key: 'owner', width: 25 },
            { header: 'Owner Email', key: 'ownerEmail', width: 30 },
            { header: 'Contact', key: 'contact', width: 25 },
            { header: 'Contact Email', key: 'contactEmail', width: 30 }
        ];

        // Process and flatten data for the Excel sheet
        standards.forEach(standard => {
            const categories = standard.categories?.map(cat => cat.title).join(', ') || 'N/A';
            const subCategories = standard.sub_categories?.map(cat => cat.title).join(', ') || 'N/A';

            const owner = standard.owners?.map(o => `${o.firstName} ${o.lastName}`).join(', ') || 'N/A';
            const ownerEmail = standard.owners?.map(o => o.email).join(', ') || 'N/A';
            const contact = standard.contacts?.map(c => `${c.firstName} ${c.lastName}`).join(', ') || 'N/A';
            const contactEmail = standard.contacts?.map(c => c.email).join(', ') || 'N/A';

            const slugLink = `https://standards.education.gov.uk/standard/${standard.slug}`;

            worksheet.addRow({
                standardId: standard.standardId,
                title: standard.title,
                slug: slugLink, // Add slug as link
                summary: standard.summary,
                categories: categories,
                subcategories: subCategories,
                owner: owner,
                ownerEmail: ownerEmail,
                contact: contact,
                contactEmail: contactEmail
            });
        });

        // Set header styles for better readability
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
        });

        // Add hyperlinks to the slug column
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const cell = row.getCell('slug');
                const url = cell.value;
                cell.value = { text: 'View Standard', hyperlink: url };
                cell.font = { color: { argb: '0563C1' }, underline: true };
            }
        });

        // Add summary row at the end
        const totalStandards = standards.length;
        const currentDate = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

        worksheet.addRow({});
        worksheet.addRow({
            title: `Total number of standards: ${totalStandards}`,
            summary: `Date produced: ${currentDate}`
        });

        worksheet.getRow(worksheet.rowCount).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
        });

        // Write the workbook to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Set response headers for file download
        res.setHeader('Content-Disposition', 'attachment; filename="standards_export.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        res.send(buffer);
    } catch (error) {
        logger.error('Error fetching or exporting standards:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to export standards. Please try again later.'
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
            return res.render('standards/standard/notfound', {
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


/**
 * Handler to get and render proposed standards
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.g_proposedstandards = async (req, res, next) => {
    try {
        const proposedStandards = await strapiService.getProposedStandards(true);

    

        res.render('proposed/index', { proposedStandards });
    } catch (error) {
        logger.error('Error fetching proposed standards:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load proposed standards. Please try again later.'
        });
    }
}


/**
 * Handler to get and render a given proposed standard
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.g_proposedstandard = async (req, res, next) => {
    try {
        const {documentId} = req.params;

        const proposedStandard = await strapiService.getStandardByDocumentId(req.params.documentId);

        if (!proposedStandard || proposedStandard.length === 0) {
            logger.info('No proposed standard found');
            return res.render('proposed/notfound', {
                proposedStandard: []
            });
        }

        console.log(proposedStandard);

        res.render('proposed/standard/index', { standard: proposedStandard });
    } catch (error) {
        logger.error('Error fetching proposed standard:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load proposed standard. Please try again later.'
        });
    }
}