import express from 'express';
import { updateResource } from '../controller/resourceController.js';
import { createResource } from '../controller/resourceController.js';
import { getAllResources } from '../controller/resourceController.js';
import { getResourceById } from '../controller/resourceController.js';
import { deleteResource } from '../controller/resourceController.js';
import { MyResources } from '../controller/resourceController.js';
import upload from '../middlewear/multer.js';
import { auth } from '../middlewear/auth.js';

const router = express.Router();

// POST route with file upload (supports images, videos, PDFs, audio)
router.post('/', auth, upload.single('file'), createResource);
router.get('/', getAllResources);
router.get('/myresources', auth, MyResources);
router.get('/myresources/:userId', auth, MyResources);
router.get('/:id', getResourceById);
router.put('/:id', auth, updateResource);
router.delete('/:id', auth, deleteResource);

export default router;