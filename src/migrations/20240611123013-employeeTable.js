"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable("employees", {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      middleName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      pancardNo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      aadharNo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      uanNo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      workLocation: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      pfNo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.DataTypes.ENUM("male", "female"),
        allowNull: false,
      },
      departmentId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: "departments", // Ensure table name is plural here
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      designationId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: "designations", // Ensure table name is plural here
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reportTo: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: "employees", // Ensure table name is plural here
          key: "id",
        },
        onDelete: "CASCADE",
      },
      profilePicture: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      currentAddress: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      permanentAddress: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      dateOfJoining: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      permanentPasswordSet: {
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
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        set(value) {
          const salt = bcrypt.genSaltSync(12);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue("password", hash);
        },
      },
      roleId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: "roles", // Ensure table name is plural here
          key: "id",
        },
        onUpdate: "CASCADE",
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
    await queryInterface.dropTable("employees");
  },
};
