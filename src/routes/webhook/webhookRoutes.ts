import { contestantMiddleware } from "./../../controller/webhook/webhook";
import express from "express";
import { getHome, postHome } from "../../controller/webhook/webhook";

export const router = express.Router();

router.get("/", getHome);

router.post("/", postHome);

router.get("/contestant/:id", getHome);
router.post("/contestant/:id", contestantMiddleware, postHome);
