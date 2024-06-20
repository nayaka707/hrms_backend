const addProject = require('./addProject')
const deleteProject = require('./deleteProject')
const { getProjectById, getAllProjects } = require('./getProjects')
module.exports = {
    addProject,
    deleteProject,
    getProjectById,
    getAllProjects
}