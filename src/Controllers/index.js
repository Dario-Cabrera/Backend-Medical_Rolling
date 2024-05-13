const { UsersModel, DoctorsModel, AppointmentsModel } = require("../Models/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../server/config/config");
const { createAccessToken } = require("../Libs/jwt");
const cron = require("node-cron");
const moment = require("moment-timezone");
const mongoose = require("mongoose");

async function controlAppointments() {
  try {
    const now = moment().tz("America/Argentina/Buenos_Aires");

    const appointments = await AppointmentsModel.find({ state: true });

    const pastAppointments = appointments.filter((appointment) => {
      const appointmentDateTime = moment.tz(`${appointment.appointmentDate} ${appointment.appointmentTime}`, "YYYY-MM-DD HH:mm", "America/Argentina/Buenos_Aires");
      return appointmentDateTime.isBefore(now);
    });

    for (const appointment of pastAppointments) {
      appointment.state = false;
      await appointment.save();
    }
  } catch (error) {
    console.error("Error al actualizar el estado de las citas:", error);
  }
}

cron.schedule("*/15 * * * *", () => {
  controlAppointments();
});

const postUser = async (req, res) => {
  try {
    const { dni, name, lastname, email, pass, province, area, phone, address, isDoctor, isAuditor } = req.body;
    const userFound = await UsersModel.findOne({ email });
    if (userFound) return res.status(400).json(["The email is already in use"]);
    const dniExists = await UsersModel.findOne({ dni });
    if (dniExists) {
      return res.status(400).json(["The DNI is already in use"]);
    }

    const passwordHash = await bcrypt.hash(pass, 10);
    const newUser = new UsersModel({
      dni,
      name,
      lastname,
      email,
      pass: passwordHash,
      province,
      address,
      area,
      phone,
      address,
      isDoctor,
      isAuditor,
    });
    const userSaved = await newUser.save();

    res.status(200).json({
      dni: userSaved.dni,
      id: userSaved._id,
      dni: userSaved.dni,
      name: userSaved.name,
      lastname: userSaved.lastname,
      email: userSaved.email,
      pass: userSaved.pass,
      province: userSaved.province,
      area: userSaved.area,
      phone: userSaved.phone,
      address: userSaved.address,
      isDoctor: userSaved.isDoctor,
      isAuditor: userSaved.isAuditor,
    });
  } catch (error) {
    res.status(500).send({
      message: "User not created",
    });
  }
};

const postDoctor = async (req, res) => {
  try {
    const { dni, name, lastname, email, pass, specialty, licenceNumber, isDoctor, isAuditor } = req.body;
    const doctorFound = await DoctorsModel.findOne({ email });
    if (doctorFound) return res.status(400).json(["The email is already in use"]);

    const passwordHash = await bcrypt.hash(pass, 10);

    const newDoctor = new DoctorsModel({
      dni,
      name,
      lastname,
      email,
      pass: passwordHash,
      specialty,
      licenceNumber,
      isDoctor,
      isAuditor,
    });
    const doctorSaved = await newDoctor.save();

    res.status(200).json({
      dni: doctorSaved.dni,
      id: doctorSaved._id,
      dni: doctorSaved.dni,
      name: doctorSaved.name,
      lastname: doctorSaved.lastname,
      email: doctorSaved.email,
      pass: doctorSaved.pass,
      specialty: doctorSaved.specialty,
      licenceNumber: doctorSaved.licenceNumber,
      isDoctor: doctorSaved.isDoctor,
      isAuditor: doctorSaved.isAuditor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Doctor not created",
    });
  }
};

const postAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, user, doctor } = req.body;

    const newAppointment = new AppointmentsModel({
      appointmentDate,
      appointmentTime,
      user,
      doctor,
    });

    const appointmentSaved = await newAppointment.save();

    res.status(200).json({ appointmentSaved });
  } catch (error) {
    res.status(500).json({ message: "Appointment not created" });
  }
};

const postAppointmentUserLog = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    const { id: userId } = req.user;
    const doctorid = req.headers.doctorid;

    const newAppointment = new AppointmentsModel({
      appointmentDate,
      appointmentTime,
      user: userId,
      doctor: doctorid,
    });

    const appointmentSaved = await newAppointment.save();

    res.status(200).json({ appointmentSaved });
  } catch (error) {
    res.status(500).json({ message: "Appointment not created" });
  }
};

const postUserLogin = async (req, res) => {
  const { email, pass } = req.body;

  const userFound = await UsersModel.findOne({ email });
  const doctorFound = await DoctorsModel.findOne({ email });
  try {
    if (userFound) {
      const isUserMatch = await bcrypt.compareSync(pass, userFound.pass);
      if (isUserMatch) {
        const token = await createAccessToken({
          dni: userFound.dni,
          id: userFound._id,
          isDoctor: userFound.isDoctor,
          isAuditor: userFound.isAuditor,
          name: userFound.name,
          lastname: userFound.lastname,
          email: userFound.email,
          address: userFound.address,
          province: userFound.province,
          area: userFound.area,
          phone: userFound.phone,
        });
        res.status(200).json(token);
      } else {
        return res.status(400).json({ message: "Incorrect user password" });
      }
    } else if (doctorFound) {
      const isDoctorMatch = await bcrypt.compareSync(pass, doctorFound.pass);
      if (isDoctorMatch) {
        const token = await createAccessToken({
          dni: doctorFound.dni,
          id: doctorFound._id,
          name: doctorFound.name,
          lastname: doctorFound.lastname,
          email: doctorFound.email,
          specialty: doctorFound.specialty,
          licenceNumber: doctorFound.licenceNumber,
          isDoctor: doctorFound.isDoctor,
          isAuditor: doctorFound.isAuditor,
          appointments: doctorFound.appointments,
        });
        res.status(200).json(token);
      } else {
        return res.status(400).json({ message: "Incorrect doctor password" });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyToken = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const { id, isDoctor } = decoded.payload;

    if (isDoctor) {
      const doctorFound = await DoctorsModel.findById(id);
      if (!doctorFound) {
        return res.status(401).json({ message: "Unauthorized: Doctor not found" });
      }

      return res.json({
        dni: doctorFound.dni,
        id: doctorFound._id,
        name: doctorFound.name,
        lastname: doctorFound.lastname,
        email: doctorFound.email,
        specialty: doctorFound.specialty,
        licenceNumber: doctorFound.licenceNumber,
        isDoctor: doctorFound.isDoctor,
        isAuditor: doctorFound.isAuditor,
        appointments: doctorFound.appointments,
      });
    } else {
      const userFound = await UsersModel.findById(id);
      if (!userFound) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }

      return res.json({
        dni: userFound.dni,
        id: userFound._id,
        name: userFound.name,
        lastname: userFound.lastname,
        email: userFound.email,
        address: userFound.address,
        province: userFound.province,
        area: userFound.area,
        phone: userFound.phone,
        isDoctor: userFound.isDoctor,
        isAuditor: userFound.isAuditor,
        appointments: userFound.appointments,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const postDoctorLogin = async (req, res) => {
  const { email, pass } = req.body;
  const doctorFound = await DoctorsModel.findOne({ email });
  try {
    if (!doctorFound) return res.status(400).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compareSync(pass, doctorFound.pass);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    res.status(200).json({
      id: doctorFound._id,
      name: doctorFound.name,
      lastname: doctorFound.lastname,
      email: doctorFound.email,
      specialty: doctorFound.specialty,
      licenceNumber: doctorFound.licenceNumber,
      isDoctor: doctorFound.isDoctor,
      isAuditor: doctorFound.isAuditor,
      appointments: doctorFound.appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyDoctor = async (req, res) => {
  try {
    const doctorId = req.body.dataDoctor.id;
    const doctorFound = await DoctorsModel.findById(doctorId);
    if (!doctorFound) return res.status(401).json({ message: "Unauthorized" });
    return res.json({
      id: doctorFound._id,
      name: doctorFound.name,
      lastname: doctorFound.lastname,
      email: doctorFound.email,
      specialty: doctorFound.specialty,
    });
  } catch (error) {}
};

const getAllUsers = async (_req, res) => {
  try {
    const findUsers = await UsersModel.find({});
    res.status(200).json(findUsers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
    });
  }
};

const getAllDoctors = async (_req, res) => {
  try {
    const findDoctors = await DoctorsModel.find();
    res.status(200).json(findDoctors);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching doctors",
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const findAppointments = await AppointmentsModel.find();
    res.status(200).json(findAppointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await UsersModel.findById(id);
    res.status(200).json(findUser);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
    });
  }
};

const getUserByDNI = async (req, res) => {
  try {
    const { dni } = req.params;
    const findUser = await UsersModel.findOne({ dni });
    res.status(200).json(findUser);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const findDoctor = await DoctorsModel.findById(id);
    res.status(200).json(findDoctor);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching doctor",
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const findAppointment = await AppointmentsModel.findById(id);
    res.status(200).json(findAppointment);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointment",
    });
  }
};

const getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await AppointmentsModel.find({ user: userId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments by user",
    });
  }
};

const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await AppointmentsModel.find({ doctor: doctorId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments by user",
    });
  }
};

const getDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.params;
    const doctors = await DoctorsModel.find({ specialty });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching doctors by specialty",
    });
  }
};

const checkDniUserAvailability = async (req, res) => {
  try {
    const { dni } = req.params;
    const user = await UsersModel.findOne({ dni });
    if (user) {
      return res.status(400).json({ message: "The DNI is already in use" });
    }
    res.status(200).json({ message: "The DNI is available" });
  } catch (error) {
    res.status(500).json({ message: "Error checking DNI availability" });
  }
};

const checkEmailUserAvailability = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UsersModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "The email is already in use" });
    }
    res.status(200).json({ message: "The email is available" });
  } catch (error) {
    res.status(500).json({ message: "Error checking email availability" });
  }
};

const checkDniDoctorAvailability = async (req, res) => {
  try {
    const { dni } = req.params;
    const doctor = await DoctorsModel.findOne({ dni });
    if (doctor) {
      return res.status(400).json({ message: "The DNI is already in use" });
    }
    res.status(200).json({ message: "The DNI is available" });
  } catch (error) {
    res.status(500).json({ message: "Error checking DNI availability" });
  }
};

const checkEmailDoctorAvailability = async (req, res) => {
  try {
    const { email } = req.params;
    const doctor = await DoctorsModel.findOne({ email });
    if (doctor) {
      return res.status(400).json({ message: "The email is already in use" });
    }
    res.status(200).json({ message: "The email is available" });
  } catch (error) {
    res.status(500).json({ message: "Error checking email availability" });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UsersModel.findByIdAndDelete(id);
    deletedUser ? res.status(200).json({ message: "User deleted successfully", deletedUser }) : res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

const deleteDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoctor = await DoctorsModel.findByIdAndDelete(id);
    deletedDoctor ? res.status(200).json({ message: "Doctor deleted successfully", deletedDoctor }) : res.status(404).json({ message: "Doctor not found" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting doctor" });
  }
};

const deleteAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await AppointmentsModel.findByIdAndDelete(id);
    deletedAppointment
      ? res.status(200).json({
          message: "Appointment deleted successfully",
          deletedAppointment,
        })
      : res.status(404).json({ message: "Appointment not found" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment" });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { dni, name, lastname, email, province, area, phone, pass, address, isDoctor, isAuditor } = req.body;
    const updatedUser = await UsersModel.findByIdAndUpdate(
      id,
      {
        dni,
        name,
        lastname,
        email,
        province,
        area,
        phone,
        pass,
        address,
        isDoctor,
        isAuditor,
      },
      { new: true }
    );
    updatedUser ? res.status(200).json({ message: "User updated successfully", updatedUser }) : res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

const updateDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const { dni, name, lastname, email, pass, specialty, licenceNumber, isDoctor, isAuditor } = req.body;

    const updatedDoctor = await DoctorsModel.findByIdAndUpdate(
      id,
      {
        dni,
        name,
        lastname,
        email,
        pass,
        specialty,
        licenceNumber,
        isDoctor,
        isAuditor,
      },
      { new: true }
    );
    updatedDoctor ? res.status(200).json({ message: "Doctor updated successfully", updatedDoctor }) : res.status(404).json({ message: "Doctor not found" });
  } catch (error) {
    res.status(500).json({ message: "Error updating doctor" });
  }
};

const updateAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { appointmentDate, appointmentTime, user, doctor, state } = req.body;

    const existingAppointment = await AppointmentsModel.findById(id);
    if (!existingAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    existingAppointment.appointmentDate = appointmentDate;
    existingAppointment.appointmentTime = appointmentTime;
    existingAppointment.user = user;
    existingAppointment.doctor = doctor;
    existingAppointment.state = state;

    const updatedAppointment = await existingAppointment.save();

    res.status(200).json({
      updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error.message);
    res.status(500).json({ message: "Error updating appointment" });
  }
};

const getAppointmentsByDoctorAndDate = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    const existingAppointments = await AppointmentsModel.find({ doctor: doctorId, appointmentDate: date, state: true });

    const allTimes = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        allTimes.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
      }
    }

    const availableTimes = allTimes.filter((time) => {
      const timeString = time.split(":").join("");
      return !existingAppointments.some((appointment) => {
        const appointmentTimeString = appointment.appointmentTime.split(":").join("");
        return appointmentTimeString === timeString;
      });
    });

    res.status(200).json({ availableTimes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los horarios disponibles" });
  }
};

module.exports = {
  postUser,
  postDoctor,
  postAppointment,
  verifyToken,
  verifyDoctor,
  postUserLogin,
  postDoctorLogin,
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
  getUserById,
  getDoctorById,
  getAppointmentById,
  deleteUserById,
  deleteDoctorById,
  deleteAppointmentById,
  updateUserById,
  updateDoctorById,
  updateAppointmentById,
  postAppointmentUserLog,
  getAppointmentsByDoctorAndDate,
  getAppointmentsByUserId,
  getAppointmentsByDoctorId,
  checkDniUserAvailability,
  checkEmailUserAvailability,
  checkDniDoctorAvailability,
  checkEmailDoctorAvailability,
  getDoctorsBySpecialty,
  getUserByDNI,
};
