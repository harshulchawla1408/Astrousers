import express from "express";
import {
  createAstrologerByAdmin,
  getAllAstrologersAdmin,
  updateAstrologerAdmin,
  disableAstrologer
} from "../../controllers/admin/adminAstrologerController.js";

import { requireAuth } from "../../middleware/clerkAuth.js";

const router = express.Router();

router.post("/", requireAuth, createAstrologerByAdmin);
router.get("/", requireAuth, getAllAstrologersAdmin);
router.put("/:id", requireAuth, updateAstrologerAdmin);
router.delete("/:id", requireAuth, disableAstrologer);

export default router;
