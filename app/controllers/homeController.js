
require('dotenv').config(); 
// GET Routes

exports.g_homepage = async (req, res, next) => {
    
    const cmsEnabled = process.env.cmsEnabled;
    
    try {
        if (cmsEnabled === 'true') {
            // Render the CMS homepage
            return res.render('index');
        }
        else {
            // Render the default homepage
            return res.render('old-index');
        }

    } catch (error) {
        next(error);
    }
};