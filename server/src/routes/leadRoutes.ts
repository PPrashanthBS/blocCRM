import { Router } from 'express';
import { getLeads, deleteLead } from '../controllers/leadController';

const router = Router();

router.get('/', getLeads);
router.delete('/:id', deleteLead);

export default router;
