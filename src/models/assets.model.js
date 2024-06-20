const db = require("../config/database");

const Assets = db.sequelize.define("assets", {
  id: {
    type: db.Sequelize.DataTypes.UUID,
    defaultValue: db.Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  assetsName: db.Sequelize.DataTypes.STRING,
  assetsId: db.Sequelize.DataTypes.STRING,
  assignedDate: db.Sequelize.DataTypes.DATEONLY,
  employeeId: db.Sequelize.DataTypes.UUID,
  isActive: {
    type: db.Sequelize.DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    allowNull: false,
    type: db.Sequelize.DataTypes.DATE,
    defaultValue: db.Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: db.Sequelize.DataTypes.DATE,
    defaultValue: db.Sequelize.NOW,
  },
});

Assets.associate = (models) => {
  Assets.belongsTo(models.Employees, {
    foreignKey: "employeeId",
    onDelete: "CASCADE",
  });
};

module.exports = Assets;
