const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb+srv://Admin:algoritmo9@cluster0.6dsyvhp.mongodb.net/Medical_Rolling?retryWrites=true&w=majority&appName=Cluster0");
  } catch (e) {}
};

module.exports = dbConnect;
