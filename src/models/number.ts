import mongoose from "mongoose";

const numberSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
  },
  preferredLanguage: { type: String, required: true },
  lastConnected: { type: Date, required: true },
});

export const ContactNumber = mongoose.model("Contact", numberSchema);
