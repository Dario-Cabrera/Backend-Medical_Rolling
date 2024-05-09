const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const userRoutes = require("./src/Routes/user.router");
const doctorRoutes = require("./src/Routes/doctor.router");
const appointmentRoutes = require("./src/Routes/appointment.router");
const horariocitaRoutes = require("./src/Routes/horarioscita.router");

app.use(express.json());
app.use(cors({ origin: "https://frontend-medical-rolling.vercel.app", credentials: true }));
app.use(morgan("tiny"));
// Monta el enrutador en las rutas base
app.use("/api", userRoutes);
app.use("/api", doctorRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", horariocitaRoutes);

app.listen(3001, () => {
  console.log("Server on port 3001");
});

const dbConnect = require("./src/ConfigDB");
dbConnect();
