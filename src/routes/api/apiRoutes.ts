import {
  getContestants,
  subscribe,
  unSubscribe,
} from "./../../controller/api/api.controller";

import express from "express";

export const router = express.Router();

router.get("/contestant", getContestants);
router.post("/contestant/:id/subscribe", subscribe);
router.post("/contestant/:id/unsubscribe", unSubscribe);
