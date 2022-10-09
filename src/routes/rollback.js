import { Router } from 'express';
import rollbackRun from '../controllers/rollback.js';

export const router = Router();

router.post('/', rollbackRun);
