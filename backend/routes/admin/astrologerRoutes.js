import express from "express";
import {
  createAstrologerByAdmin,
  getAllAstrologersAdmin,
  updateAstrologerAdmin,
  disableAstrologer,
  getAllUsersForConversion
} from "../../controllers/admin/adminAstrologerController.js";

import { requireAuth } from "../../middleware/clerkAuth.js";

const router = express.Router();

router.post("/", requireAuth, createAstrologerByAdmin);
router.get("/", requireAuth, getAllAstrologersAdmin);
router.get("/users", requireAuth, getAllUsersForConversion); // Get users for conversion
router.put("/:id", requireAuth, updateAstrologerAdmin);
router.delete("/:id", requireAuth, disableAstrologer);

export default router;
