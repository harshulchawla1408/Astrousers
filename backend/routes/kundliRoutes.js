import express from 'express';
import { generateKundliHandler } from '../controllers/kundliController.js';

const router = express.Router();

router.post('/generate', generateKundliHandler);

// Optionally: GET /api/kundli/:id to fetch stored kundli metadata if you save to DB
// router.get('/:id', getKundliByIdHandler);

export default router;
