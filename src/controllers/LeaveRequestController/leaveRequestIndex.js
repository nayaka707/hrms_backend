const { addLeaveRequest } = require("./addLeaveRequest");
const { updateLeaveRequest, updateLeaveRequestStatus } = require("./updateLeaveRequest");
const { deleteLeaveRequest } = require("./deleteLeaveRequest");

module.exports = {
  addLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  updateLeaveRequestStatus
};
