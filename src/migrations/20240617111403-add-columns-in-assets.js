"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("assets", "brand", {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
      await queryInterface.addColumn("assets", "category", {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
      await queryInterface.addColumn("assets", "cost", {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
      await queryInterface.addColumn("assets", "warranty", {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      });
    await queryInterface.addColumn("assets", "assetsImages", {
      type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("assets", "brand");
    await queryInterface.removeColumn("assets", "category");
    await queryInterface.removeColumn("assets", "cost");
    await queryInterface.removeColumn("assets", "warranty");
    await queryInterface.removeColumn("assets", "assetsImages");
  },
};
