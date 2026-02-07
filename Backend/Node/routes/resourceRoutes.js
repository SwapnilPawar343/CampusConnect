import express from 'express';
import { updateResource } from '../controller/resourceController.js';
import { createResource } from '../controller/resourceController.js';
import { getAllResources } from '../controller/resourceController.js';
import { getResourceById } from '../controller/resourceController.js';
import { deleteResource } from '../controller/resourceController.js';
import { MyResources } from '../controller/resourceController.js';
const router = express.Router();

router.post('/', createResource);
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);
router.get('/myresources/:studentId', MyResources);

export default router;