const { fs } = require("../AdminController/adminPackageCentral");
const {
  statusCode,
  constants,
  successResponseFunc,
  errorResponseFunc,
  unlinkFiles,
  EmployeeDocuments,
  logger,
  path,
} = require("./employeeDocumentPackageCentral");

const addEmployeeDocument = async (req, res) => {
  try {
    const { files = [] } = req;
    if (files.length === 0) {
      unlinkFiles(req.files || files);
      logger.warn(
        errorResponseFunc(
          "There is no request body.",
          "No request body.",
          statusCode.badRequest,
          constants.BADREQUEST
        )
      );
      return res.send(
        errorResponseFunc(
          "There is no request body.",
          "No request body.",
          statusCode.badRequest,
          constants.BADREQUEST
        )
      );
    } else {
      const obj = files.reduce((accumulator, file) => {
        const capitalizedFieldname = file.fieldname;
        accumulator[capitalizedFieldname] = file.filename;
        return accumulator;
      }, {});
      const payload = {
        ...(obj.tenMarksheet && { tenMarksheet: obj.tenMarksheet || null }),
        ...(obj.twelveMarksheet && {
          twelveMarksheet: obj.twelveMarksheet || null,
        }),
        ...(obj.degreeMarksheet && {
          degreeMarksheet: obj.degreeMarksheet || null,
        }),
        ...(obj.adharCard && { adharCard: obj.adharCard || null }),
        ...(obj.panCard && { panCard: obj.panCard || null }),
        ...(obj.salarySlip1 && { salarySlip1: obj.salarySlip1 || null }),
        ...(obj.salarySlip2 && { salarySlip2: obj.salarySlip2 || null }),
        ...(obj.salarySlip3 && { salarySlip3: obj.salarySlip3 || null }),
        ...(obj.probationComplitionLetter && {
          probationComplitionLetter: obj.probationComplitionLetter || null,
        }),
        ...(obj.appointmentLetter && {
          appointmentLetter: obj.appointmentLetter || null,
        }),
        employeeId: req.loggersId,
      };
      const employeeDocuments = await EmployeeDocuments.findOne({
        where: {
          employeeId: payload.employeeId,
        },
      });

      if (!employeeDocuments) {
        await EmployeeDocuments.create({
          ...payload,
          isActive: constants.ACTIVE,
        });
        return res.send(
          successResponseFunc(
            `Documents created successfully`,
            statusCode.created,
            constants.CREATED
          )
        );
      }

      Object.keys(payload).forEach((key) => {
        let dirnamePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "src",
          "public",
          "uploads",
          `${key}`
        );
        const newFile = payload[key];
        if (newFile && employeeDocuments[key]) {
          const oldProfile = path.join(dirnamePath, employeeDocuments[key]);
          if (fs.existsSync(oldProfile)) {
            try {
              fs.unlinkSync(oldProfile);
            } catch (err) {
              console.error(`Error deleting file ${oldProfile}:`, err);
            }
          }
        }
      });
      await EmployeeDocuments.update(
        { ...payload },
        {
          where: { employeeId: payload.employeeId },
        }
      );
      return res.send(
        successResponseFunc(
          `Documents update successfully`,
          statusCode.success,
          constants.SUCCESS
        )
      );
    }
  } catch (err) {
    unlinkFiles(req.files || files);
    logger.error(
      errorResponseFunc(
        "Encountered error while syncing the document table.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    return res.send(
      errorResponseFunc(
        "Encountered error while syncing the document table.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

module.exports = addEmployeeDocument;
