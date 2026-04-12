import express from 'express';
import upload from '../middlewear/multer.js';
import { auth } from '../middlewear/auth.js';
import {
    getStudentChat,
    sendStudentMessage,
    getAlumniConversations,
    getAlumniChatByStudent,
    sendAlumniMessage,
} from '../controller/chatController.js';

const router = express.Router();

router.get('/student', auth, getStudentChat);
router.post('/student/send', auth, upload.single('file'), sendStudentMessage);

router.get('/alumni/conversations', auth, getAlumniConversations);
router.get('/alumni/:studentId', auth, getAlumniChatByStudent);
router.post('/alumni/:studentId/send', auth, upload.single('file'), sendAlumniMessage);

export default router;
