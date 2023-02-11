import mongoose from "mongoose";

const numberSchema = new mongoose.Schema({
  mobileNumber: String,
  preferredLanguage: String,
  lastConnected: Date,
});

export const ContactNumber = mongoose.model("Contact", numberSchema);
