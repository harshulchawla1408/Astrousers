import express from "express";
import {
  getAllAstrologers,
  getAstrologerById,
  createAstrologer,
  updateAstrologer,
  deleteAstrologer,
  getTopAstrologers,
  makeAllAstrologersOnline
} from "../controllers/astrologerController.js";

const router = express.Router();

// Routes
router.get("/", getAllAstrologers);
router.get("/top", getTopAstrologers);
router.get("/:id", getAstrologerById);
router.post("/", createAstrologer);
router.put("/:id", updateAstrologer);
router.delete("/:id", deleteAstrologer);
router.post("/make-online", makeAllAstrologersOnline);

export default router;
