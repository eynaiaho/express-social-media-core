const express = require("express");
const router = express.Router();
const authValidate = require("../../validators/auth.validator");
const validate = require("../../middlewares/validate.middleware");
const authController = require("../../controllers/auth.controller");

router.post("/register", validate(authValidate.registerSchema), authController.register);
router.post("/login", validate(authValidate.loginSchema), authController.login);
router.post("/refresh", validate(authValidate.refreshSchema), authController.refresh);
router.post("/logout", authController.logout);

module.exports = router;