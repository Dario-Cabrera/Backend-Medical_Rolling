const { UsersModel, DoctorsModel, AppointmentsModel } = require("../Models/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../server/config/config");
const { createAccessToken } = require("../Libs/jwt");

// ----------------POST----------------

//-------POST REGISTER-----------------

const postUser = async (req, res) => {
  try {
    //Deconstruye props de la consulta
    const { dni, name, lastname, email, pass, province, area, phone, address, isDoctor, isAuditor } = req.body;
    //Logica relacionada con la creacion de usuarios desde el Frontend
    const userFound = await UsersModel.findOne({ email });
    if (userFound) return res.status(400).json(["The email is already in use"]);
    const dniExists = await UsersModel.findOne({ dni });
    if (dniExists) {
      return res.status(400).json(["The DNI is already in use"]);
    }

    // Hashea el passward
    const passwordHash = await bcrypt.hash(pass, 10);
    //Modelo de props a guardar en el usuario
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
    //Guarda el usuario en la DB
    const userSaved = await newUser.save();
    //Genera el token de enviando las props a la funcion createAccessToken

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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    res.status(500).json({ message: "Appointment not created" });
  }
};

const postAppointmentUserLog = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    const { id: userId } = req.user; // Acceso al ID de usuario
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
    console.log(error);
    res.status(500).json({ message: "Appointment not created" });
  }
};

//-------------POST LOGIN--------------
const postUserLogin = async (req, res) => {
  //Destructura email y pass
  const { email, pass } = req.body;

  const userFound = await UsersModel.findOne({ email });
  const doctorFound = await DoctorsModel.findOne({ email });
  try {
    if (userFound) {
      // Validar la contraseña del usuario
      const isUserMatch = await bcrypt.compareSync(pass, userFound.pass);
      if (isUserMatch) {
        // Usuario autenticado correctamente, generar token
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
        //Muestra el token
        res.status(200).json(token);
      } else {
        // Contraseña incorrecta para el usuario
        return res.status(400).json({ message: "Incorrect user password" });
      }
    } else if (doctorFound) {
      // Validar la contraseña del doctor
      const isDoctorMatch = await bcrypt.compareSync(pass, doctorFound.pass);
      if (isDoctorMatch) {
        // Doctor autenticado correctamente, generar token
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
        //Muestra el token
        res.status(200).json(token);
      } else {
        // Contraseña incorrecta para el doctor
        return res.status(400).json({ message: "Incorrect doctor password" });
      }
    } else {
      // Usuario y doctor no encontrados
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

      // Return doctor information
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

      // Return user information
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
    console.log(req);
    const doctorId = req.body.dataDoctor.id;
    /*     console.log(req.body.dataDoctor);
     */ const doctorFound = await DoctorsModel.findById(doctorId);
    if (!doctorFound) return res.status(401).json({ message: "Unauthorized" });
    return res.json({
      id: doctorFound._id,
      name: doctorFound.name,
      lastname: doctorFound.lastname,
      email: doctorFound.email,
      specialty: doctorFound.specialty,
    });
  } catch (error) {
    console.log(error);
  }
};

// ----------------POST----------------

// ----------------GETALL----------------

const getAllUsers = async (_req, res) => {
  try {
    const findUsers = await UsersModel.find({});
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
    /*     console.log(findDoctors);
     */
  } catch (error) {
    console.log(error);
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

const getUserByDNI = async (req, res) => {
  try {
    const { dni } = req.params;
    const findUser = await UsersModel.findOne({ dni }); // Utiliza findOne() en lugar de find() y pasa el filtro como un objeto
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

const getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Obtenemos el ID del usuario de los parámetros de la solicitud
    const appointments = await AppointmentsModel.find({ user: userId }); // Buscamos citas con el ID de usuario especificado
    res.status(200).json(appointments); // Enviamos las citas encontradas como respuesta
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching appointments by user",
    });
  }
};

const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params; // Obtenemos el ID del usuario de los parámetros de la solicitud
    const appointments = await AppointmentsModel.find({ doctor: doctorId }); // Buscamos citas con el ID de usuario especificado
    res.status(200).json(appointments); // Enviamos las citas encontradas como respuesta
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    res.status(500).json({ message: "Error checking email availability" });
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
    console.log(error);
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
    console.log(error);
    res.status(500).json({ message: "Error updating doctor" });
  }
};

const updateAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Body de la solicitud:", req.body);

    const { appointmentDate, appointmentTime, user, doctor, state } = req.body;

    // Verificar si el turno existe
    const existingAppointment = await AppointmentsModel.findById(id);
    if (!existingAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Actualizar los campos de la cita existente
    existingAppointment.appointmentDate = appointmentDate;
    existingAppointment.appointmentTime = appointmentTime;
    existingAppointment.user = user;
    existingAppointment.doctor = doctor;
    existingAppointment.state = state;

    // Guardar los cambios en la base de datos
    const updatedAppointment = await existingAppointment.save();

    res.status(200).json({
      updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error.message);
    res.status(500).json({ message: "Error updating appointment" });
  }
};

// ----------------UPDATE----------------

// ----------------HORARIOS DISPONIBLES CITA----------------

const getAppointmentsByDoctorAndDate = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    // Consultar la base de datos para obtener las citas existentes para el doctor y la fecha especificada
    const existingAppointments = await AppointmentsModel.find({ doctor: doctorId, appointmentDate: date, state: true });

    // Aquí debes agregar la lógica para filtrar los horarios disponibles
    // Puedes usar la información de las citas existentes para calcular los horarios disponibles

    // Por ejemplo, si asumimos que hay intervalos de 30 minutos entre citas, podrías hacer algo como esto:

    // Crear un array con todas las horas disponibles en el día
    const allTimes = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        allTimes.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
      }
    }

    // Filtrar los horarios disponibles eliminando las horas ocupadas por las citas existentes
    const availableTimes = allTimes.filter((time) => {
      const timeString = time.split(":").join(""); // Convertir el formato de la hora a un string sin ":" para comparar
      return !existingAppointments.some((appointment) => {
        const appointmentTimeString = appointment.appointmentTime.split(":").join(""); // Convertir el formato de la hora de la cita
        return appointmentTimeString === timeString;
      });
    });

    // Enviar los horarios disponibles en la respuesta
    res.status(200).json({ availableTimes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los horarios disponibles" });
  }
};

// ----------------HORARIOS DISPONIBLES CITA----------------

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
