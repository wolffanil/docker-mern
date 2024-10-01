const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.set("strictQuery", true);

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log(process.env.URL_DB, "URL_DB");
      await mongoose.connect(process.env.URL_DB);

      console.log("Успешное подключение к базе данных!");
    } else {
      console.log("Подключение к базе данных уже установлено.");
    }
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error.message);
  }
};

module.exports = connectToDatabase;
