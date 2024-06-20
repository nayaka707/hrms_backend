const { statusCode, constants, logger, errorResponseFunc, successResponseFunc, Projects } = require('./projectPackageCentral')



const deleteProject = async (req, res) => {
    const projectId = req.params.projectId
    if (!projectId) {
        return res.status(400).send(
            errorResponseFunc(
                "projectId is required",
                responseMessage.notFound,
                statusCode.notFound,
                constants.NOTFOUND
            ))
    }

    await Projects.destroy({
        where: { id: projectId }
    })
    return res.send(
        successResponseFunc(
            "Successfully deleted project",
            statusCode.success,
            constants.SUCCESS
        )
    )
}

module.exports = deleteProject