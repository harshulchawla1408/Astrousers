import express from "express";
import {
  getAllAstrologers,
  getAstrologerById,
  createAstrologer,
  updateAstrologer,
  deleteAstrologer,
  getTopAstrologers
} from "../controllers/astrologerController.js";

const router = express.Router();

// Routes
router.get("/", getAllAstrologers);
router.get("/top", getTopAstrologers);
router.get("/:id", getAstrologerById);
router.post("/", createAstrologer);
router.put("/:id", updateAstrologer);
router.delete("/:id", deleteAstrologer);

export default router;
