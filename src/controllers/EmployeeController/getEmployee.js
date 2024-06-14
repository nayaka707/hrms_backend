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

const getByIdEmployeesData = async (req, res) => {
  try {
    const EmployeeId = req.params.EmployeeId
      ? req.params.EmployeeId
      : res.locals.EmployeeId;

    const findAllEmployeeDtails = await Employees.findOne({
      where: {
        id: EmployeeId,
      },
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
                `'${
                  PUBLIC_URL + "/probationComplitionLetter/"
                }' || "probationComplitionLetter"`
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
          attributes: ["bankName", "accountNo", "IFSC"],
        },
        {
          model: Designation,
          attributes: ["name"],
        },
        {
          model: Department,
          attributes: ["name"],
        },
        {
          model: EmergencyContact,
          attributes: ["name"],
        },
      ],
      attributes: [
        "id",
        "firstName",
        "employeeId",
        "lastName",
        "email",
        "dateOfJoining",
        "phoneNumber",
        "departmentId",
        "designationId",
        "occupation",
        "roleId",
        "nationality",
        "city",
        "state",
        "pinCode",
        "passportNumber",
        "fathersFullName",
        "mothersFullName",
        "presentAddress",
        "permanentAddress",
        "qualifications",
        "middleName",
        "pancardNo",
        "aadharNo",
        "uanNo",
        "workLocation",
        "pfNo",
        "gender",
        "reportTo",
        "reportToImage",
        "countryCode",
        "birthday",
        "dateOfJoining",
        [
          literal(`'${PUBLIC_URL + "/profilePicture/"}' || "profilePicture"`),
          "profilePicture",
        ],
      ],
    });

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
