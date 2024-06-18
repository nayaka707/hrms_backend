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
  brand: db.Sequelize.DataTypes.STRING,
  category: db.Sequelize.DataTypes.STRING,
  cost: db.Sequelize.DataTypes.STRING,
  warranty: db.Sequelize.DataTypes.STRING,
  assetsImages: db.Sequelize.DataTypes.ARRAY(db.Sequelize.DataTypes.STRING),
  isActive: {
    type: db.Sequelize.DataTypes.STRING,
    allowNull: false,
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
