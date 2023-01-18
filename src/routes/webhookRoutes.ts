import express from "express";
import { getHome, postHome } from "../controller/webhook";

export const router = express.Router();

router.get("/", getHome);

router.post("/", postHome);
