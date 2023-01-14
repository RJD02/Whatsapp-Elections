import { Application, Request, Response } from "express";
require("dotenv").config();
const express = require("express");
const app: Application = express();
const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://admin-raviraj:${process.env.MONGO_DB_PASSWORD}@cluster0.lkxsz.mongodb.net/whatsappIntegration?retryWrites=true&w=majority`,
  {
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind("Connection error!"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(express.json());

const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello world");
});

app.listen(port, (): void => {
  console.log("Server listening on port", port);
});
