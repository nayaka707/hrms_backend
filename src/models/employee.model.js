const db = require("../config/database");
const bcrypt = require("bcrypt");
const employee = db.sequelize.define("employee", {
   id: {
        type: db.Sequelize.DataTypes.UUID,
        defaultValue: db.Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      middleName: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      pancardNo: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      aadharNo: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      uanNo: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      workLocation: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      pfNo: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: db.Sequelize.DataTypes.ENUM("male", "female"),
        allowNull: false,
      },
      departmentId: {
        type: db.Sequelize.DataTypes.UUID,
        references: {
          model: "department",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      designationId: {
        type: db.Sequelize.DataTypes.UUID,
        references: {
          model: "designation",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reportTo: {
        type: db.Sequelize.DataTypes.INTEGER,
        references: {
          model: "employee",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      profilePicture: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      currentAddress: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      permanentAddress: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      dateOfJoining: {
        type: db.Sequelize.DataTypes.DATEONLY,
        allowNull: false,
      },
      phoneNumber: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      permanentPasswordSet: {
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
      password: {
        type: db.Sequelize.DataTypes.STRING,
        allowNull: true,
        set(value) {
          const salt = bcrypt.genSaltSync(12);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue("password", hash);
        },
      },
      roleId: {
        type: db.Sequelize.DataTypes.UUID,
        references: {
          model: "role",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

employee.associate = (models) => {
  employee.belongsTo(models.Role);
};

module.exports = employee;