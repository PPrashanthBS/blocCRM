"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LeadSchema = new mongoose_1.Schema({
    fullName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'lost'],
        default: 'new',
    },
    source: { type: String, trim: true, default: 'Imported' },
    state: { type: String, trim: true },
    assignedTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SalesCaller' },
}, {
    timestamps: true,
    strict: false,
    collection: 'leads',
});
exports.default = (0, mongoose_1.model)('Lead', LeadSchema);
//# sourceMappingURL=Lead.js.map