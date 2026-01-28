import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { adminOnly } from "../middlewares/adminOnly";
import { 
    createOrderGuest,
    createOrder,
    updateOrder,
    getOrderById,
    getFilteredOrders,
    deleteOrder,
    getUserOrders
 } from "../controllers/order.controller";

 const router = Router();

// Accessible to all (guest) 
router.post("/guest", createOrderGuest);

// Reserved for authenticated users (admin)
router.get("/", requireAuth, adminOnly, getFilteredOrders);
router.put("/:id", requireAuth, adminOnly, updateOrder);
router.delete("/:id", requireAuth, adminOnly, deleteOrder);

// Reserved for authenticated users
router.post("/", requireAuth, createOrder);
router.get("/:id", requireAuth, getOrderById);
router.get("/userOrders/:id", requireAuth, getUserOrders);

export default router;