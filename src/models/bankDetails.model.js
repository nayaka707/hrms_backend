const db = require("../config/database");
const { Sequelize } = db
const BankDetails = db.sequelize.define("bankDetails", {
    id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    employeeId: {
        type: Sequelize.DataTypes.UUID,
        references: {
            model: "employees",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    bankName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    accountNo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    IFSC: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            customValidator: (value) => {
                const enums = ["1", "0"]
                if (!enums.includes(value))
                    throw new Error("not a valid option")
            }
        }
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
})


module.exports = BankDetails