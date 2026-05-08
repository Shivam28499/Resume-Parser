import express from 'express';
import multer from 'multer';
import { parseResume,parseResumeFromPDF } from '../controllers/resumeController.js';

const upload = multer({
    dest: 'uploads/',
    limits: {fieldSize: 10 * 1024 * 1024},
    fileFilter: (req,file,cb) => {
        if(file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files allowed'));
    }
});

const router = express.Router();
router.post('/parse', parseResume);
router.post('/upload', upload.single('file'), parseResumeFromPDF);
export default router;