const {
  statusCode,
  constants,
  successResponseFunc,
  errorResponseFunc,
  logger,
  path,
  Attendance,
  Employees,
  fs,
  csv,
} = require("./attendancePackageCentral");

const getAllAttendance = async (req, res) => {
  try {
    const employee = await Employees.findOne({
      employeeCode: req.body.employeeCode,
    });
    const attendance = await Attendance.findAll({
      where: {
        employeeCode: req.body.employeeCode,
      },
    });

    const data = attendance.forEach((attendanceData) => {
      const punchTimes = attendanceData.dataValues.punchRecords
        .split(" ")
        .map((record) => {
          const [time, action] = record.split(":").slice(0, 2);
          return { time, action };
        });
      let breaks = [];
      for (let i = 0; i < punchTimes.length - 1; i += 2) {
        breaks.push({
          TimeIn: `${punchTimes[i].time}:${punchTimes[i].action}`,
          TimeOut: `${punchTimes[i + 1].time}:${punchTimes[i + 1].action}`,
          OutHrs: "",
          WorkHrs: "",
        });
      }
     
      return {
        Date: attendanceData.dataValues.date,
        FirstInTime: attendanceData.dataValues.inTime,
        LastOutTime: attendanceData.dataValues.outTime,
        TotalOutHours: attendanceData.dataValues.outDuration,
        TimeLog: "03:14",
        WorkLog: attendanceData.dataValues.inDuration,
        DifferenceTLWL: "00:00",
        BreakDetails: breaks,
      };
    });
    // console.log("data >>", data);
    // let payload = {  
    //   EmployeeCode: employee.employeeCode,
    //   Name: `${employee.firstName} ${employee.middleName} ${employee.lastName}`,
    //   Hours: "00:00",
    //   PDays: "00",
    //   LDays: "00",
    //   HalfLeaves: "00",
    //   LateDays: "00",
    //   AvgTimeLog: "00:00",
    //   AvgWorkLog: "00:00",
    //   DifferenceTLWL: "00:00",
    //   OutHours: "00:00",
    // };

    return res.send(
      successResponseFunc(
        `get All employee attendance`,
        statusCode.success,
        constants.SUCCESS,
        attendance
      )
    );
  } catch (err) {
    logger.error(
      errorResponseFunc(
        "Encountered error while syncing the get All Attendance table.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    return res.send(
      errorResponseFunc(
        "Encountered error while syncing the get All Attendance table.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

module.exports = { getAllAttendance };
