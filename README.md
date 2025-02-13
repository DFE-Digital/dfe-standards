# Find and Use a Standard

## Overview

**Find and Use a Standard** is a Node.js and Express-based web application that allows users to browse and utilise standards efficiently. The application relies on a PostgreSQL database for session management and connects to a Strapi instance as the CMS backend.

## Features

- Node.js and Express framework.
- PostgreSQL database for session management.
- Integration with [DFE-Digital/dfe-standards-cms](https://github.com/DFE-Digital/dfe-standards-cms) for content management.
- Configurable environment variables for different deployment stages.
- Session caching with configurable timeouts.
- User-friendly interface with the service name **'Find and Use a Standard'**.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [PostgreSQL](https://www.postgresql.org/) (for session management)
- [Strapi CMS](https://strapi.io/) instance

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/DFE-Digital/dfe-standards.git
cd dfe-standards
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and configure the necessary environment variables as shown below:

```env
# Application Port
PORT=3084

# Strapi CMS Configuration
STRAPI_API_URL=http://localhost:1338
STRAPI_API_KEY=your_strapi_api_key
staging=true

# Cache Settings
CacheTimeout=30

# Service Name
serviceName='Find and use a standard'

# CMS Feature Toggle
cmsEnabled=true

# Manage Service URL
CREATE_MANAGE_URL=http://localhost:3085
```

> **Note:** The `STRAPI_API_URL` and `STRAPI_API_KEY` should be set appropriately for staging and production environments.


### 4. Run the Application

```sh
npm run dev
```

The application will be available at `http://localhost:3084`.

## Deployment

### Staging Configuration

```env
STRAPI_API_URL=path/to/cms
STRAPI_API_KEY=your_staging_api_key
staging=true
```

### Production Configuration

```env
STRAPI_API_URL=/path/to/cms
STRAPI_API_KEY=your_production_api_key
staging=false
```

## Removing Airtable Feedback Functionality

Airtable is currently used to capture service feedback. If you wish to remove this feature, locate and remove related functionality from `app.js`:

```js
// Remove the following lines from app.js
const airtableFeedbackKey = process.env.airtableFeedbackKey;
const airtableFeedbackBase = process.env.airtableFeedbackBase;
// Any associated functions using Airtable should be deleted
```

## Project Structure

```
.
├── app/               # Views and controllers
├── public/            # Static files
├── services/          # Middleware for API integrations
├── utils/             # Helpers for routing and sessions
├── .env               # Environment variables
├── app.js             # Main application logic
├── package.json       # Node dependencies
└── LICENSE.txt        # MIT license
└── README.md          # Project documentation
```

## Contributing

We welcome contributions! Please submit a pull request with your proposed changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or issues, please contact the DfE DesignOps team at https://design.education.gov.uk
