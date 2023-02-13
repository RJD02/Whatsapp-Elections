import mongoose from "mongoose";

export interface ContestantInterface {
  mobileNumber: String;
  conversationNumber: Number;
  isSubscribed: Boolean;
  webhookURL: String;
  region: String;
}

const contestantSchema = new mongoose.Schema({
  mobileNumber: String,
  conversationNumber: Number,
  isSubscribed: Boolean,
  webhookURL: String,
  region: String,
});

export const Contestant = mongoose.model("Contestant", contestantSchema);
