import express from 'express';
import { createStudent } from '../controller/studentController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Get all students');
});
router.post('/', createStudent);

export default router;