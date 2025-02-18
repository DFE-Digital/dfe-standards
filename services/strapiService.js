
require('dotenv').config();

const axios = require('axios');
const NodeCache = require('node-cache');
const logger = require('../utils/logger');

const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1338';
const STRAPI_API_KEY = process.env.STRAPI_API_KEY;
const cacheTimeout = process.env.CacheTimeout;

// Initialize Axios instance with default headers
const strapiClient = axios.create({
    baseURL: STRAPI_API_URL,
    headers: {
        Authorization: `Bearer ${STRAPI_API_KEY}`,
    },
});

// Initialize cache (cache for 1 hour)
const cache = new NodeCache({ stdTTL: cacheTimeout });

/**
 * Fetch standards titles from Strapi
 * @returns {Promise<Array<string>>} Array of standard titles
 */
const getStandardsTitles = async () => {
    const cacheKey = 'standards_titles';

    // Check if data is in cache
    if (cache.has(cacheKey)) {
        logger.info('Fetching standards titles from cache');
        return cache.get(cacheKey);
    }

    try {
        logger.info('Fetching standards titles from Strapi');
        const response = await strapiClient.get('/api/standards', {
            params: {
                sort: 'title',
                fields: 'title', // Adjust if field name differs
            },
        });

        // Log the entire response data for debugging
        logger.debug(`Strapi response data: ${JSON.stringify(response.data)}`);

        // Validate response structure
        if (!response.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure from Strapi');
        }

        // Extract titles
        const standards = response.data.data.map(standard => {
            if (!standard || !standard.title) {
                logger.warn('Standard entry is missing');
                return 'Untitled Standard';
            }
            return standard.title;
        });

        // Store in cache
        cache.set(cacheKey, standards);

        return standards;
    } catch (error) {
        logger.error(`Error fetching standards from Strapi: ${error.message}`);
        throw error; // Propagate the error to the controller
    }
};

/**
 * Fetches the titles, slugs, and categories of standards from Strapi.
 * @returns {Promise<Array<{ title: string, slug: string, category: any }>>} 
 *          A promise that resolves to an array of standards with title, slug, and category.
 */
const getStandardsForList = async () => {
    try {
        logger.info('Fetching standards titles from Strapi');

        const response = await strapiClient.get('/api/standards', {
            params: {
                sort: 'title',
                fields: 'id,title,slug,standardId,summary',
                populate: '*',
            },
        });

        // Log the entire response data for debugging
        logger.debug(`Strapi response data: ${JSON.stringify(response.data)}`);

        // Validate response structure
        if (!response.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure from Strapi');
        }

        const standards = response.data.data;

        return standards;
    } catch (error) {
        // Enhanced error logging
        if (error.response) {
            // The request was made and the server responded with a status code outside 2xx
            logger.error('Error fetching standards from Strapi:', {
                message: error.message,
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            });
        } else if (error.request) {
            // The request was made but no response was received
            logger.error('No response received when fetching standards from Strapi:', {
                message: error.message,
                request: error.request,
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            logger.error('Error setting up the request to Strapi:', {
                message: error.message,
            });
        }
        throw error; // Propagate the error to the controller
    }
};


/** Fetch categories titles from Strapi
* @returns { Promise < Array < string >>} Array of categories
*/
const getCategories = async () => {
    const cacheKey = 'categories_titles';

    // Check if data is in cache
    if (cache.has(cacheKey)) {
        logger.info('Fetching categories titles from cache');
        return cache.get(cacheKey);
    }


    // when calling strapi also need to include linked entries

    try {
        logger.info('Fetching categories titles from Strapi');
        const response = await strapiClient.get('/api/categories', {
            params: {
                sort: 'title',
                populate: '*' 
            },
        });

        // Log the entire response data for debugging
        logger.debug(`Strapi response data: ${JSON.stringify(response.data)}`);

        // Validate response structure
        if (!response.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure from Strapi');
        }

        console.log(response.data.data)


        // Store in cache
        cache.set(cacheKey, response.data.data);

        return cache.get(cacheKey);
    } catch (error) {
        logger.error(`Error fetching category from Strapi: ${error.message}`);
        throw error; // Propagate the error to the controller
    }
};

/** Fetch standards from Strapi
 * 
 * @returns {Promise<Array<string>>} Array of standards
 */
const getStandards = async () => {
    const cacheKey = 'standards';

    // Check if data is in cache
    if (cache.has(cacheKey)) {
        logger.info('Fetching standards from cache');
        return cache.get(cacheKey);
    }

    try {
        logger.info('Fetching standards from Strapi');
        const response = await strapiClient.get('/api/standards', {
            params: {
                sort: 'title',
            },
        });

        // Log the entire response data for debugging
        logger.debug(`Strapi response data: ${JSON.stringify(response.data)}`);

        // Validate response structure
        if (!response.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure from Strapi');
        }

        const standards = response.data.data;

        // Store in cache
        cache.set(cacheKey, standards);

        return standards;
    } catch (error) {
        logger.error(`Error fetching standards from Strapi: ${error.message}`);
        throw error; // Propagate the error to the controller
    }

}

/**
 * Fetches the titles and slugs of active categories directly from Strapi.
 * @returns {Promise<Array<{ title: string, slug: string }>>} 
 *          A promise that resolves to an array of objects containing the title and slug of each active category.
 */
const getCategoryTitles = async () => {
    const cacheKey = 'active_categories_titles_slugs';


    try {
        logger.info('Fetching active categories titles and slugs from Strapi');

        const response = await strapiClient.get('/api/categories', {
            params: {
                sort: 'title',
                filters: {
                    active: true
                },
                fields: ['title', 'slug'] // Request only the necessary fields
            },
        });

        // Log the entire response data for debugging
        logger.debug(`Strapi response data: ${JSON.stringify(response.data)}`);

        // Validate response structure
        if (!response.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure from Strapi');
        }

        const categories = response.data.data;

        // Extract title and slug from each active category
        const categoryTitlesSlugs = categories.map(category => {
            const { title, slug } = category;

            if (!title || !slug) {
                logger.warn(`Category with ID ${category.id} is missing title or slug`);
            }

            return { title, slug };
        });

        // Optionally, remove entries with missing title or slug
        const validCategoryTitlesSlugs = categoryTitlesSlugs.filter(item => item.title && item.slug);

        // Store the processed data in cache
        cache.set(cacheKey, validCategoryTitlesSlugs);

        logger.info('Active categories titles and slugs fetched and cached successfully');

        return validCategoryTitlesSlugs;
    } catch (error) {
        logger.error(`Error fetching active categories titles and slugs from Strapi: ${error.message}`);
        throw error; // Propagate the error to the controller or higher-level handler
    }
};


/**
 * Fetches a single standard from Strapi.
 * @param {string} slug The slug of the standard to fetch.
 * @returns {Promise<Object>} A promise that resolves to the standard object.
 */
const getStandard = async (slug) => {
    try {
        logger.info(`Fetching standard with slug "${slug}" from Strapi`);

        //?filters[Slug][\$eq]=${req.params.id}&populate=%2A

        const response = await strapiClient.get(`/api/standards`, {
            params: {
                'filters[slug][$eq]': slug,
                'populate': {
                    categories: {
                        fields: ['id', 'documentId', 'title', 'description', 'slug'], // Specify only needed fields
                        populate: {
                            sub_categories: {
                                fields: ['id', 'title', 'slug']  // Only include required sub_category fields
                            }
                        }
                    },
                    sub_categories: {
                        fields: ['id', 'title', 'slug'], // Include only necessary fields
                        populate: {
                            category: {
                                fields: ['id', 'title', 'slug']  // Only include required sub_category fields
                            }
                        }
                    },
                    owners: {
                        fields: ['firstName', 'lastName', 'email', 'JobRole'] // Only include needed fields
                    },
                    contacts: {
                        fields: ['firstName', 'lastName', 'email','JobRole'] // Only include needed fields
                    },
                    phases: {
                        fields: ['id', 'Title', 'Enabled'], // Include necessary phase fields
                        sort: ['id:asc']
                    },
                    approvedProducts: {
                        fields: ['id', 'title', 'vendor', 'version', 'useCase']  // Specify only required fields
                    },
                    toleratedProducts: {
                        fields: ['id', 'title', 'vendor', 'version', 'useCase']  // Specify only required fields
                    },
                    exceptions: {
                        fields: ['id', 'title', 'details']  // Specify only required fields
                    },
                }
            }
        });




        // Log the entire response data for debugging
        logger.debug(`Strapi response data: ${JSON.stringify(response.data)}`);

        // Validate response structure
        if (!response.data || !response.data.data) {
            throw new Error('Invalid response structure from Strapi');
        }

        const standard = response.data.data;

        return standard;
    } catch (error) {
        console.log(error.response.data)
        logger.error(`Error fetching standard with slug "${slug}" from Strapi: ${error.message}`);
        throw error; // Propagate the error to the controller or higher-level handler
    }
}

/**
 * Fetches proposed standards from Strapi.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of proposed standards.
 */
const getProposedStandards = async (includeDraft = false) => {

    try {

        let response = []
        if (includeDraft) {

            // get ones in Draft 

            response = await strapiClient.get(`/api/standards?status=draft`, {
                params: {
                    populate: '*',
                    'filters[stage][title][$in]': ['Draft', 'Approval'],
                    sort: 'title',
                },
            });

        } else {
            response = await strapiClient.get(`/api/standards`, {
                params: {
                    populate: '*',
                    'filters[stage][title][$eq]': 'Published',
                    sort: 'title',
                },
            });
        }

        // Validate response structure
        if (!response || !response.data) {
            throw new Error("Unexpected response format from Strapi API.");
        }

        // Ensure data is an array or handle empty results
        return response.data.data;
    }
    catch (error) {
        // Log the error with additional context
        console.error(`Failed to fetch standards`, error.message);

        // Rethrow the error with a meaningful message
        throw new Error(`Error fetching standards: ${error.message}`);
    }
}

const getStandardByDocumentId = async (documentId) => {

    try {
        const response = await strapiClient.get(`/api/standards?status=draft`, {
            params: {
                'filters[documentId][$eq]': documentId,
                populate: {
                    categories: true,
                    owners: true,
                    contacts: true,
                    approvedProducts: true,
                    toleratedProducts: true,
                    exceptions: true,
                    standard_comments: true,
                    creator: true,
                    stage: true,
                    sub_categories: {
                        populate: {
                            category: true, // Deep population for sub_categories -> category
                        },
                    },
                },
            },
        });

        // Return the standard data
        return response.data.data[0]; // Assuming slug is unique and returning the first match
    } catch (error) {
        // Log the error with additional context
        console.error(`Failed to fetch standard with id: ${documentId}`, error.message);

        // Rethrow the error with a meaningful message
        throw new Error(`Error fetching standard: ${error.message}`);
    }
};


module.exports = {
    getStandardsTitles, getCategories, getStandards, getCategoryTitles, getStandardsForList, getStandard, getProposedStandards, getStandardByDocumentId
};
