const { Employees } = require("../../models/associations");
const {
  constants,
  statusCode,
  successResponseFunc,
  errorResponseFunc,
  bcrypt,
  Role,
  jwt,
  TOKEN_SECRET,
  TOKEN_MAXAGE,
} = require("./employeePackageCentral");

const getUserByEmail = async (email) => {
  return Employees.findOne({
    where: {
      email: email.toLowerCase(),
      isActive: constants.ACTIVE,
    },
  });
};

const getRoleById = async (roleId) => {
  return Role.findOne({
    where: { id: roleId },
  });
};

const generateToken = (userData, role) => {
  return jwt.sign(
    {
      id: userData.id,
      roleId: userData.roleId,
      role: role.name,
      employeeId: userData.id,
      name: `${userData.firstName} ${userData.lastName}`,
    },
    TOKEN_SECRET,
    { expiresIn: Number(TOKEN_MAXAGE) }
  );
};

const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(statusCode.badRequest)
        .send(
          errorResponseFunc(
            "Please fill all the fields.",
            "Empty fields.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
    }

    const userData = await getUserByEmail(email);
    if (!userData) {
      return res
        .status(statusCode.notFound)
        .send(
          errorResponseFunc(
            "User not found.",
            "Such user does not exist.",
            statusCode.notFound,
            constants.NOTFOUND
          )
        );
    }

    const passwordIsValid = bcrypt.compareSync(password, userData.password);
    if (!passwordIsValid) {
      return res
        .status(statusCode.unauthorized)
        .send(
          errorResponseFunc(
            "The password is incorrect.",
            "Incorrect password.",
            statusCode.unauthorized,
            constants.UNAUTHORIZED
          )
        );
    }

    const role = await getRoleById(userData.roleId);
    if (!role) {
      return res
        .status(statusCode.notFound)
        .send(
          errorResponseFunc(
            "Role not found.",
            "Such role does not exist.",
            statusCode.notFound,
            constants.NOTFOUND
          )
        );
    }

    const token = generateToken(userData, role);
    res.setHeader("token", token);

    return res
      .status(statusCode.success)
      .send(
        successResponseFunc(
          "Logged in successfully",
          statusCode.success,
          constants.SUCCESS,
          { token },
          userData.name
        )
      );
  } catch (err) {
    return res
      .status(statusCode.internalServerError)
      .send(
        errorResponseFunc(
          "Encountered some error.",
          err.toString(),
          statusCode.internalServerError,
          constants.ERROR
        )
      );
  }
};

module.exports = { employeeLogin, generateToken, getRoleById };
