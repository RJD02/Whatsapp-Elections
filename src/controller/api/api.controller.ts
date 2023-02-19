import { Contestant } from "./../../models/contestant";
import { Request, Response } from "express";

export const unSubscribe = async (req: Request, res: Response) => {
  try {
    const contestant = await Contestant.findById(req.params.id);
    if (contestant) {
      contestant.isSubscribed = false;
      await contestant.save();
      return res.sendStatus(200);
    } else {
      return res.sendStatus(404);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const subscribe = async (req: Request, res: Response) => {
  try {
    const contestant = await Contestant.findById(req.params.id);
    if (contestant) {
      contestant.isSubscribed = true;
      await contestant.save();
      return res.sendStatus(200);
    } else {
      return res.sendStatus(404);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const getContestants = async (req: Request, res: Response) => {
  try {
    const contestants = await Contestant.find();
    if (contestants) {
      return res.status(200).send({ contestants });
    } else {
      return res.sendStatus(404);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};
