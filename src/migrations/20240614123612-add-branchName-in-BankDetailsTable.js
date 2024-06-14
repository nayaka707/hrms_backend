'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("bankDetails", 'branchName', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false

    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface('bankDetails', 'branchName')
  }
};
