const express = require("express");
const router = express.Router();
const { postAppointment } = require("../Controllers");

const { getAllAppointments, getAppointmentById } = require("../Controllers");
const { deleteAppointmentById } = require("../Controllers");
const { updateAppointmentById } = require("../Controllers");

const { validateToken } = require("../Auth/validateToken");

router.post("/createappointment/", validateToken, postAppointment);
router.get("/gettingappointments", validateToken, getAllAppointments);
router.get("/getoneappointment/:id", validateToken, getAppointmentById);
router.delete("/deleteappointments/:id", validateToken, deleteAppointmentById);
router.put("/updateappointments/:id", validateToken, updateAppointmentById);
module.exports = router;
