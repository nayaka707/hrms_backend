const db = require("../config/database")
const Role = db.sequelize.define("role", {
  id: {
    type: db.Sequelize.UUID,
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
});


Role.associate = (models) => {
  Role.hasMany(models.employee);
};

module.exports = Role;
