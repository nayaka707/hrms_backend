const db = require("../config/database");
const { Sequelize } = db

const Projects = db.sequelize.define('projects', {
    id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
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


Projects.associate = (models) => {
    Projects.hasMany(models.WorkLogs, {
        foreignKey: 'projectId'
    })
}
module.exports = Projects