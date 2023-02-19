import mongoose from "mongoose";

export interface ContestantInterface {
  mobileNumber: String;
  conversationNumber: Number;
  isSubscribed: Boolean;
  webhookURL: String;
  region: String;
}

const contestantSchema: mongoose.Schema = new mongoose.Schema({
  mobileNumber: String,
  conversationNumber: {
    type: Number,
    required: true,
  },
  isSubscribed: {
    type: Boolean,
    default: true,
    required: true,
  },
  voterIdSearchNumber: {
    type: Number,
    required: true,
  },
  webhookURL: String,
  region: String,
});

export const Contestant = mongoose.model("Contestant", contestantSchema);
