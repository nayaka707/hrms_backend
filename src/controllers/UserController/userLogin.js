const { errorResponseFunc } = require('../../utils/responseFunction')
const { statusCode } = require('../../utils/statusCodes')
const { constants } = require('../../utils/constants')
const { User, Role, statusCode, jwt, TOKEN_SECRET, bcrypt, TOKEN_MAXAGE } = require("./userPackageCentral");


const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.send(errorResponseFunc("Please fill all the fields.", "Empty fields.", statusCode.badRequest, constants.BADREQUEST))
        }
        const data = await User.findOne({
            where: {
                email: email.toLowerCase(),
                isActive: constants.ACTIVE,
            },
        });

        if (!data) {
            return res.send(errorResponseFunc("User not found.", "Such user does not exist.", statusCode.notFound, constants.NOTFOUND));
        }
        const userData = data;

        const passwordIsValid = bcrypt.compareSync(password, userData.temporaryPassword);

        if (!passwordIsValid) {
            return res.send(errorResponseFunc("The password is incorrect.", "Incorrect password.", statusCode.unauthorized, constants.UNAUTHORIZED));
        }

        try {
            const role = await Role.findOne({
                where: { id: userData.roleId, },
            });
            if (!role) {
                return res.send(errorResponseFunc("Role not found.", "Such role does not exist.", statusCode.notFound, constants.NOTFOUND));
            }
            const token = jwt.sign(
                {
                    id: data.id,
                    roleId: data.roleId,
                    role: role.name,
                    userId: userData.id,
                },
                TOKEN_SECRET,
                {
                    expiresIn: Number(TOKEN_MAXAGE),
                }
            );
            res.setHeader("token", token);
            return res.send(successResponseFunc("Logged in successfully", statusCode.success, constants.SUCCESS, { token: token, }, data.name));

        } catch (roleErr) {
            return res.send(
                errorResponseFunc("Encountered some error while fetching role.", roleErr.toString(), statusCode.internalServerError, constants.ERROR
                ));
        }

    } catch (err) {
        return res.send(errorResponseFunc("Encountered some error.", err.toString(), statusCode.internalServerError, constants.ERROR));
    }

}


module.exports = userLogin;