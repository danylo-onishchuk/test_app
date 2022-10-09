import { Router } from 'express';
import registerRun from '../controllers/registration.js';

export const router = Router();

router.post('/', registerRun);
