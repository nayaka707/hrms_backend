const { literal, fn, col, where } = require("sequelize");
const {
    Employees,
    statusCode,
    constants,
    errorResponseFunc,
    BankDetails,
    EmergencyContacts,
    EmployeeDocuments,
    ExperienceDetails,
    Assets,
    Department,
    Designation,
    successResponseFunc,
    PUBLIC_URL,
    bcrypt,
    Role,
    models,
    Op,
    logger,
    Sequelize,
    WorkLogs,
    Projects
} = require("./employeePackageCentral");



const getWorkLogByEmployeeId = async (req, res) => {
    try {
        let employeeId = req.loggersId

        const workLog = await WorkLogs.findAndCountAll({
            where: {
                employeeId
            },
            include: [
                {
                    model: Employees,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Projects,
                    attributes: ['id', 'name',],
                }
            ]
        })

        if (!workLog.count) {
            return res.status(400).send(
                'no data found'
            )
        }

        return res.status(200).send(workLog)

    } catch (err) {
        console.log(err)
    }

}


module.exports = { getWorkLogByEmployeeId }