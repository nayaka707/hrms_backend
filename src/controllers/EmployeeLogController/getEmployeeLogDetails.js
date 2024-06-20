
const { statusCode, constants, EmployeeLogDetails, logger, successResponseFunc, errorResponseFunc } = require('./employeeLogPackageCentral');
const moment = require('moment');
const { Op } = require("sequelize");

const formatHoursToHHMM = (hours) => {
    const duration = moment.duration(hours, 'hours');
    const formattedTime = `${Math.floor(duration.asHours())}:${duration.minutes().toString().padStart(2, '0')}`;
    return formattedTime;
};

const formatTimeTo12Hour = (time) => {
    return  time == null ? "" : moment(time, 'HH:mm:ss').format('h:mm a');
};

const getEmployeeLogDetails = async (req, res) => {
    const { employee_code, month, year } = req.query;

    if (!employee_code) {
        return res.status(400).json({ error: 'employee_code is required' });
    }

    const whereClause = { employee_code };

    if (month && year) {
        const startDate = moment(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        whereClause.log_date = {
            [Op.between]: [startDate, endDate]
        };
    } else if (year) {
        const startDate = moment(`${year}-01-01`).startOf('year').format('YYYY-MM-DD');
        const endDate = moment(startDate).endOf('year').format('YYYY-MM-DD');
        whereClause.log_date = {
            [Op.between]: [startDate, endDate]
        };
    } else if (month) {
        const currentYear = moment().year();
        const startDate = moment(`${currentYear}-${month}-01`).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        whereClause.log_date = {
            [Op.between]: [startDate, endDate]
        };
    } else {
        const currentMonth = moment().format('MM');
        const currentYear = moment().year();
        const startDate = moment(`${currentYear}-${currentMonth}-01`).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        whereClause.log_date = {
            [Op.between]: [startDate, endDate]
        };
    }

    try {
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

        const result = Object.entries(groupedLogs).map(([log_date, { first_in, last_out, inOut, totalInTime, totalOutTime }]) => {
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
                    const nextEntry = sortedInOut[i + 1];
                    if (nextEntry && nextEntry.direction === 'out') {
                        const inTime = currentEntry.time;
                        const outTime = nextEntry.time;
                        inOutPairs.push({ in: inTime, out: outTime });

                        const inMoment = moment(inTime, 'HH:mm:ss');
                        const outMoment = moment(outTime, 'HH:mm:ss');

                        if (inMoment.isValid() && outMoment.isValid()) {
                            const duration = moment.duration(outMoment.diff(inMoment)).asHours();
                            if (duration > 0) {
                                dailyTotalInTime += duration;
                            } else {
                                totalOutTime += duration;
                            }
                        }

                        i++;
                    }
                }
            }

            const dailyTotalOutTime = totalOutTime - dailyTotalInTime;

            return {
                date: log_date,
                first_in: formatTimeTo12Hour(first_in),
                last_out: formatTimeTo12Hour(last_out),
                inOut: inOutPairs.map(entry => ({
                    ...entry,
                    in: formatTimeTo12Hour(entry.in),
                    out: formatTimeTo12Hour(entry.out),
                })),
                totalInTime: dailyTotalInTime,
                totalOutTime: dailyTotalOutTime
            };
        });

        result.forEach(entry => {
            if (entry.inOut.length > 0) {
                let firstIn = entry.inOut[0].in;
                let lastOut = entry.inOut[entry.inOut.length - 1].out;
                const firstInMoment = moment(firstIn, 'h:mm a');
                const lastOutMoment = moment(lastOut, 'h:mm a');
                const duration = moment.duration(lastOutMoment.diff(firstInMoment));
                entry.first_in = firstIn;
                entry.last_out = lastOut;
                entry.totalOutTime = duration.asHours() - entry.totalInTime;
            }
        });

        const totalInTimeOfMonth = result.reduce((acc, entry) => acc + entry.totalInTime, 0);
        const totalOutTimeOfMonth = result.reduce((acc, entry) => acc + entry.totalOutTime, 0);
        let averageInTime = totalInTimeOfMonth / result.length;
        const totalInTimeHHMM = formatHoursToHHMM(totalInTimeOfMonth);
        const totalOutTimeHHMM = formatHoursToHHMM(totalOutTimeOfMonth);
        averageInTime = formatHoursToHHMM(averageInTime);

        let monthData = {
            totalInTime: totalInTimeHHMM,
            totalOutTime: totalOutTimeHHMM,
            averageInTime
        };

        result.forEach(entry => {
            if (entry.inOut.length > 0) {
                entry.totalOutTime = formatHoursToHHMM(entry.totalOutTime);
                entry.totalInTime = formatHoursToHHMM(entry.totalInTime);
            }
        });
        return res.json({ data: { dailyLog: result, monthData } });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { getEmployeeLogDetails };
