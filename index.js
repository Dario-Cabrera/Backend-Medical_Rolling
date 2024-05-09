const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const userRoutes = require("./src/Routes/user.router");
const doctorRoutes = require("./src/Routes/doctor.router");
const appointmentRoutes = require("./src/Routes/appointment.router");
const horariocitaRoutes = require("./src/Routes/horarioscita.router");

app.use(express.json());
app.use(
  cors({
    origin: "https://frontend-medical-rolling.vercel.app", // Permitir solicitudes solo desde este origen
    // origin: "*", // Permitir solicitudes desde cualquier origen (uso con precaución)
    methods: ["GET", "POST", "PUT", "DELETE"], // Permitir estos métodos HTTP
    allowedHeaders: ["Content-Type", "Authorization"], // Permitir estos encabezados en las solicitudes
    exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"], // Exponer estos encabezados en las respuestas
    credentials: true, // Permitir el intercambio de cookies entre el frontend y el backend
    maxAge: 86400, // Tiempo máximo (en segundos) que las preflight requests pueden ser cachéadas
  })
);
app.use(morgan("tiny"));
// Monta el enrutador en las rutas base
app.use("/api", userRoutes);
app.use("/api", doctorRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", horariocitaRoutes);

app.listen(3001, () => {});

const dbConnect = require("./src/ConfigDB");
dbConnect();
