const express = require("express");
const router = express.Router();
const { postAppointment } = require("../Controllers");

const { getAllAppointments, getAppointmentById } = require("../Controllers");
const { deleteAppointmentById } = require("../Controllers");
const { updateAppointmentById } = require("../Controllers");

const { validateToken } = require("../Auth/validateToken");
const { validateSchema } = require("../Auth/validator.middleware");

const { registerAppointmentSchema } = require("../schemas/appointment.schema");

router.post(
  "/createappointment/",
  validateSchema(registerAppointmentSchema),
  validateToken,
  postAppointment
);
router.get("/gettingappointments", getAllAppointments);
router.get("/getoneappointment/:id", getAppointmentById);
router.delete("/deleteappointments/:id", deleteAppointmentById);
router.put("/updateappointments/:id", updateAppointmentById);
module.exports = router;
