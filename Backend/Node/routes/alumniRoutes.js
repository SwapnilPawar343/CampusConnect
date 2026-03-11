import express from 'express';
import { createAlumni } from '../controller/alumniController.js';
import { login } from '../controller/alumniController.js';
import { profile } from '../controller/alumniController.js';
import { updateProfile } from '../controller/alumniController.js';
import upload from '../middlewear/multer.js';
import { auth } from '../middlewear/auth.js';
const router = express.Router();
router.post('/', upload.single('file'), createAlumni);
router.post('/login', login);
router.get('/profile', auth, profile);
router.put('/:id', updateProfile);

export default router;