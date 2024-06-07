
const { AdminController, UserController } = require("../controllers/index")

const { verifyToken, checkRole } = require("../middlewares/auth");
const { checkToken } = require("../middlewares/resetPWAuth");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"),
      res.header("Access-Control-Expose-Headers", "Content-Disposition");
    next();
  });

  app.post("/addSuperAdmin", AdminController.addAdmin);
  app.post('/userLogin', UserController.userLogin)
  app.post('/forgot-password', [checkToken], UserController.passwordReset)
};
