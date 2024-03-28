const { UsersModel, DoctorsModel, AppointmentsModel } = require("../Models/");
const bcrypt = require("bcrypt");

// ----------------POST----------------

//-------POST REGISTER-----------------

const postUser = async (req, res) => {
  try {
    const {
      name,
      lastname,
      email,
      province,
      area,
      phone,
      pass,
      isDoctor,
      isAuditor,
      appointments,
    } = req.body;

    const passwordHash = await bcrypt.hash(pass, 10);

    const newUser = new UsersModel({
      name,
      lastname,
      email,
      province,
      area,
      phone,
      pass: passwordHash,
      isDoctor,
      isAuditor,
      appointments,
    });
    const userSaved = await newUser.save();

    res.status(200).json({
      id: userSaved._id,
      name: userSaved.name,
      lastname: userSaved.lastname,
      email: userSaved.email,
      province: userSaved.province,
      area: userSaved.area,
      phone: userSaved.phone,
      isDoctor: userSaved.isDoctor,
      isAuditor: userSaved.isAuditor,
      appointments: userSaved.appointments,
     
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "User not created",
    });
  }
};

const postDoctor = async (req, res) => {
  try {
    const {
      name,
      lastname,
      email,
      pass,
      specialty,
      LicenceNumber,
      isDoctor,
      isAuditor,
      appointments,
    } = req.body;

    const passwordHash = await bcrypt.hash(pass, 10);

    const newDoctor = new DoctorsModel({
        name,
        lastname,
        email,
        pass: passwordHash,
        specialty,
        LicenceNumber,
        isDoctor,
        isAuditor,
        appointments,
      });
      const doctorSaved = await newDoctor.save();

      res.status(200).json({
        id: doctorSaved._id,
        name: doctorSaved.name,
        lastname: doctorSaved.lastname,
        email: doctorSaved.email,
        province: doctorSaved.province,
        area: doctorSaved.area,
        phone: doctorSaved.phone,
        isDoctor: doctorSaved.isDoctor,
        isAuditor: doctorSaved.isAuditor,
        appointments: doctorSaved.appointments,
        
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Doctor not created",
    });
  }
};

const postAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    const newAppointment = new AppointmentsModel({
      appointmentDate,
      appointmentTime,
    });
    const appointmentSaved = await newAppointment.save();
    res.status(200).json({
        appointmentDate: appointmentSaved.appointmentDate,
        appointmentTime: appointmentSaved.appointmentTime,
        
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Appointment not created",
    });
  }
};

// ----------------POST----------------

// ----------------GETALL----------------

const getAllUsers = async (_req, res) => {
  try {
    const findUsers = await UsersModel.find();
    res.status(200).json(findUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching users",
    });
  }
};

const getAllDoctors = async (_req, res) => {
  try {
    const findDoctors = await DoctorsModel.find();
    res.status(200).json(findDoctors);
    console.log(findDoctors);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching doctors",
    });
  }
};

const getAllAppointments = async (_req, res) => {
  try {
    const findAppointments = await AppointmentsModel.find();
    res.status(200).json(findAppointments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching appointments",
    });
  }
};

// ----------------GETALL----------------

// ------------GETBYID-GETONE------------

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await UsersModel.findById(id);
    res.status(200).json(findUser);
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    res.status(500).json({
      message: "Error fetching appointment",
    });
  }
};

// ------------GETBYID-GETONE------------

// ----------------DELETE----------------

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UsersModel.findByIdAndDelete(id);
    deletedUser
      ? res
          .status(200)
          .json({ message: "User deleted successfully", deletedUser })
      : res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

const deleteDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoctor = await DoctorsModel.findByIdAndDelete(id);
    deletedDoctor
      ? res
          .status(200)
          .json({ message: "Doctor deleted successfully", deletedDoctor })
      : res.status(404).json({ message: "Doctor not found" });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.status(500).json({ message: "Error deleting appointment" });
  }
};

// ----------------DELETE----------------

// ----------------UPDATE----------------

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      lastname,
      email,
      province,
      area,
      phone,
      pass,
      isDoctor,
      isAuditor,
      appointments,
    } = req.body;
    const updatedUser = await UsersModel.findByIdAndUpdate(
      id,
      {
        name,
        lastname,
        email,
        province,
        area,
        phone,
        pass,
        isDoctor,
        isAuditor,
        appointments,
      },
      { new: true }
    );
    updatedUser
      ? res
          .status(200)
          .json({ message: "User updated successfully", updatedUser })
      : res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

const updateDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      lastname,
      email,
      pass,
      specialty,
      LicenceNumber,
      isDoctor,
      isAuditor,
      appointments,
    } = req.body;
    const updatedDoctor = await DoctorsModel.findByIdAndUpdate(
      id,
      {
        name,
        lastname,
        email,
        pass,
        specialty,
        LicenceNumber,
        isDoctor,
        isAuditor,
        appointments,
      },
      { new: true }
    );
    updatedDoctor
      ? res
          .status(200)
          .json({ message: "Doctor updated successfully", updatedDoctor })
      : res.status(404).json({ message: "Doctor not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating doctor" });
  }
};

const updateAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime } = req.body;
    const updatedAppointment = await AppointmentsModel.findByIdAndUpdate(
      id,
      {
        appointmentDate,
        appointmentTime,
      },
      { new: true }
    );
    updatedAppointment
      ? res.status(200).json({
          message: "Appointment updated successfully",
          updatedAppointment,
        })
      : res.status(404).json({ message: "Appointment not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating appointment" });
  }
};

// ----------------UPDATE----------------

module.exports = {
  postUser,
  postDoctor,
  postAppointment,
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
};
