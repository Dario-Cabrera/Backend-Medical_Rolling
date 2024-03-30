const cron = require("node-cron");
const moment = require("moment-timezone");
const { UsersModel, DoctorsModel, AppointmentsModel } = require("../Models/");

// ----------------POST----------------

const postUser = async (req, res) => {
  try {
    const { name, lastname, email, province, area, phone, pass, isDoctor, isAuditor, appointments } = req.body;
    const newUser = new UsersModel({
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
    });
    await newUser.save();
    res.status(200).json({
      message: "User created",
      newUser,
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
    const { name, lastname, email, pass, specialty, LicenceNumber, isDoctor, isAuditor, appointments } = req.body;
    const newDoctor = new DoctorsModel({
      name,
      lastname,
      email,
      pass,
      specialty,
      LicenceNumber,
      isDoctor,
      isAuditor,
      appointments,
    });
    await newDoctor.save();
    res.status(200).json({
      message: "Doctor created",
      newDoctor,
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
    await newAppointment.save();
    res.status(200).json({
      message: "Appointment created",
      newAppointment,
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
    deletedUser ? res.status(200).json({ message: "User deleted successfully", deletedUser }) : res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

const deleteDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoctor = await DoctorsModel.findByIdAndDelete(id);
    deletedDoctor ? res.status(200).json({ message: "Doctor deleted successfully", deletedDoctor }) : res.status(404).json({ message: "Doctor not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting doctor" });
  }
};

const deleteAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await AppointmentsModel.findByIdAndDelete(id);
    deletedAppointment ? res.status(200).json({ message: "Appointment deleted successfully", deletedAppointment }) : res.status(404).json({ message: "Appointment not found" });
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
    const { name, lastname, email, province, area, phone, pass, isDoctor, isAuditor, appointments } = req.body;
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
    updatedUser ? res.status(200).json({ message: "User updated successfully", updatedUser }) : res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

const updateDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastname, email, pass, specialty, LicenceNumber, isDoctor, isAuditor, appointments } = req.body;
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
    updatedDoctor ? res.status(200).json({ message: "Doctor updated successfully", updatedDoctor }) : res.status(404).json({ message: "Doctor not found" });
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
    updatedAppointment ? res.status(200).json({ message: "Appointment updated successfully", updatedAppointment }) : res.status(404).json({ message: "Appointment not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating appointment" });
  }
};

// ----------------UPDATE----------------

// ----------------DELETEAPPOINTMENTUSERPAST----------------

const deletePastAppointmentsUsers = async () => {
  try {
    // Obtener la hora actual en la zona horaria local y convertirla a la zona horaria de Argentina
    const currentDateTime = moment().tz("America/Argentina/Buenos_Aires");
    console.log("Hora actual en Argentina:", currentDateTime.format());

    // Buscar todos los doctores en la base de datos
    const userCitas = await UsersModel.find();

    // Iterar sobre cada doctor
    for (const userCita of userCitas) {
      // Filtrar las citas pasadas del doctor
      const updatedAppointments = userCita.appointments.filter((appointment) => {
        // Convertir la fecha y hora de la cita a un objeto Moment en UTC
        const appointmentDateTimeUTC = moment.utc(appointment.dateTime);
        // Ajustar la zona horaria a la de Argentina y restar 3 horas para corregir el desplazamiento
        const appointmentDateTimeArgentina = appointmentDateTimeUTC.tz("America/Argentina/Buenos_Aires").add(3, "hours");
        console.log("Fecha y hora de la cita:", appointmentDateTimeArgentina.format());

        // Comparar si la cita es posterior a la hora actual en la zona horaria de Argentina
        return appointmentDateTimeArgentina.isAfter(currentDateTime);
      });
      // Actualizar el array de citas del doctor con las citas filtradas
      userCita.appointments = updatedAppointments;

      // Guardar los cambios en la base de datos
      await userCita.save();
    }

    console.log("Citas pasadas eliminadas con éxito.");
  } catch (error) {
    console.error("Error al eliminar citas pasadas:", error);
  }
};

// Programar la ejecución de la función cada 10 segundos
cron.schedule("*/30 * * * * ", deletePastAppointmentsUsers);

// ----------------DELETEAPPOINTMENTUSERPAST----------------

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
  deletePastAppointmentsUsers,
};
