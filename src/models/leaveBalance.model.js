const db = require("../config/database");

const LeaveBalance = db.sequelize.define("leaveBalance", {
  id: {
    type: db.Sequelize.DataTypes.UUID,
    defaultValue: db.Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  balance: {
    type: db.Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
  employeeId: db.Sequelize.DataTypes.UUID,
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

LeaveBalance.associate = (models) => {
    LeaveBalance.belongsTo(models.Employees, {
    foreignKey: "employeeId",
    onDelete: "CASCADE",
  });
};

module.exports = LeaveBalance;
