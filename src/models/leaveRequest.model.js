const db = require("../config/database");

const LeaveRequest = db.sequelize.define("leaveRequests", {
  id: {
    type: db.Sequelize.DataTypes.UUID,
    defaultValue: db.Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  startDate: {
    type: db.Sequelize.DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: db.Sequelize.DataTypes.DATEONLY,
    allowNull: false,
  },
  halfLeaveDate: {
    type: db.Sequelize.DataTypes.DATEONLY,
    allowNull: false,
  },
  numberOfDays: {
    type: db.Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
  reason: {
    type: db.Sequelize.DataTypes.TEXT,
    allowNull: false,
  },
  approvedBy: {
    type: db.Sequelize.DataTypes.UUID,
    allowNull: true,
  },
  status: {
    type: db.Sequelize.DataTypes.ENUM("Pending","Approved","Rejected","cancelled"),
    allowNull: false,
  },
  remark: {
    type: db.Sequelize.DataTypes.TEXT,
    allowNull: false,
  },
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

LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.Employees, {
    foreignKey: "employeeId",
    onDelete: "CASCADE",
  });
};

module.exports = LeaveRequest;
