import { Router } from 'express';
import { createSalesCaller, deleteSalesCaller, getSalesCallers, updateSalesCaller } from '../controllers/salesCallerController';

const router = Router();

router.get('/', getSalesCallers);
router.post('/', createSalesCaller);
router.patch('/:id', updateSalesCaller);
router.delete('/:id', deleteSalesCaller);

export default router;
