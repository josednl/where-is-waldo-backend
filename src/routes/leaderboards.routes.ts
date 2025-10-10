import express from 'express';
import { getAllLeaderboards, submitScore } from '../controllers/leaderboardController';

const router = express.Router();

router.get('/', getAllLeaderboards);
router.post("/:slug/score", submitScore);

export default router;
