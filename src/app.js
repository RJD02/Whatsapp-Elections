require("dotenv").config();
var express = require("express");
console.log("Hello");
var app = express();
var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin-raviraj:".concat(process.env.MONGO_DB_PASSWORD, "@cluster0.lkxsz.mongodb.net/whatsappIntegration?retryWrites=true&w=majority"), {
    useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind("Connection error!"));
db.once("open", function () {
    console.log("Database connected");
});
var sum = function (num1, num2) {
    return num1 + num2;
};
console.log(sum(8, 4));
