import { Router } from 'express';
import createGameRun from '../controllers/createGame.js';
import buyGameRun from '../controllers/buyGame.js';

export const router = Router();

router.post('/create', createGameRun);
router.post('/buy', buyGameRun);
