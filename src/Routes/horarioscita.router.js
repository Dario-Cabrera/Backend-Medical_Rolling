const express = require("express");
const router = express.Router();
const appointmentsController = require("../Controllers/index.js");

router.get("/availableTimes", appointmentsController.getAppointmentsByDoctorAndDate);

module.exports = router;
