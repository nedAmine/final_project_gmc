import { Router } from "express";
import {
  createProduct,
  getProducts,
  getFilteredProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { adminOnly } from "../middlewares/adminOnly";
import { createUploadMiddleware } from "../utils/upload";

const router = Router();
//set destination folder
const uploadProductImages = createUploadMiddleware("uploads/products");

// PUBLIC
router.get("/", getProducts);
router.get("/search", getFilteredProducts);
router.get("/:id", getProductById);

// ADMIN
router.post("/", requireAuth, adminOnly, uploadProductImages.array("photos", 10), createProduct);
router.put("/:id", requireAuth, adminOnly, uploadProductImages.array("photos", 10), updateProduct);
router.delete("/:id", requireAuth, adminOnly, deleteProduct);

export default router;
