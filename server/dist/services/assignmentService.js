"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignmentStats = exports.runAssignment = void 0;
const Assignment_1 = __importDefault(require("../models/Assignment"));
const SalesCaller_1 = __importDefault(require("../models/SalesCaller"));
/**
 * Round Robin state – keeps an in‑memory index per context key so that
 * consecutive calls rotate fairly.  Resets each time the server starts,
 * which is fine because the index is only a hint — the algorithm still
 * respects daily limits on every call.
 */
const rrIndex = {};
/** Start of the current UTC day. */
const todayStart = () => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d;
};
/**
 * For each caller, count how many assignments they already received today.
 * Returns a Map<callerIdString, count>.
 */
const getTodayCounts = async () => {
    const start = todayStart();
    const pipeline = await Assignment_1.default.aggregate([
        { $match: { assignedAt: { $gte: start } } },
        { $group: { _id: '$callerId', count: { $sum: 1 } } },
    ]);
    const map = new Map();
    for (const row of pipeline) {
        map.set(row._id.toString(), row.count);
    }
    return map;
};
/**
 * Pick the next eligible caller using Round Robin from the provided list,
 * respecting daily limits.
 *
 * @param callers    – the candidate list (state‑filtered or all)
 * @param todayCounts – daily usage counts per caller
 * @param contextKey  – a key used to maintain RR position (e.g. state name or "global")
 * @returns the chosen caller document, or null if everyone is at capacity
 */
const pickCaller = (callers, todayCounts, contextKey) => {
    if (callers.length === 0)
        return null;
    const start = rrIndex[contextKey] ?? 0;
    // Try every caller in the list starting from the RR index
    for (let i = 0; i < callers.length; i++) {
        const idx = (start + i) % callers.length;
        const caller = callers[idx];
        const used = todayCounts.get(caller._id.toString()) ?? 0;
        if (used < caller.dailyLeadLimit) {
            // Advance the pointer to the NEXT caller for the following call
            rrIndex[contextKey] = (idx + 1) % callers.length;
            return caller;
        }
    }
    return null; // All at capacity
};
/**
 * Run the assignment engine on a batch of unassigned leads.
 *
 * Algorithm per lead:
 * 1. If the lead has a State, find callers whose assignedStates includes that state (case‑insensitive).
 * 2. Among those callers, pick the next one via Round Robin that hasn't hit their daily cap.
 * 3. If no state‑specific caller is available, fall back to global Round Robin across ALL callers.
 * 4. If no caller at all is available, skip the lead.
 */
const runAssignment = async (unassignedLeads) => {
    const allCallers = await SalesCaller_1.default.find().lean();
    if (allCallers.length === 0) {
        return unassignedLeads.map((l) => ({
            leadId: l._id.toString(),
            leadName: l.Name || l.fullName || 'Unknown',
            callerId: '',
            callerName: '',
            state: l.state || '',
            matchType: 'skipped',
            reason: 'No sales callers configured',
        }));
    }
    // Pre-build a state→callers lookup (lower-case keys)
    const stateMap = new Map();
    for (const caller of allCallers) {
        if (caller.assignedStates && caller.assignedStates.length > 0) {
            for (const st of caller.assignedStates) {
                const key = st.toLowerCase().trim();
                const list = stateMap.get(key) ?? [];
                list.push(caller);
                stateMap.set(key, list);
            }
        }
    }
    const todayCounts = await getTodayCounts();
    const results = [];
    for (const lead of unassignedLeads) {
        const leadState = (lead['State'] || lead.state || '').trim();
        const leadName = lead['Name'] || lead.fullName || 'Unknown';
        const leadId = lead._id;
        let chosen = null;
        let matchType = 'skipped';
        // 1) Try state-based assignment
        if (leadState) {
            const stateCallers = stateMap.get(leadState.toLowerCase()) ?? [];
            if (stateCallers.length > 0) {
                chosen = pickCaller(stateCallers, todayCounts, `state:${leadState.toLowerCase()}`);
                if (chosen)
                    matchType = 'state';
            }
        }
        // 2) Fallback to global Round Robin
        if (!chosen) {
            chosen = pickCaller(allCallers, todayCounts, 'global');
            if (chosen)
                matchType = 'global';
        }
        if (chosen) {
            // Persist the assignment
            await Assignment_1.default.create({
                leadId: leadId,
                callerId: chosen._id,
                assignedAt: new Date(),
            });
            // Update the lead document's assignedTo field
            const Lead = (await Promise.resolve().then(() => __importStar(require('../models/Lead')))).default;
            await Lead.findByIdAndUpdate(leadId, { assignedTo: chosen._id });
            // Update today's count in memory so subsequent leads see the new count
            const key = chosen._id.toString();
            todayCounts.set(key, (todayCounts.get(key) ?? 0) + 1);
            results.push({
                leadId: leadId.toString(),
                leadName,
                callerId: chosen._id.toString(),
                callerName: chosen.name,
                state: leadState,
                matchType,
            });
        }
        else {
            results.push({
                leadId: leadId.toString(),
                leadName,
                callerId: '',
                callerName: '',
                state: leadState,
                matchType: 'skipped',
                reason: 'All callers at daily capacity',
            });
        }
    }
    return results;
};
exports.runAssignment = runAssignment;
/**
 * Get assignment statistics for dashboard display.
 */
const getAssignmentStats = async () => {
    const todayCounts = await getTodayCounts();
    const allCallers = await SalesCaller_1.default.find().lean();
    const totalAssignment = await Assignment_1.default.countDocuments();
    const todayTotal = Array.from(todayCounts.values()).reduce((s, v) => s + v, 0);
    const callerStats = allCallers.map((c) => {
        const used = todayCounts.get(c._id.toString()) ?? 0;
        return {
            _id: c._id.toString(),
            name: c.name,
            role: c.role,
            dailyLeadLimit: c.dailyLeadLimit,
            assignedToday: used,
            remainingCapacity: Math.max(0, c.dailyLeadLimit - used),
            assignedStates: c.assignedStates ?? [],
        };
    });
    return {
        totalAssignments: totalAssignment,
        assignedToday: todayTotal,
        totalCapacity: allCallers.reduce((s, c) => s + c.dailyLeadLimit, 0),
        remainingCapacity: callerStats.reduce((s, c) => s + c.remainingCapacity, 0),
        callers: callerStats,
    };
};
exports.getAssignmentStats = getAssignmentStats;
//# sourceMappingURL=assignmentService.js.map