const express = require("express");
const router = express.Router();
const { postUser, postDoctor, postAppointment } = require("../Controllers");
const { postUserLogin, postDoctorLogin } = require("../Controllers");
const {
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
  getUserById,
  getDoctorById,
  getAppointmentById,
} = require("../Controllers");
const {
  deleteUserById,
  deleteDoctorById,
  deleteAppointmentById,
} = require("../Controllers");
const {
  updateUserById,
  updateDoctorById,
  updateAppointmentById,
} = require("../Controllers");

const { validateToken } = require("../Auth");

// ----------------POST----------------

//---------POST register----------

router.post("/createuser/", postUser);
router.post("/createdoctor/", postDoctor);
router.post("/createappointment/", validateToken, postAppointment);

//---------POST login----------

router.post("/loginuser", postUserLogin);
router.post("/logindoctor", postDoctorLogin);

//---------POST loguout----------

// ----------------POST----------------

// ----------------GETALL----------------

router.get("/gettingusers", validateToken, getAllUsers);
router.get("/gettingdoctors", validateToken, getAllDoctors);
router.get("/gettingappointments", validateToken, getAllAppointments);

// ----------------GETALL----------------

// ------------GETBYID-GETONE------------

router.get("/getoneuser/:id", validateToken, getUserById);
router.get("/getonedoctor/:id", validateToken, getDoctorById);
router.get("/getoneappointment/:id", validateToken, getAppointmentById);

// ------------GETBYID-GETONE------------

// ----------------DELETE----------------

router.delete("/deleteusers/:id", validateToken, deleteUserById);
router.delete("/deletedoctors/:id", validateToken, deleteDoctorById);
router.delete("/deleteappointments/:id", validateToken, deleteAppointmentById);

// ----------------DELETE----------------

// ----------------UPDATE----------------

router.put("/updateusers/:id", validateToken, updateUserById);
router.put("/updatedoctors/:id", validateToken, updateDoctorById);
router.put("/updateappointments/:id", validateToken, updateAppointmentById);

// ----------------UPDATE----------------

module.exports = router;
