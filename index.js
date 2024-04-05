const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const userRoutes = require("./src/Routes/user.router");
const doctorRoutes = require("./src/Routes/doctor.router");
const appointmentRoutes = require("./src/Routes/appointment.router");
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
// Monta el enrutador en las rutas base
app.use("/users", userRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

app.listen(3000, () => {
  console.log("Server on port 3000");
});

const dbConnect = require("./src/ConfigDB");
dbConnect();
