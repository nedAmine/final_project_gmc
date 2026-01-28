import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { adminOnly } from "../middlewares/adminOnly";

const router = Router();

router.get("/", getSettings);
router.put("/", requireAuth, adminOnly, updateSettings);

export default router;
