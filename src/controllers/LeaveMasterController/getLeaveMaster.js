const {
  statusCode,
  constants,
  LeaveMaster,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./leaveMasterPackageCentral");

const getAllLeaveMaster = (req, res) => {
  try {
    LeaveMaster.findAll({
      attributes: ["id", "month", "leaves"],
      order: [
      ['month', 'ASC']
     ]
    })
      .then((data) => {
        const monthOrder = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        data.sort((a, b) => {
          return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
        });
        res.send(
          successResponseFunc(
            "Here is the Leave Master's data.",
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
  getAllLeaveMaster,
};
