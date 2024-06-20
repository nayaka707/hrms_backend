const { statusCode, constants, logger, errorResponseFunc, successResponseFunc, Projects } = require('./projectPackageCentral')


const addProject = async (req, res) => {
    try {
        const { name, projectId } = req.body
        if (projectId) {
            const project = await Projects.findByPk(projectId)
            if (project) {
                let updatedProject = await project.update(req.body)
                return res.status(200).send(successResponseFunc(
                    `Project Updated successfully`,
                    statusCode.success,
                    constants.SUCCESS,
                    updatedProject
                ))
            }
        }

        const createProject = await Projects.create({
            name
        })
        res.status(201).send(successResponseFunc(
            `Project created successfully`,
            statusCode.created,
            constants.CREATED,
            createProject
        ))
    } catch (err) {
        console.log(err)
    }
}


module.exports = addProject