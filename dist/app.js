"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const webhookRoutes_1 = require("./routes/webhookRoutes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// mongoose.connect(
//   `mongodb+srv://admin-raviraj:${process.env.MONGO_DB_PASSWORD}@cluster0.lkxsz.mongodb.net/whatsappIntegration?retryWrites=true&w=majority`
// );
mongoose_1.default.connect(`mongodb://mongo:${process.env.MONGO_DB_PASSWORD}@containers-us-west-183.railway.app:${process.env.MONGO_DB_PORT}`);
const db = mongoose_1.default.connection;
db.on("error", console.error.bind("connection error!"));
db.once("open", () => {
    console.log("Database connected!");
});
app.use(express_1.default.json());
app.use("/webhook", webhookRoutes_1.router);
app.get("/", (req, res) => {
    console.log("Got original home");
    res.sendStatus(200);
});
app.listen(PORT, () => {
    console.log("Listening on port", PORT);
});
// Nicely converted original JS to typescript
