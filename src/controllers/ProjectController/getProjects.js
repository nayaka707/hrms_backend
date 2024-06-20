const { statusCode, constants, logger, errorResponseFunc, successResponseFunc, responseMessage, Projects } = require('./projectPackageCentral')



const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.projectId
        if (!projectId) {
            return res.status(400).send(
                errorResponseFunc(
                    "ProjectId is required",
                    responseMessage.notFound,
                    statusCode.notFound,
                    constants.NOTFOUND
                )
            )
        }

        const project = await Projects.findOne({id:projectId})
        if (!project) {
            return res.status(400).send(
                errorResponseFunc(
                    "Project Not Found",
                    responseMessage.notFound,
                    statusCode.notFound,
                    constants.NOTFOUND
                )
            )
        }
        return res.status(200).send(
            successResponseFunc(
                'Successfully get Project',
                statusCode.success,
                constants.SUCCESS,
                project

            )
        )
    } catch (err) {
        console.log(err)
    }
}

const getAllProjects = async (req, res) => {
    try {
        const projects = await Projects.findAll()
        if (!projects.length) {
            return res.status(400).send(
                errorResponseFunc(
                    "No Project Found",
                    responseMessage.notFound,
                    statusCode.notFound,
                    constants.NOTFOUND
                )
            )
        }

        return res.status(200).send(
            successResponseFunc(
                `Projects get successfully`,
                statusCode.success,
                constants.SUCCESS,
                projects
            )
        )

    } catch (err) {
        console.log(err)
    }
}

module.exports = { getProjectById, getAllProjects }