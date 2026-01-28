import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller";

import { requireAuth } from "../middlewares/requireAuth";
import { adminOnly } from "../middlewares/adminOnly";

const router = Router();

// public
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// admin
router.post("/", requireAuth, adminOnly, createCategory);
router.put("/:id", requireAuth, adminOnly, updateCategory);
router.delete("/:id", requireAuth, adminOnly, deleteCategory);

export default router;