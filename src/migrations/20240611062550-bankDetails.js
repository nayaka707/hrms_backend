'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bankDetails', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      employeeId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: "employees",
          key: "id",
        }
      },
      bankName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      accountNo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      IFSC: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
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
    })

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bankDetails");
  }
};
