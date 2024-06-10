const { Employees, errorResponseFunc, statusCode, constants, successResponseFunc } = require('./employeePackageCentral')


const deleteEmployee = async (req, res) => {
    try {

        const employeeId = req.params.employeeId
        if (!employeeId) {
            return errorResponseFunc('employeeId is required to delete')
        }
        const employee = await Employees.findByPk(employeeId)
        if (!employee) {
            return errorResponseFunc('no employee found')
        }
        if (employee.deletedAt != null) {
            return res.status(400).json({ status: false, message: "Employee was already deleted" })
        }
        await employee.update({ deletedAt: Date.now(), isActive: constants.INACTIVE })
        return res.send(successResponseFunc("Successfully deleted", statusCode.success, constants.SUCCESS))
    } catch (err) {
        console.log(err)
        res.status(statusCode.internalServerError).send(
            errorResponseFunc('Encounterd some error', err.toString().statusCode.internalServerError)
        )
    }
}

module.exports = { deleteEmployee }