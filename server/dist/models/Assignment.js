"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AssignmentSchema = new mongoose_1.Schema({
    leadId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lead', required: true },
    callerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SalesCaller', required: true },
    assignedAt: { type: Date, default: Date.now },
}, { collection: 'assignments' });
// Index to quickly count today's assignments per caller
AssignmentSchema.index({ callerId: 1, assignedAt: -1 });
// Prevent duplicate lead assignments
AssignmentSchema.index({ leadId: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('Assignment', AssignmentSchema);
//# sourceMappingURL=Assignment.js.map