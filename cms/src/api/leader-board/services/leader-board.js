'use strict';

/**
 * leader-board service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::leader-board.leader-board');
