const express = require("express");

const {
  AdminController,
} = require("../controllers/index");
const { verifyToken, checkRole } = require("../middlewares/auth");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"),
      res.header("Access-Control-Expose-Headers", "Content-Disposition");
    next();
  });

  app.post("/addSuperAdmin", AdminController.addAdmin);
};
