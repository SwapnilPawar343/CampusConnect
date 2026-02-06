import express from 'express';
import { createQuation } from '../controller/quationAndAnsController';
import { getAllQuations } from '../controller/quationAndAnsController';
import { answerQuation } from '../controller/quationAndAnsController';
import { getAnswersForQuation } from '../controller/quationAndAnsController';
import { MyQuations } from '../controller/quationAndAnsController';
import { MyAnswers } from '../controller/quationAndAnsController';

const router = express.Router();

router.post('/', createQuation);
router.get('/', getAllQuations);
router.post('/answer', answerQuation);
router.get('/:quationId/answers', getAnswersForQuation);
router.get('/myquations/:studentId', MyQuations);
router.get('/myanswers/:studentId', MyAnswers);

export default router;