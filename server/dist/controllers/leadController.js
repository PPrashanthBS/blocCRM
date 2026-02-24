"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeads = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const allowedSortFields = new Set(['Timestamp', 'Name', 'Lead Source']);
/**
 * Convert an Excel serial‑date number to a JS Date.
 * Excel epoch = 1899‑12‑30; serial 1 = 1900‑01‑01.
 */
const excelSerialToDate = (serial) => {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(epoch.getTime() + serial * 86400000);
};
const normalizeLead = (lead) => {
    const doc = lead;
    const fullName = doc['Name'] || doc['fullName'] || doc['name'] || 'Unknown';
    const phone = doc['Phone'] || doc['phone'] || doc['mobile'] || 'N/A';
    const source = doc['Lead Source'] || doc['source'] || 'Imported';
    const city = doc['City'] || doc['city'] || '';
    const state = doc['State'] || doc['state'] || '';
    const notes = doc['Any additional relevant metadata'] || doc['notes'] || '';
    let createdAt;
    if (typeof doc['Timestamp'] === 'number') {
        createdAt = excelSerialToDate(doc['Timestamp']).toISOString();
    }
    else if (doc['Timestamp']) {
        createdAt = new Date(doc['Timestamp']).toISOString();
    }
    else if (doc['createdAt']) {
        createdAt = new Date(doc['createdAt']).toISOString();
    }
    else {
        createdAt = new Date().toISOString();
    }
    return {
        _id: doc._id,
        fullName,
        phone: String(phone),
        source,
        city,
        state,
        notes,
        status: 'new',
        createdAt,
        assignedTo: doc.assignedTo || null,
    };
};
const getLeads = async (req, res, next) => {
    try {
        const { search, status, source, state, page = '1', limit = '10', sortBy, sortOrder } = req.query;
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (source) {
            filter.source = source;
        }
        if (state) {
            filter.state = state;
        }
        if (search) {
            const regex = new RegExp(String(search), 'i');
            filter.$or = [
                { Name: regex },
                { 'Lead Source': regex },
                { City: regex },
                { State: regex },
                { 'Any additional relevant metadata': regex },
            ];
            // Also support numeric phone search
            const asNum = Number(search);
            if (!isNaN(asNum)) {
                filter.$or.push({ Phone: asNum });
            }
        }
        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
        const skip = (pageNumber - 1) * limitNumber;
        const sortField = typeof sortBy === 'string' && allowedSortFields.has(sortBy) ? sortBy : 'Timestamp';
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        const total = await Lead_1.default.countDocuments(filter);
        const leads = await Lead_1.default.find(filter)
            .populate('assignedTo', 'name role')
            .sort({ [sortField]: sortDirection })
            .skip(skip)
            .limit(limitNumber)
            .lean();
        const normalizedLeads = leads.map(normalizeLead);
        res.json({
            data: normalizedLeads,
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeads = getLeads;
//# sourceMappingURL=leadController.js.map