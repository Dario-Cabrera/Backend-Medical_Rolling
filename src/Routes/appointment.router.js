const express = require("express");
const router = express.Router();
const { postAppointment, postAppointmentUserLog } = require("../Controllers");

const { getAllAppointments, getAppointmentById, getAppointmentsByUserId, getAppointmentsByDoctorId } = require("../Controllers");
const { deleteAppointmentById } = require("../Controllers");
const { updateAppointmentById } = require("../Controllers");

const { validateToken } = require("../Auth/validateToken");
const { validateSchema } = require("../Auth/validator.middleware");

const { registerAppointmentSchema } = require("../Schemas/appointmentSchema");

router.post("/createappointment/", postAppointment);
router.post("/createappointment/", validateSchema(registerAppointmentSchema), postAppointmentUserLog);
router.get("/gettingappointments", getAllAppointments);
router.get("/getoneappointment/:id", getAppointmentById);
router.get("/getappointmentbyuser/:userId", getAppointmentsByUserId);
router.get("/getappointmentbydoctor/:doctorId", getAppointmentsByDoctorId);
router.delete("/deleteappointments/:id", deleteAppointmentById);
router.put("/updateappointments/:id", updateAppointmentById);
module.exports = router;
