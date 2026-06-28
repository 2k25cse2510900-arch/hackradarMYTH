const express = require("express");

const alertController = require("../controllers/alert.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createAlertValidator,
  updateAlertValidator,
  alertIdValidator,
} = require("../validators/alert.validator");

const router = express.Router();

router.use(authenticate);
router.get("/", alertController.listAlerts);
router.post("/", createAlertValidator, validate, alertController.createAlert);
router.put("/:id", alertIdValidator, updateAlertValidator, validate, alertController.updateAlert);
router.delete("/:id", alertIdValidator, validate, alertController.deleteAlert);

module.exports = router;
