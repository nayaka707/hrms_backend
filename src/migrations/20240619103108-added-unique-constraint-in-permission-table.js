'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('permissions', {
      fields: ['roleId', 'routeId'],
      type: 'unique',
      name: 'unique_role_route'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('permissions', 'unique_role_route');
  }
};
