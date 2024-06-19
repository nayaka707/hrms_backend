const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { AssetsController } = require("../controllers/index");
// Role Routes
router.post("/addAssets", [verifyToken], AssetsController.addAssets);
router.delete("/deleteAssets", [verifyToken], AssetsController.deleteAssets);

module.exports = router;
