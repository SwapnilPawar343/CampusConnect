import express from 'express';
import { createStudent } from '../controller/studentController.js';
import { login } from '../controller/studentController.js';
import { profile } from '../controller/studentController.js';
import { updateProfile } from '../controller/studentController.js';


const router = express.Router();

router.get('/', (req, res) => {
    res.send('Get all students');
});
router.post('/', createStudent);
router.post('/login', login);
router.post('/profile', profile);
router.put('/:id', updateProfile);

export default router;