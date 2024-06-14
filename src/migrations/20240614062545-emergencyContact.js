"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("emergencyContacts", {
      id: {
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      primaryName: Sequelize.DataTypes.STRING,
      primaryRelationship: Sequelize.DataTypes.STRING,
      primaryPhoneNo: Sequelize.DataTypes.STRING,
      primaryAddress : Sequelize.DataTypes.TEXT,
      secondaryName: Sequelize.DataTypes.STRING,
      secondRelationship: Sequelize.DataTypes.STRING,
      secondaryPhoneNo: Sequelize.DataTypes.STRING,
      secondaryAddress : Sequelize.DataTypes.TEXT,
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
    await queryInterface.dropTable("emergencyContacts");
  },
};
