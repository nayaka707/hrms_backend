const {
  WorkLogs,
  constants,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./workLogPackageCentral");

const deleteWorkLog = async (req, res) => {
  try {
    const id = req.params.id;
    if(!id){
      return res.send(
        errorResponseFunc(
          "Worklog id not found.",
          "Worklog id not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    }else {
        const work = await WorkLogs.findOne({
            where: { id: id },
        });
        if (!work) {
            return res.send(
            errorResponseFunc(
                "Worklog not found.",
                "Worklog not found.",
                statusCode.notFound,
                constants.NOTFOUND
            )
            );
        } else {
            await work.destroy();
            return res.send(
            successResponseFunc(
                "Worklog deleted successfully.",
                "Worklog deleted successfully.",
                statusCode.success,
                constants.SUCCESS
            )
            );
        }
    }
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

module.exports = deleteWorkLog;