const {
  WorkLogs,
  constants,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
  logger,
  Projects,
} = require("./workLogPackageCentral");

const getAllWorkLogs = async (req, res) => {
    try {
      const id = req.loggersId;
  
      const works = await WorkLogs.findAll({
        where: { employeeId: id },
        include: [
          {
            model: Projects,
            attributes: ['name']
          }
        ],
        attributes: [
          "id",
          "date",
          "employeeId",
          "projectId",
          "workHour",
          "description",
        ],
        order: [["date", "DESC"]],
      });
  
      if (works.length === 0) {
        return res.send(
          errorResponseFunc(
            "No worklogs found.",
            "No worklogs found.",
            statusCode.notFound,
            constants.NOTFOUND
          )
        );
      } else {
        const groupedWorks = works.reduce((acc, work) => {
          const date = work.date.toISOString().split("T")[0];
          if (!acc[date]) {
            acc[date] = { workLogs: [], projects: new Set() };
          }
          acc[date].workLogs.push({
            id: work.id,
            date: work.date,
            employeeId: work.employeeId,
            projectId: work.projectId,
            projectName: work.project.name,
            workHour: work.workHour,
            description: work.description
          });
          acc[date].projects.add(work.project.name);
          return acc;
        }, {});
  
        const result = Object.keys(groupedWorks).map(date => ({
          date,
          projects: Array.from(groupedWorks[date].projects),
          workLogs: groupedWorks[date].workLogs
        }));
  
        return res.send(
          successResponseFunc(
            "Successfully fetched worklogs.",
            statusCode.success,
            constants.SUCCESS,
            result
          )
        );
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
  

module.exports = getAllWorkLogs;
