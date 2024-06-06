const db = require("../config/database");
const department = db.sequelize.define("department", {
  id: {
    type: db.Sequelize.DataTypes.UUID,
    defaultValue: db.Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: db.Sequelize.DataTypes.STRING,
  },
  isActive: {
    type: db.Sequelize.DataTypes.STRING,
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
  },
  updatedAt: {
    allowNull: false,
    type: db.Sequelize.DataTypes.DATE,
  },
});

module.exports = department;
