const mongooes = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongooes.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

