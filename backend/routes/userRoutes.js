import express from "express";
import { upsertUser } from "../controllers/userController.js";

const router = express.Router();

// POST /api/users
router.post("/", upsertUser);

export default router;
