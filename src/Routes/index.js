const express = require("express");
const router = express.Router();
const { postUser, postDoctor, postAppointment } = require("../Controllers");
const { postUserLogin, postDoctorLogin } = require("../Controllers");
const { getAllUsers, getAllDoctors, getAllAppointments, getUserById, getDoctorById, getAppointmentById } = require("../Controllers");
const { deleteUserById, deleteDoctorById, deleteAppointmentById } = require("../Controllers");
const { updateUserById, updateDoctorById, updateAppointmentById } = require("../Controllers");

const { validateToken } = require("../Auth/validateToken");
const { validateSchema } = require("../Auth/validator.middleware");
const { registerUserSchema, loginUserSchema } = require("../Schemas/userSchema");
const { registerDoctorSchema, loginDoctorSchema } = require("../Schemas/doctorSchema");
const { registerAppointmentSchema } = require("../Schemas/appointmentSchema");

router.post("/createuser/", validateSchema(registerUserSchema), postUser);
router.post("/createdoctor/", validateSchema(registerDoctorSchema), postDoctor);
router.post("/createappointment/", validateSchema(registerAppointmentSchema), validateToken, postAppointment);

router.post("/loginuser", validateSchema(loginUserSchema), postUserLogin);
router.post("/logindoctor", validateSchema(loginDoctorSchema), postDoctorLogin);

router.get("/gettingusers", validateToken, getAllUsers);
router.get("/gettingdoctors", validateToken, getAllDoctors);
router.get("/gettingappointments", validateToken, getAllAppointments);

router.get("/getoneuser/:id", validateToken, getUserById);
router.get("/getonedoctor/:id", validateToken, getDoctorById);
router.get("/getoneappointment/:id", validateToken, getAppointmentById);

router.delete("/deleteusers/:id", validateToken, deleteUserById);
router.delete("/deletedoctors/:id", validateToken, deleteDoctorById);
router.delete("/deleteappointments/:id", validateToken, deleteAppointmentById);

router.put("/updateusers/:id", validateToken, updateUserById);
router.put("/updatedoctors/:id", validateToken, updateDoctorById);
router.put("/updateappointments/:id", validateToken, updateAppointmentById);

module.exports = router;
