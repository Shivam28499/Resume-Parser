import express from 'express';
import { parseResume } from '../controllers/resumeController.js';

const router = express.Router();
router.post('/parse', parseResume);

export default router;