import { Contestant, ContestantInterface } from "./../../models/contestant";
import { Request, Response } from "express";
import { Document, HydratedDocument } from "mongoose";

interface RequestBody {
  mobileNumber: string;
  isSubscribed: boolean;
  webhookURL: string;
  region: string;
}

export const addContestant = async (req: Request, res: Response) => {
  const body: RequestBody = req.body;
  try {
    const newContestant = new Contestant({
      mobileNumber: body.mobileNumber,
      isSubscribed: body.isSubscribed,
      webhookURL: body.webhookURL,
      region: body.region,
    });
    await newContestant.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

export const getContestants = async (req: Request, res: Response) => {
  try {
    const contestants = await Contestant.find({});
    res.send({ data: contestants });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};
