"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAssignments = exports.getHistory = exports.getStats = exports.executeAssignment = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const Assignment_1 = __importDefault(require("../models/Assignment"));
const assignmentService_1 = require("../services/assignmentService");
/**
 * POST /api/assignments/run
 * Find all unassigned leads and run the smart assignment engine.
 */
const executeAssignment = async (req, res, next) => {
    try {
        // Find leads that have no assignment record yet
        const assignedLeadIds = await Assignment_1.default.distinct('leadId');
        const unassigned = await Lead_1.default.find({ _id: { $nin: assignedLeadIds } }).lean();
        if (unassigned.length === 0) {
            res.json({ message: 'No unassigned leads found', results: [], assigned: 0, skipped: 0 });
            return;
        }
        const results = await (0, assignmentService_1.runAssignment)(unassigned);
        const assigned = results.filter((r) => r.matchType !== 'skipped').length;
        const skipped = results.filter((r) => r.matchType === 'skipped').length;
        res.json({
            message: `Assignment complete: ${assigned} assigned, ${skipped} skipped`,
            assigned,
            skipped,
            results,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.executeAssignment = executeAssignment;
/**
 * GET /api/assignments/stats
 * Return assignment statistics and per-caller capacity info.
 */
const getStats = async (req, res, next) => {
    try {
        const stats = await (0, assignmentService_1.getAssignmentStats)();
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
};
exports.getStats = getStats;
/**
 * GET /api/assignments/history
 * Return recent assignment records with populated lead & caller info.
 */
const getHistory = async (req, res, next) => {
    try {
        const { page = '1', limit = '20' } = req.query;
        const pageNum = Math.max(Number(page) || 1, 1);
        const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
        const skip = (pageNum - 1) * limitNum;
        const total = await Assignment_1.default.countDocuments();
        const records = await Assignment_1.default.find()
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
    }
    catch (error) {
        next(error);
    }
};
exports.getHistory = getHistory;
/**
 * POST /api/assignments/reset
 * Clear all assignment records (for testing / re-running).
 */
const resetAssignments = async (req, res, next) => {
    try {
        await Assignment_1.default.deleteMany({});
        await Lead_1.default.updateMany({}, { $unset: { assignedTo: 1 } });
        res.json({ message: 'All assignments cleared' });
    }
    catch (error) {
        next(error);
    }
};
exports.resetAssignments = resetAssignments;
//# sourceMappingURL=assignmentController.js.map