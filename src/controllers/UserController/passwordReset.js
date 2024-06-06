const { User, statusCode, constants } = require('./userPackageCentral')

const forgetPassword = async (req, res) => {
    try {
        const userId = req.userId
        const { password, confirmPassword } = req.body
        if (!password || !confirmPassword) {
            res.send(errorResponseFunc("You have to enter password and confirmPassword.", "Password and confirmPassword required.", statusCode.badRequest, constants.BADREQUEST));
        } else {
            User.findOne({
                where: {
                    email: userEmail.toLowerCase(),
                    isActive: constants.ACTIVE,
                }
            })
            .then(async (data) => {
                if (data) {
                    if (password !== confirmPassword) {
                        res.send(errorResponseFunc("Both passwords does not match.", "Passwords does not match.", statusCode.badRequest, constants.BADREQUEST));
                    } else {
                        await User.update({ password: password }, { where: { id: userId } })
                        res.send(successResponseFunc("Updated successfully.", statusCode.success, constants.SUCCESS))
                    }
                }
            })
            .catch((err) => {
                res.send(errorResponseFunc("Encountered some error while updating the data.", err.toString(), statusCode.internalServerError, constants.ERROR));
            })
        }

    } catch (error) {
        console.log('error', error) 
    }
}