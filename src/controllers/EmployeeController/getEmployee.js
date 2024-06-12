const { literal } = require("sequelize");
const {
  Employees,
  statusCode,
  constants,
  errorResponseFunc,
  successResponseFunc,
  PUBLIC_URL,
  bcrypt,
  Role,
  models,
  Op,
  logger,
} = require("./employeePackageCentral");

const getAllEmployeesData = (req, res) => {
  try {
    const employeeId = req.loggersId;
    const role = req.roleName;

    Employees.findAll({
      where: { id: { [Op.ne]: employeeId } },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "middleName",
        [
          literal(
            `'${
              PUBLIC_URL + "/profilePicture/"
            }' || "employees"."profilePicture"`
          ),
          "profilePicture",
        ],
      ],
      include: {
        model: Role,
        attributes: ["id", "name"],
        as: "role",
        where: {
          name: {
            [Op.notIn]: ["SUPER ADMIN", ...(role === "EMPLOYEE" ? ["HR"] : [])],
          },
        },
      },
    })
      .then((data) => {
        res.send(
          successResponseFunc(
            "Here is the Employee's data.",
            statusCode.success,
            constants.SUCCESS,
            data
          )
        );
      })
      .catch((err) => {
        logger.error(
          errorResponseFunc(
            "Encountered error after checking if this exists.",
            err.toString(),
            statusCode.internalServerError,
            constants.ERROR
          )
        );
        res.send(
          errorResponseFunc(
            "Encountered error after checking if this exists.",
            err.toString(),
            statusCode.internalServerError,
            constants.ERROR
          )
        );
      });
  } catch (err) {
    logger.error(
      errorResponseFunc(
        "Encountered some error.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    res.send(
      errorResponseFunc(
        "Encountered some error.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

const getByIdEmployeesData = (req, res) => {
  try {
    const employeeId = req.loggersId;

    Employees.findOne({
      where: {
        id: employeeId,
      },
    })
      .then((data) => {
        res.send(
          successResponseFunc(
            "Here is the Employee's data.",
            statusCode.success,
            constants.SUCCESS,
            data
          )
        );
      })
      .catch((err) => {
        logger.error(
          errorResponseFunc(
            "Encountered error after checking if this exists.",
            err.toString(),
            statusCode.internalServerError,
            constants.ERROR
          )
        );
        res.send(
          errorResponseFunc(
            "Encountered error after checking if this exists.",
            err.toString(),
            statusCode.internalServerError,
            constants.ERROR
          )
        );
      });
  } catch (err) {
    logger.error(
      errorResponseFunc(
        "Encountered some error.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    res.send(
      errorResponseFunc(
        "Encountered some error.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

module.exports = {
  getAllEmployeesData,
  getByIdEmployeesData,
};
