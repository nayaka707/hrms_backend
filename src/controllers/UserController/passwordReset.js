const { statusCode, constants, successResponseFunc, errorResponseFunc, Employees ,sendEmail } = require("./userPackageCentral");

forgetPassword = async (req, res) => {
    try {
        const userId = req.userId
        const { password, confirmPassword } = req.body
        if (!password || !confirmPassword) {
            res.send(errorResponseFunc("You have to enter password and confirmPassword.", "Password and confirmPassword required.", statusCode.badRequest, constants.BADREQUEST));
        } else {
            Employees.findOne({
                where: {
                    id: userId,
                    isActive: constants.ACTIVE,
                }
            })
                .then(async (data) => {
                    if (data) {
                        if (password !== confirmPassword) {
                            res.send(errorResponseFunc("Both passwords does not match.", "Passwords does not match.", statusCode.badRequest, constants.BADREQUEST));
                        } else {
                            await Employees.update({ password: password }, { where: { id: userId } })

                            const subject = "Forget Password";
                            const emailBody =
                                `<html><body>` +
                                `<h2>Hello ${data.firstName},</h2>` +
                                `<p style="font-size:18px">Your password has been changed<br/>` +
                                `This is you new login credential <br/>` +
                                `<h3>Email: ${data.email}</h3>` +
                                `<h3>Password: ${password}</h3><br/>` +
                                `<span style="font-size:15px">Don't share this with anyone(secret) or update immediately.</center><br/>` +
                                `</span></p></body></html>`;
                            await sendEmail(data.email, subject, emailBody);
                            res.send(successResponseFunc("Updated successfully.", statusCode.success, constants.SUCCESS))
                        }
                    }
                })
                .catch((err) => {
                    res.send(errorResponseFunc("Encountered some error while updating the data.", err.toString(), statusCode.internalServerError, constants.ERROR));
                })
        }

    } catch (error) {
    }
}


module.exports = forgetPassword;