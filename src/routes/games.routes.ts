import express from 'express';
import { getAllGames, getGameBySlug } from '../controllers/gameController';

const router = express.Router();

router.get('/', getAllGames);
router.get('/:slug', getGameBySlug);

export default router;
