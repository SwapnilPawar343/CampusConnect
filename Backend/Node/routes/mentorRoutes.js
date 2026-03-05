import express from 'express';
import { recommendMentors, getMentorProfile } from '../controller/mentorController.js';

const router = express.Router();

/**
 * GET /api/mentors/recommend
 * Get mentor recommendations based on student skills
 * Body: { skills: ["skill1", "skill2", ...] }
 */
router.post('/recommend', recommendMentors);

/**
 * GET /api/mentors/:mentorId
 * Get mentor profile by ID
 */
router.get('/:mentorId', getMentorProfile);

export default router;
