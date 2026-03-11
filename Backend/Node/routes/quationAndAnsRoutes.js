import express from 'express';
import { createQuation } from '../controller/quationAndAnsController.js';
import { getAllQuations } from '../controller/quationAndAnsController.js';
import { answerQuation } from '../controller/quationAndAnsController.js';
import { getAnswersForQuation } from '../controller/quationAndAnsController.js';
import { MyQuations } from '../controller/quationAndAnsController.js';
import { MyAnswers } from '../controller/quationAndAnsController.js';
import { reactToAnswer } from '../controller/quationAndAnsController.js';
import {auth }from '../middlewear/auth.js';

const router = express.Router();

router.post('/', auth, createQuation);
router.get('/', auth, getAllQuations);
router.post('/answer', auth, answerQuation);
router.post('/answers/:answerId/reaction', auth, reactToAnswer);
router.get('/myquations', auth, MyQuations);
router.get('/myanswers', auth, MyAnswers);
router.get('/:quationId/answers', auth, getAnswersForQuation);

// Backward compatible endpoints
router.get('/myquations/:studentId', auth, MyQuations);
router.get('/myanswers/:studentId', auth, MyAnswers);

export default router;