import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { router as webhooKRouter } from "./routes/webhookRoutes";
const app = express();

const PORT = process.env.PORT || 3000;

// mongoose.connect(
//   `mongodb+srv://admin-raviraj:${process.env.MONGO_DB_PASSWORD}@cluster0.lkxsz.mongodb.net/whatsappIntegration?retryWrites=true&w=majority`
// );

try {
  mongoose.connect(
    `mongodb://mongo:${process.env.MONGO_DB_PASSWORD}@containers-us-west-183.railway.app:${process.env.MONGO_DB_PORT}`
  );

  const db = mongoose.connection;
  db.on("error", console.error.bind("connection error!"));
  db.once("open", (): void => {
    console.log("Database connected!");
  });
} catch (e) {
  console.log("Mongo connection error");
}

exec("node ./node_modules/puppeteer/install.js", (err, stdout, stderr) => {
  if (err) {
    console.log(`error: ${err.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

app.use(express.json());
app.use("/webhook", webhooKRouter);

app.get("/", (req: Request, res: Response): void => {
  console.log("Got original home");
  res.sendStatus(200);
});

app.listen(PORT, (): void => {
  console.log("Listening on port", PORT);
});

// Nicely converted original JS to typescript
