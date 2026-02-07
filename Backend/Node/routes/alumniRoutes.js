import express from 'express';
import { createAlumni } from '../controller/alumniController';
import { profile } from '../controller/alumniController';
import { updateProfile } from '../controller/alumniController';
import {upload} from '../middleware/multer.js';
const router = express.Router();
router.post('/', upload.single('file'), createAlumni);
router.get('/profile', profile);
router.put('/:id', updateProfile);

export default router;