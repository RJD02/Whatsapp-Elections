import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VoterSchema = new Schema({
  Ward_no: String,
  SLNO: String,
  houseno: String,
  VNAME_ENGLISH: String,
  cardno: String,
  Age: Number,
  PreferredLanguage: String,
  mobileNumber: String,
});

export const Voter = mongoose.model("Voter", VoterSchema);


