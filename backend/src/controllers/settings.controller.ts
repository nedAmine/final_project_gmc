import { Request, Response } from "express";
import Settings from "../models/Settings.model";

// GET: get settings (first document)
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

// UPDATE: update settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { defaultTax, useDeliveryRules, deliveryRules, defaultPerPage, defaultListPerPage } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {}, // 1st document
      { defaultTax, useDeliveryRules, deliveryRules, defaultPerPage, defaultListPerPage },
      { new: true, upsert: true } // create one if not found
    );

    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update settings" });
  }
};

