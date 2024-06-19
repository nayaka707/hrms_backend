"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("leaveMasters", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      month:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      leaves:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("leaveMaster");
  },
};
