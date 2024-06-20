const { WorkLogs } = require("../../models/associations");
const {
    constants,
    statusCode,
    successResponseFunc,
    errorResponseFunc,

} = require("../EmployeeController/employeePackageCentral");


const createWorkLog = async (req, res) => {
    try {

        for (let row of req.body) {
            if (!row.date || !row.workHour || !row.description || !row.projectId || !row.employeeId) {
                return res.status(400).send(
                    errorResponseFunc(
                        "Please fill all the fields.",
                        "Empty fields.",
                        statusCode.badRequest,
                        constants.BADREQUEST
                    )
                );
            }
            await WorkLogs.create({
                date: row.date,
                projectId: row.projectId,
                workHour: row.workHour,
                description: row.description,
                employeeId: row.employeeId
            })
        }

        return res.status(201).send(
            successResponseFunc(
                `Successfully added WorkLog.`,
                statusCode.created,
                constants.CREATED,
            )
        );

    } catch (err) {
        console.log('err', err)

    }


}

module.exports = createWorkLog