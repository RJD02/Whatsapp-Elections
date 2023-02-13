import { getContestants, addContestant } from "./../../controller/api/api";
import express, { Request, Response } from "express";

export const router = express.Router();

router.get("/contestants", getContestants);

router.post("/contestants", addContestant);
