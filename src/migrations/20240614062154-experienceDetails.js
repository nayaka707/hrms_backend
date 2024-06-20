"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("experienceDetails", {
      id: {
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      companyName: { type: Sequelize.DataTypes.STRING, allowNull: false },
      designation: { type: Sequelize.DataTypes.STRING, allowNull: false },
      location: { type: Sequelize.DataTypes.STRING, allowNull: false },
      periodFrom: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      periodTo: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
      experienceId: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
      employeeId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("experienceDetails");
  },
};
