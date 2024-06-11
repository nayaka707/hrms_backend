"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryInterface.createTable("experienceDetails", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
      },
      tenMarksheet: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      twelveMarksheet: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      degreeMarksheet: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      adharCard: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      panCard: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      salarySlip1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      salarySlip2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      salarySlip3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      probationComplitionLetter: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      appointmentLetter: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Employees",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      isActive: {
        type: Sequelize.DataTypes.STRING,
        validate: {
          customValidator: (value) => {
            const enums = ["1", "0"];
            if (!enums.includes(value)) {
              throw new Error("not a valid option");
            }
          },
        },
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("experienceDetails");
  },
};
