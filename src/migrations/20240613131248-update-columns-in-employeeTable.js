'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = ['middleName', 'uanNo', 'pfNo', 'currentAddress', 'permanentAddress'];
    const changes = columns.map(column => queryInterface.changeColumn('employees', column, {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    }));
    await Promise.all(changes);
  },

  async down(queryInterface, Sequelize) {
    const columns = ['middleName', 'uanNo', 'pfNo', 'currentAddress', 'permanentAddress'];
    const changes = columns.map(column => queryInterface.changeColumn('employees', column, {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    }));
    await Promise.all(changes);
  }
};