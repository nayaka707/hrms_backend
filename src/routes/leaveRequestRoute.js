const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { LeaveRequestController } = require("../controllers/index");

router.post("/create", [verifyToken], LeaveRequestController.addLeaveRequest);
router.put("/update/:leaveRequestId", [verifyToken], LeaveRequestController.updateLeaveRequest);
router.delete("/delete/:leaveRequestId", [verifyToken], LeaveRequestController.deleteLeaveRequest);
// router.get("/getAll", [verifyToken], LeaveMasterController.getAllLeaveMaster);

module.exports = router;
