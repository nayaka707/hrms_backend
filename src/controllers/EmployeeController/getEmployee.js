const { literal, fn, col } = require("sequelize");
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
            Sequelize.col("employees.firstName"),
            " ",
            Sequelize.col("employees.lastName")
          ),
          {
            [Op.iLike]: `%${employeeName}%`,
          }
        ),
        { firstName: { [Op.iLike]: `%${employeeName}%` } },
        { lastName: { [Op.iLike]: `%${employeeName}%` } },
      ];
    }
    // Debugging: Log whereClause
    console.log("Where Clause:", whereClause);
    let roleWhereClause = {};
    if (role === constants.ADMIN) {
    } else if (role === constants.HR) {
      roleWhereClause = {
        name: {
          [Op.notIn]: [constants.ADMIN],
        },
      };
    }

    await Employees.findAll({
      where: whereClause,
      attributes: [
        "id",
        "employee_code",
        "firstName",
        "lastName",
        "middleName",
        "departmentId",
        "reportTo",
        [
          literal(
            `'${PUBLIC_URL}/profilePicture/' || "employees"."profilePicture"`
          ),
          "profilePicture",
        ],
      ],
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
          as: "role",
          where: roleWhereClause,
        },
        {
          model: Department,
          attributes: ["id", "name"],
          as: "department",
        },
        {
          model: Employees,
          attributes: ["id", "firstName", "lastName"],
          as: "reportToPerson",
        },
      ],
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
    console.log(err);
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

    const getAllEmployeeDtails = await Employees.findOne({
      where: {
        id: employeeId,
        isActive: constants.ACTIVE,
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "middleName",
        "pancardNo",
        "aadharNo",
        "uanNo",
        "workLocation",
        "pfNo",
        "email",
        "dateOfJoining",
        "gender",
        "phoneNumber",
        "departmentId",
        "designationId",
        "reportTo",
        [
          literal(`'${PUBLIC_URL + "/profilePicture/"}' || "profilePicture"`),
          "profilePicture",
        ],
        "currentAddress",
        "permanentAddress",
        "roleId",
        "isActive",
        "emergencyContact",
        "city",
        "state",
        "pincode",
        "passportNumber",
        "fatherName",
        "motherName",
        "dateOfBirth",
        "nationality",
        "experience",
        "qualification",
      ],
      include: [
        {
          model: EmployeeDocuments,
          attributes: [
            "id",
            [
              literal(`'${PUBLIC_URL + "/tenMarksheet/"}' || "tenMarksheet"`),
              "tenMarksheet",
            ],
            [
              literal(
                `'${PUBLIC_URL + "/twelveMarksheet/"}' || "twelveMarksheet"`
              ),
              "twelveMarksheet",
            ],
            [
              literal(
                `'${PUBLIC_URL + "/degreeMarksheet/"}' || "degreeMarksheet"`
              ),
              "degreeMarksheet",
            ],
            [
              literal(`'${PUBLIC_URL + "/adharCard/"}' || "adharCard"`),
              "adharCard",
            ],
            [literal(`'${PUBLIC_URL + "/panCard/"}' || "panCard"`), "panCard"],
            [
              literal(`'${PUBLIC_URL + "/salarySlip1/"}' || "salarySlip1"`),
              "salarySlip1",
            ],
            [
              literal(`'${PUBLIC_URL + "/salarySlip2/"}' || "salarySlip2"`),
              "salarySlip2",
            ],
            [
              literal(`'${PUBLIC_URL + "/salarySlip3/"}' || "salarySlip3"`),
              "salarySlip3",
            ],
            [
              literal(
                `'${PUBLIC_URL + "/probationComplitionLetter/"}
                ' || "probationComplitionLetter"`
              ),
              "ProbationComplitionLetter",
            ],
            [
              literal(
                `'${PUBLIC_URL + "/appointmentLetter/"}' || "appointmentLetter"`
              ),
              "appointmentLetter",
            ],
          ],
        },
        {
          model: BankDetails,
          attributes: [
            "bankName",
            "accountNo",
            "IFSC",
            "branchName",
            "isActive",
            "employeeId",
          ],
        },
        {
          model: Designation,
          as: "designations",
          attributes: ["name"],
        },
        {
          model: Department,
          as: "department",
          attributes: ["name"],
        },
        {
          model: EmergencyContacts,
          as: "emergencyContacts",
          attributes: [
            "primaryName",
            "primaryRelationship",
            "primaryPhoneNo",
            "primaryAddress",
            "secondaryName",
            "secondRelationship",
            "secondaryPhoneNo",
            "secondaryAddress",
            "employeeId",
          ],
        },
        {
          model: ExperienceDetails,
          attributes: [
            "companyName",
            "designation",
            "location",
            "periodFrom",
            "periodTo",
            "experienceId",
            "employeeId",
          ],
        },
        {
          model: Assets,
          attributes: [
            "assetsName",
            "assetsId",
            "assignedDate",
            "employeeId",
          ],
        },
      ],
    });
    if (!getAllEmployeeDtails) {
      logger.warn(
        errorResponseFunc(
          "Employee not found.",
          "Employee not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      return res.send(
        errorResponseFunc(
          "Employee not found",
          "Employee not found",
          statusCode.badRequest,
          constants.NOTFOUND
        )
      );
    }

    let reportToFullName;
    if (getAllEmployeeDtails.reportTo) {
      const reportingPerson = await models.Employees.findOne({
        where: {
          id: getAllEmployeeDtails.reportTo,
        },
        attributes: [
          [fn("concat", col("firstName"), " ", col("lastName")), "fullName"],
        ],
      });
      reportToFullName = reportingPerson
        ? reportingPerson.dataValues?.fullName
        : null;
    }
    // employee data
    const employeeData = getAllEmployeeDtails.toJSON();

    const emergencyContact = employeeData.emergencyContacts || {};
    const bankDetail = employeeData.bankDetail || {};
    const experienceDetails = employeeData.experienceDetails || [];
    const employeeDocuments = employeeData.employeeDocument || {};
    const assets = employeeData.assets || {};

    const data = {
      employee: {
        id: employeeData.id,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        pancardNo: employeeData.pancardNo,
        middleName: employeeData.middleName,
        aadharNo: employeeData.aadharNo,
        uanNo: employeeData.uanNo,
        workLocation: employeeData.workLocation,
        pfNo: employeeData.pfNo,
        email: employeeData.email,
        dateOfJoining: employeeData.dateOfJoining,
        gender: employeeData.gender,
        phoneNumber: employeeData.phoneNumber,
        departmentId: employeeData.departmentId,
        designationId: employeeData.designationId,
        profilePicture: employeeData.profilePicture,
        currentAddress: employeeData.currentAddress,
        permanentAddress: employeeData.permanentAddress,
        roleId: employeeData.roleId,
        isActive: employeeData.isActive,
        emergencyContact: employeeData.emergencyContact,
        city: employeeData.city,
        state: employeeData.state,
        pincode: employeeData.pincode,
        passportNumber: employeeData.passportNumber,
        fatherName: employeeData.fatherName,
        motherName: employeeData.motherName,
        dateOfBirth: employeeData.dateOfBirth,
        nationality: employeeData.nationality,
        experience: employeeData.experience,
        qualification: employeeData.qualification,
        reportTo: reportToFullName,
        reportToId : employeeData.reportTo,
        designationName: employeeData.designations
          ? employeeData.designations.name
          : null,
        departmentName: employeeData.department
          ? employeeData.department.name
          : null,
      },
      documents: employeeDocuments,
      bankDetails: bankDetail,
      emergencyContacts: emergencyContact,
      experienceDetails: experienceDetails,
      assets: assets,
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
    res
      .status(500)
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

module.exports = {
  getAllEmployeesData,
  getByIdEmployeesData,
};
