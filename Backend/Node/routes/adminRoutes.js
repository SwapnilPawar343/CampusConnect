import express from 'express';
import { adminLogin, createAdmin, getAllAdmins, deleteAdmin, createEvent, getAllEvents, deleteEvent, getAllStudents, deleteStudent, getAllAlumni, deleteAlumni } from '../controller/adminController.js';
import { auth } from '../middlewear/auth.js';

const router = express.Router();

// Admin authentication routes
router.post('/login', adminLogin);
router.post('/create', createAdmin);
router.get('/all', getAllAdmins);
router.delete('/:id', deleteAdmin);

// Event management routes
router.post('/events', createEvent);
router.get('/events', getAllEvents);
router.delete('/events/:id', deleteEvent);

// User management routes
router.get('/students', getAllStudents);
router.delete('/students/:id', deleteStudent);
router.get('/alumni', getAllAlumni);
router.delete('/alumni/:id', deleteAlumni);

export default router;
