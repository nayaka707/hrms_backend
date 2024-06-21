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
    allowNull: true,
  },
  numberOfDays: {
    type: db.Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
  balance: {
    type: db.Sequelize.DataTypes.INTEGER,
    defaultValue:0,
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
    type: db.Sequelize.DataTypes.ENUM("pending","Approved","rejected","cancelled"),
    defaultValue:"pending",
    allowNull: false,
  },
  remark: {
    type: db.Sequelize.DataTypes.TEXT,
    allowNull: true,
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
  deletedAt: {
    allowNull: true,
    type: db.Sequelize.DataTypes.DATE,
  },
},{
  paranoid: true,
  timestamps: true
});

LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.Employees, {
    foreignKey: "employeeId",
    onDelete: "CASCADE",
  });
};

module.exports = LeaveRequest;
