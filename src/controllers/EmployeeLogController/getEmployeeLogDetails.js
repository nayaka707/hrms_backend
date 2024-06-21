
const { statusCode, constants, EmployeeLogDetails, logger, successResponseFunc, errorResponseFunc, Employees, WorkLogs, Sequelize } = require('./employeeLogPackageCentral');
const moment = require('moment');
const { Op } = require("sequelize");

const formatHoursToHHMM = (hours) => {
    const duration = moment.duration(hours, 'hours');
    const formattedTime = `${Math.floor(duration.asHours())}:${duration.minutes().toString().padStart(2, '0')}`;
    return formattedTime;
};

const formatTimeTo12Hour = (time) => {
    return time == null ? "" : moment(time, 'HH:mm:ss').format('h:mm a');
};

const getWorkLogHoursSum = async (employeeId, date) => {
    try {
        let startDate = moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        let endDate = moment(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');

        const workLogs = await WorkLogs.findAll({
            where: {
                employeeId: employeeId,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: ['id', 'workHour', 'employeeId']
        });

        if (workLogs.length) {
            const totalMinutes = workLogs.reduce((sum, log) => {
                const [hours, minutes] = log.workHour.split(':').map(Number);
                return sum + (hours * 60) + minutes;
            }, 0);

            const totalHoursDecimal = (totalMinutes / 60).toFixed(2);
            return parseFloat(totalHoursDecimal);
        } else {
            return 0
        }

    } catch (error) {
        console.error('Error fetching total work hours:', error);
    }
};

const getEmployeeLogDetails = async (req, res) => {
    const { employee_code, month, year } = req.query;

    if (!employee_code) {
        return res.status(400).json({ error: 'employee_code is required' });
    }

    try {
        const employee = await Employees.findOne({ where: { employee_code } });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        let startDate, endDate;

        if (month && year) {
            startDate = moment(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD');
            endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        } else if (year) {
            startDate = moment(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
            endDate = moment(startDate).endOf('year').format('YYYY-MM-DD');
        } else if (month) {
            const currentYear = moment().year();
            startDate = moment(`${currentYear}-${month}-01`).startOf('month').format('YYYY-MM-DD');
            endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        } else {
            const currentMonth = moment().format('MM');
            const currentYear = moment().year();
            startDate = moment(`${currentYear}-${currentMonth}-01`).startOf('month').format('YYYY-MM-DD');
            endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        }

        const whereClause = {
            employee_code,
            log_date: {
                [Op.between]: [startDate, endDate]
            }
        };

        const { count, rows: logs } = await EmployeeLogDetails.findAndCountAll({
            attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
            where: whereClause,
            order: [['log_date', 'DESC'], ['log_time', 'ASC']]
        });

        if (!logs.length) {
            return res.status(200).json({ data: { dailyLog: [], monthData: {} } });
        }

        const groupedLogs = logs.reduce((acc, log) => {
            const { log_date, log_time, direction } = log;

            if (!acc[log_date]) {
                acc[log_date] = { first_in: null, last_out: null, inOut: [], totalInTime: 0, totalOutTime: 0 };
            }

            if (direction === 'in') {
                if (!acc[log_date].first_in || log_time < acc[log_date].first_in) {
                    acc[log_date].first_in = log_time;
                }
            } else if (direction === 'out') {
                if (!acc[log_date].last_out || log_time > acc[log_date].last_out) {
                    acc[log_date].last_out = log_time;
                }
            }

            acc[log_date].inOut.push({ direction, time: log_time });

            return acc;
        }, {});

        const result = await Promise.all(Object.entries(groupedLogs).map(async ([log_date, { first_in, last_out, inOut, totalInTime, totalOutTime }]) => {
            const sortedInOut = inOut.sort((a, b) => {
                const timeA = moment(a.time, 'HH:mm:ss');
                const timeB = moment(b.time, 'HH:mm:ss');
                return timeA.isBefore(timeB) ? -1 : 1;
            });

            let inOutPairs = [];
            let dailyTotalInTime = 0;
            for (let i = 0; i < sortedInOut.length; i++) {
                const currentEntry = sortedInOut[i];

                if (currentEntry.direction === 'in') {
                    let outTime = null;
                    for (let j = i + 1; j < sortedInOut.length; j++) {
                        if (sortedInOut[j].direction === 'out') {
                            outTime = sortedInOut[j].time;
                            break;
                        }
                    }

                    const inTime = currentEntry.time;
                    const inMoment = moment(inTime, 'HH:mm:ss');
                    const outMoment = outTime ? moment(outTime, 'HH:mm:ss') : null;

                    let difference = null;
                    if (outMoment && outMoment.isValid()) {
                        const duration = moment.duration(outMoment.diff(inMoment)).asHours();
                        difference = formatHoursToHHMM(duration);
                        if (duration > 0) {
                            dailyTotalInTime += duration;
                        } else {
                            totalOutTime += duration;
                        }
                    }

                    inOutPairs.push({ in: inTime, out: outTime, difference });
                }
            }

            let effectiveLastOut = last_out;
            if (!effectiveLastOut && inOutPairs.length > 0) {
                const lastOutEntry = inOutPairs[inOutPairs.length - 1];
                effectiveLastOut = lastOutEntry.out;
            }

            const dailyTotalOutTime = totalOutTime - dailyTotalInTime;
            let status = dailyTotalInTime > 7 ? 'Present' : (dailyTotalInTime >= 4.5 ? 'Half Day' : 'Absent');

            const workLogHoursSum = await getWorkLogHoursSum(employee.id, log_date);

            return {
                date: log_date,
                first_in: formatTimeTo12Hour(first_in),
                last_out: formatTimeTo12Hour(effectiveLastOut),
                inOut: inOutPairs.map(entry => ({
                    ...entry,
                    in: formatTimeTo12Hour(entry.in),
                    out: entry.out ? formatTimeTo12Hour(entry.out) : null,
                })),
                totalInTime: dailyTotalInTime,
                totalOutTime: dailyTotalOutTime,
                status: status,
                workLogHours: workLogHoursSum,
                TLWLDifference: Math.floor(dailyTotalInTime - workLogHoursSum)
            };
        }));

        let present = 0, absent = 0, halfDay = 0;
        result.forEach(entry => {
            if (entry.inOut.length > 0) {
                let firstIn = entry.inOut[0].in;
                let lastOut = entry.inOut[entry.inOut.length - 1].out
                if (lastOut == null && entry.inOut.length > 1) {
                    lastOut = entry.inOut[entry.inOut.length - 2].out
                }
                const firstInMoment = moment(firstIn, 'h:mm a');
                const lastOutMoment = moment(lastOut, 'h:mm a');
                const duration = moment.duration(lastOutMoment.diff(firstInMoment));
                entry.first_in = firstIn;
                entry.last_out = lastOut;
                entry.totalOutTime = duration.asHours() - entry.totalInTime;
            }
            if (entry.status == 'Present') {
                present++;
            } else if (entry.status == 'Half Day') {
                halfDay++;
            } else if (entry.status == 'Absent') {
                absent++;
            }
        });

        const totalInTimeOfMonth = result.reduce((acc, entry) => acc + entry.totalInTime, 0);
        const totalOutTimeOfMonth = result.reduce((acc, entry) => acc + entry.totalOutTime, 0);
        const totalLogHourOfMonth = result.reduce((acc, entry) => {
            const workLogHours = parseFloat(entry.workLogHours);
            if (!isNaN(workLogHours)) {
                return acc + workLogHours;
            }
            return acc;
        }, 0);

        const totalDiffOfMonth = result.reduce((acc, entry) => {
            const TLWLDifference = parseFloat(entry.TLWLDifference);
            if (!isNaN(TLWLDifference)) {
                return acc + TLWLDifference;
            }
            return acc;
        }, 0);

        const averageTLWLDiffOfMonth = totalDiffOfMonth / result.length
        let averageLogHourOfMonth = Math.ceil(totalLogHourOfMonth / result.length);
        let averageInTime = totalInTimeOfMonth / result.length;
        const totalInTimeHHMM = formatHoursToHHMM(totalInTimeOfMonth);
        const totalOutTimeHHMM = formatHoursToHHMM(totalOutTimeOfMonth);
        averageInTime = formatHoursToHHMM(averageInTime);

        result.forEach(entry => {
            if (entry.inOut.length > 0) {
                entry.totalOutTime = formatHoursToHHMM(entry.totalOutTime);
                entry.totalInTime = formatHoursToHHMM(entry.totalInTime);
                const workLogHours = parseFloat(entry.workLogHours);
                if (!isNaN(workLogHours)) {
                    entry.workLogHours = (formatHoursToHHMM(entry.workLogHours))
                }
                const TLWLDifference = parseInt(entry.TLWLDifference)
                if (!isNaN(TLWLDifference)) {
                    entry.TLWLDifference = (formatHoursToHHMM(entry.TLWLDifference))
                }
            }
        });

        let monthData = {
            totalInTime: totalInTimeHHMM,
            totalOutTime: totalOutTimeHHMM,
            averageInTime,
            averageWorkLogHours: formatHoursToHHMM(averageLogHourOfMonth),
            averageTLWLDiff: formatHoursToHHMM(averageTLWLDiffOfMonth),
            presentDays: present,
            halfDays: halfDay,
            absentDays: absent
        };

        return res.json({ data: { dailyLog: result, monthData } });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { getEmployeeLogDetails };
