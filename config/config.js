'use strict';

module.exports = {
    nodeEnv: process.env.NODE_ENV,
    apiKey: process.env.API_KEY,
    appDonmin: process.env.APPLICATION_DOMAIN,
    elasticHost: process.env.ELASTICSEARCH_HOST,
    elasticPort: process.env.ELASTICSEARCH_PORT,
    elasticIndex: process.env.ELASTICSEARCH_INDEX,
    indexType: process.env.ELASTICSEARCH_INDEX_TYPE
}