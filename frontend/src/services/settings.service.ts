import api from "./api";
import { type Settings } from "../types/settings";

export const getSettings = () =>
  api.get<Settings>("/settings");

export const updateSettings = (data: Settings) =>
  api.put("/settings", data);