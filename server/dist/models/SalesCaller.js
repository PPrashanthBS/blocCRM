"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SalesCallerSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    languages: { type: [String], required: true },
    dailyLeadLimit: { type: Number, required: true, min: 1 },
    assignedStates: { type: [String], default: [] },
}, { timestamps: true, collection: 'sales_callers' });
exports.default = (0, mongoose_1.model)('SalesCaller', SalesCallerSchema);
//# sourceMappingURL=SalesCaller.js.map