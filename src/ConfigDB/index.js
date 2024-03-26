const mongoose = require("mongoose");
// const UserModel = require("../Models/users");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Admin:algoritmo9@cluster0.6dsyvhp.mongodb.net/Medical_Rolling?retryWrites=true&w=majority&appName=Cluster0"
    );
    // const dbUser = await UserModel.find();
    console.log("Conexión exitosa a la base de datos");
  } catch (e) {
    console.log("Error", e);
  }
};

module.exports =  dbConnect ;
