const { Employees, errorResponseFunc, statusCode, constants, successResponseFunc } = require('./employeePackageCentral')

const updateEmployeeData = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        if (!employeeId) {
            return res.status(400).send({ success: false, message: 'employeeId is required to update' });
        }

        const updateData = {};
        const allowedFields = ['firstName', 'lastName', 'middleName', 'pancardNo', 'aadharNo', 'uanNo', 'workLocation', 'pfNo', 'gender', 'currentAddress', 'permanentAddress', 'email', 'dateOfJoining', 'phoneNumber', 'password', 'isActive', 'emergencyContact', 'city', 'state', 'pincode', 'passportNumber', 'fatherName', 'motherName', 'nationality', 'dateOfBirth', 'experience', 'qualification'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });


        const employee = await Employees.findByPk(employeeId);
        if (!employee) {
            return res.status(400).send({ success: false, message: 'No employee found' });
        }

        await employee.update(updateData);
        return res.send(successResponseFunc("Successfully updated employee details", statusCode.success, constants.SUCCESS))

    } catch (err) {
        res.status(statusCode.internalServerError).send(
            errorResponseFunc('Encountered some error', err.toString(), statusCode.internalServerError, constants.ERROR)
        );
    }
}

module.exports = { updateEmployeeData }
