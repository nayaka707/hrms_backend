const { literal } = require("sequelize");
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
} = require("./employeePackageCentral");

const getAllEmployeesData = async (req, res) => {
  try {
    const role = req.roleName;
    let employeeName = req.query.employeeName?.trim().replace(/^"|"$/g, "");

    let whereClause = {
      isActive: constants.ACTIVE,
    };
    if (employeeName) {
      whereClause[Op.or] = [
        Sequelize.where(
          Sequelize.fn(
            "concat",
            Sequelize.col("firstName"),
            " ",
            Sequelize.col("lastName")
          ),
          {
            [Op.iLike]: `%${employeeName}%`,
          }
        ),
        { firstName: { [Op.iLike]: `%${employeeName}%` } },
        { lastName: { [Op.iLike]: `%${employeeName}%` } },
      ];
    };

    let roleWhereClause = {};
    if (role === constants.ADMIN) {
      // No role filtering needed for SUPER ADMIN
    } else if (role === constants.HR) {
      roleWhereClause = {
        name: {
          [Op.notIn]: [constants.ADMIN],
        },
      };
    };

    await Employees.findAll({
      where: whereClause,
      attributes: [
        "id",
        "firstName",
        "lastName",
        "middleName",
        [
          literal(`'${PUBLIC_URL}/profilePicture/' || "profilePicture"`),
          "profilePicture",
        ],
      ],
      include: {
        model: Role,
        attributes: ["id", "name"],
        as: "role",
        where: roleWhereClause,
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

const getByIdEmployeesData = async (req, res) => {
  try {
    const employeeId = req.params.id ? req.params.id : req.loggersId;

    const reportToId = await models.Employees.findOne({
      where: {
        id: findAllEmployeeDtails.dataValues.ReportTo,
      },
    });
    const experience = await models.ExperienceDetails.findAll({
      where: {
        EmployeeId: payload.EmployeeId,
      },
    });

    const userDetails = {
      ...response.data.dataValues,
      ReportingToName: response.ReportingToName,
      Department: response.DepartmentId,
      Designation: response.DesignationId,
    };
    delete userDetails.EmployeeDocument;
    delete userDetails.EmployeeBankDetail;
    delete userDetails.EmergencyContact;

    const documentsData = response.data.dataValues.EmployeeDocument;

    const documentDetails = {
      ...documentsData?.dataValues,
    };

    const bankDetailsData =
      response.data.dataValues.EmployeeBankDetail?.dataValues;

    const bankDetails = {
      BankName: bankDetailsData?.BankName,
      AccountNO: bankDetailsData?.AccountNO,
      IFSCCode: bankDetailsData?.IFSCCode,
      BranchName: bankDetailsData?.BranchName,
    };
    const emergencyContactData =
      response.data.dataValues.EmergencyContact?.dataValues;

    const EmergencyContact = {
      PrimaryName: emergencyContactData?.PrimaryName,
      PrimaryRelation: emergencyContactData?.PrimaryRelationship,
      PrimaryPhoneNo: emergencyContactData?.PrimaryPhoneNo,
      SecondaryName: emergencyContactData?.SecondaryName,
      SecondaryRelation: emergencyContactData?.SecondRelationship,
      SecondaryPhoneNo: emergencyContactData?.SecondaryPhoneNo,
    };

    const data = {
      employee: userDetails,
      documents: documentDetails,
      bankDetails: bankDetails,
      emergencyContacts: EmergencyContact,
      experienceDetails: response?.ExperienceDetails,
    };

    res.send(
      successResponseFunc(
        "Here is the Employees Data's data.",
        statusCode.success,
        constants.SUCCESS,
        data
      )
    );
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
