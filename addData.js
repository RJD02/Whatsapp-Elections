const data = require("./assets/Voters");
const mongoose = require("mongoose");
const Voter = require("./models/voters");

const addData = () => {
  for (let i = 0; i < data.length; i++) {
    const newVoter = new Voter({
      Ward_no: data[i]["Ward_no"],
      Age: parseInt(data[i]["AGE"]),
      cardno: data[i]["cardno"],
      houseno: data[i]["cardno"],
      SLNO: data[i]["SLNO"],
      VNAME_ENGLISH: data[i]["VNAME_ENGLISH"],
    });
    newVoter.save();
  }
};

const getData = async () => {
  const data = await Voter.find({ cardno: "DJJ0805960" });
  console.log(data);
};

module.exports = { addData, getData };
