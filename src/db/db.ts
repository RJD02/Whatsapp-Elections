import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb://mongo:${process.env.MONGO_DB_PASSWORD}@containers-us-west-183.railway.app:${process.env.MONGO_DB_PORT}`
    );
    const db = mongoose.connection;
    db.on("error", console.error.bind("Connection error!"));
    db.once("open", () => {
      console.log("Database connected!");
    });
  } catch (e) {
    console.log("Could not connect to db");
    return;
  }
};

export default connectToDatabase;
