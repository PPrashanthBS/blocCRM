import { Router } from 'express';
import {
  executeAssignment,
  getStats,
  getHistory,
  resetAssignments,
} from '../controllers/assignmentController';

const router = Router();

router.post('/run', executeAssignment);
router.get('/stats', getStats);
router.get('/history', getHistory);
router.post('/reset', resetAssignments);

export default router;
