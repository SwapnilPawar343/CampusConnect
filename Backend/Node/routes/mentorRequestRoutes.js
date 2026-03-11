import express from 'express';
import {
    requestMentor,
    getPendingRequests,
    acceptMentorRequest,
    rejectMentorRequest,
    getStudentMentorRequests,
    getMenteesCount
} from '../controller/mentorRequestController.js';
import { auth } from '../middlewear/auth.js';

const router = express.Router();

// Student routes
router.post('/request', auth, requestMentor);
router.get('/my-requests', auth, getStudentMentorRequests);

// Alumni routes
router.get('/pending', auth, getPendingRequests);
router.post('/accept/:requestId', auth, acceptMentorRequest);
router.post('/reject/:requestId', auth, rejectMentorRequest);
router.get('/mentees-count', auth, getMenteesCount);

export default router;
