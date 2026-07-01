const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const alertController = require("../controllers/alert.controller");

router.get(
  "/",
  authenticate,
  alertController.listAlerts
);

router.post(
  "/",
  authenticate,
  alertController.createAlert
);

router.put(
  "/:id",
  authenticate,
  alertController.updateAlert
);

router.delete(
  "/:id",
  authenticate,
  alertController.deleteAlert
);

module.exports = router;