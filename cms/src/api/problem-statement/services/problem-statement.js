'use strict';

/**
 * problem-statement service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::problem-statement.problem-statement');
