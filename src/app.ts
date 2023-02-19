import { func } from "./test/test";
import { Contestant } from "./models/contestant";
import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { router as webhooKRouter } from "./routes/webhook/webhookRoutes";
import { router as apiRouter } from "./routes/api/apiRoutes";

const app = express();

const PORT = process.env.PORT || 3000;

// mongoose.connect(
//    `mongodb+srv://admin-raviraj:${process.env.MONGO_DB_PASSWORD}@cluster0.lkxsz.mongodb.net/whatsappIntegration?retryWrites=true&w=majority`
// );
//
try {
  // mongoose.connect(
  //   `mongodb://mongo:${process.env.MONGO_DB_PASSWORD}@containers-us-west-183.railway.app:${process.env.MONGO_DB_PORT}`
  // );

  mongoose.connect(
    `mongodb+srv://admin-raviraj:${process.env.MONGO_DB_PASSWORD}@cluster0.lkxsz.mongodb.net/whatsappIntegration?retryWrites=true&w=majority`
  );

  const db = mongoose.connection;
  db.on("error", console.error.bind("connection error!"));
  db.once("open", (): void => {
    console.log("Database connected!");
  });
} catch (e) {
  console.log("Mongo connection error");
}

app.use(express.json());
app.use("/webhook", webhooKRouter);
app.use("/api", apiRouter);

app.get("/", (req: Request, res: Response): void => {
  console.log("Got original home");
  res.sendStatus(200);
});

// func();

app.listen(PORT, (): void => {
  console.log("Listening on port", PORT);
});

// Nicely converted original JS to typescript
