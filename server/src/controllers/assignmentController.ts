import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import Assignment from '../models/Assignment';
import { runAssignment, getAssignmentStats } from '../services/assignmentService';

/**
 * POST /api/assignments/run
 * Find all unassigned leads and run the smart assignment engine.
 */
export const executeAssignment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find leads that have no assignment record yet
    const assignedLeadIds = await Assignment.distinct('leadId');
    const unassigned = await Lead.find({ _id: { $nin: assignedLeadIds } }).lean();

    if (unassigned.length === 0) {
      res.json({ message: 'No unassigned leads found', results: [], assigned: 0, skipped: 0 });
      return;
    }

    const results = await runAssignment(unassigned as any);

    const assigned = results.filter((r) => r.matchType !== 'skipped').length;
    const skipped = results.filter((r) => r.matchType === 'skipped').length;

    res.json({
      message: `Assignment complete: ${assigned} assigned, ${skipped} skipped`,
      assigned,
      skipped,
      results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assignments/stats
 * Return assignment statistics and per-caller capacity info.
 */
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getAssignmentStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assignments/history
 * Return recent assignment records with populated lead & caller info.
 */
export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const total = await Assignment.countDocuments();
    const records = await Assignment.find()
      .populate('leadId', 'Name fullName Phone State')
      .populate('callerId', 'name role assignedStates')
      .sort({ assignedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      data: records,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/assignments/reset
 * Clear all assignment records (for testing / re-running).
 */
export const resetAssignments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Assignment.deleteMany({});
    await Lead.updateMany({}, { $unset: { assignedTo: 1 } });
    res.json({ message: 'All assignments cleared' });
  } catch (error) {
    next(error);
  }
};
