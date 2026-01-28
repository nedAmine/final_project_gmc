import { Router } from "express";
import { 
  requestRegister, 
  register, 
  continueManual, 
  continueWithGoogle, 
  updateData, 
  editPassword
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.post("/register/request", requestRegister);
router.post("/register/confirm", register);
router.post("/continue/manual", continueManual);
router.post("/continue/google", continueWithGoogle);

// Protected route example
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: (req as any).user });
});
router.put("/me", requireAuth, updateData);
router.put("/me/password", requireAuth, editPassword);

export default router;