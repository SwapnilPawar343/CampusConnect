import express from 'express';
import { createQuation } from '../controller/quationAndAnsController.js';
import { getAllQuations } from '../controller/quationAndAnsController.js';
import { answerQuation } from '../controller/quationAndAnsController.js';
import { getAnswersForQuation } from '../controller/quationAndAnsController.js';
import { MyQuations } from '../controller/quationAndAnsController.js';
import { MyAnswers } from '../controller/quationAndAnsController.js';
import {auth }from '../middlewear/auth.js';

const router = express.Router();

router.post('/', auth, createQuation);
router.get('/', auth, getAllQuations);
router.post('/answer', auth, answerQuation);
router.get('/:quationId/answers', auth, getAnswersForQuation);
router.get('/myquations/:studentId', auth, MyQuations);
router.get('/myanswers/:studentId', auth, MyAnswers);

export default router;