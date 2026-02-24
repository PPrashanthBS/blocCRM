"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSalesCaller = exports.updateSalesCaller = exports.createSalesCaller = exports.getSalesCallers = void 0;
const SalesCaller_1 = __importDefault(require("../models/SalesCaller"));
const normalizeStringList = (value) => {
    if (!value) {
        return [];
    }
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }
    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};
const getSalesCallers = async (req, res, next) => {
    try {
        const callers = await SalesCaller_1.default.find().sort({ createdAt: -1 });
        res.json({ data: callers });
    }
    catch (error) {
        next(error);
    }
};
exports.getSalesCallers = getSalesCallers;
const createSalesCaller = async (req, res, next) => {
    try {
        const { name, role, languages, dailyLeadLimit, assignedStates } = req.body;
        if (!name || !role || !languages || dailyLeadLimit === undefined) {
            res.status(400);
            throw new Error('Name, role, languages, and daily lead limit are required');
        }
        const caller = await SalesCaller_1.default.create({
            name: String(name).trim(),
            role: String(role).trim(),
            languages: normalizeStringList(languages),
            dailyLeadLimit: Number(dailyLeadLimit),
            assignedStates: normalizeStringList(assignedStates),
        });
        res.status(201).json({ data: caller });
    }
    catch (error) {
        next(error);
    }
};
exports.createSalesCaller = createSalesCaller;
const updateSalesCaller = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, role, languages, dailyLeadLimit, assignedStates } = req.body;
        const updates = {};
        if (name !== undefined) {
            updates.name = String(name).trim();
        }
        if (role !== undefined) {
            updates.role = String(role).trim();
        }
        if (languages !== undefined) {
            updates.languages = normalizeStringList(languages);
        }
        if (dailyLeadLimit !== undefined) {
            updates.dailyLeadLimit = Number(dailyLeadLimit);
        }
        if (assignedStates !== undefined) {
            updates.assignedStates = normalizeStringList(assignedStates);
        }
        const updated = await SalesCaller_1.default.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            res.status(404);
            throw new Error('Sales caller not found');
        }
        res.json({ data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSalesCaller = updateSalesCaller;
const deleteSalesCaller = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await SalesCaller_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404);
            throw new Error('Sales caller not found');
        }
        res.json({ message: 'Sales caller removed' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSalesCaller = deleteSalesCaller;
//# sourceMappingURL=salesCallerController.js.map