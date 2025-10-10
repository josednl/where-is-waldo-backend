import express from 'express';
import { getAllGames, getGameBySlug, validateArea } from '../controllers/gameController';

const router = express.Router();

router.get('/', getAllGames);
router.get('/:slug', getGameBySlug);
router.post('/:slug/validate', validateArea);

export default router;
