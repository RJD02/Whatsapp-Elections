/*
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoterSchema = new Schema({
  Ward_no: String,
  SLNO: String,
  houseno: String,
  VNAME_ENGLISH: String,
  cardno: String,
  Age: Number,
  PreferredLanguage: String,
});

module.exports = mongoose.model("Voter", VoterSchema);
