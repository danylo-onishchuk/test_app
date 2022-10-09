import { Router } from 'express';
import tokenRun from '../controllers/token.js';

export const router = Router();

router.post('/', tokenRun);
