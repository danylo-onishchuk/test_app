import { Router } from 'express';
import depositRun from '../controllers/deposit.js';

export const router = Router();

router.post('/', depositRun);
