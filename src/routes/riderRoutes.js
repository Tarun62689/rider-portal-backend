import express from "express";
import { registerRider, loginRider, getProfile } from "../controllers/riderController.js";

const router = express.Router();

router.post("/register", registerRider);
router.post("/login", loginRider);
router.get("/profile", getProfile);

export default router;
