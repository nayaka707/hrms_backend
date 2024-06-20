'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('employees', 'emergencyContact', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    }),
      await queryInterface.addColumn("employees", 'city', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      }),
      await queryInterface.addColumn("employees", 'state', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      }),
      await queryInterface.addColumn("employees", 'pincode', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      }),
      await queryInterface.addColumn("employees", 'passportNumber', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      }),
      await queryInterface.addColumn("employees", 'fatherName', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      }),
      await queryInterface.addColumn("employees", 'motherName', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      }),
      await queryInterface.addColumn("employees", 'nationality', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      }),
      await queryInterface.addColumn("employees", 'dateOfBirth', {
        type: Sequelize.DataTypes.DATE,
        allowNull: true
      }),
      await queryInterface.addColumn("employees", "experience", {
        type: Sequelize.DataTypes.FLOAT
      }),
      await queryInterface.addColumn("employees", "qualification", {
        type: Sequelize.DataTypes.STRING
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('employees', 'emergencyContact')
    await queryInterface.removeColumn('employees', 'city')
    await queryInterface.removeColumn('employees', 'state')
    await queryInterface.removeColumn('employees', 'pincode')
    await queryInterface.removeColumn('employees', 'passportNumber')
    await queryInterface.removeColumn('employees', 'fatherName')
    await queryInterface.removeColumn('employees', 'motherName')
    await queryInterface.removeColumn('employees', 'nationality')
    await queryInterface.removeColumn('employees', 'dateOfBirth')
    await queryInterface.removeColumn('employees', 'experience')
    await queryInterface.removeColumn('employees', 'qualification')
  }
};
