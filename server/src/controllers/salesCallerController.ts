import { Request, Response, NextFunction } from 'express';
import SalesCaller from '../models/SalesCaller';

const normalizeStringList = (value: unknown): string[] => {
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

export const getSalesCallers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const callers = await SalesCaller.find().sort({ createdAt: -1 });
    res.json({ data: callers });
  } catch (error) {
    next(error);
  }
};

export const createSalesCaller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, role, languages, dailyLeadLimit, assignedStates } = req.body;

    if (!name || !role || !languages || dailyLeadLimit === undefined) {
      res.status(400);
      throw new Error('Name, role, languages, and daily lead limit are required');
    }

    const caller = await SalesCaller.create({
      name: String(name).trim(),
      role: String(role).trim(),
      languages: normalizeStringList(languages),
      dailyLeadLimit: Number(dailyLeadLimit),
      assignedStates: normalizeStringList(assignedStates),
    });

    res.status(201).json({ data: caller });
  } catch (error) {
    next(error);
  }
};

export const updateSalesCaller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, role, languages, dailyLeadLimit, assignedStates } = req.body;

    const updates: Record<string, unknown> = {};

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

    const updated = await SalesCaller.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404);
      throw new Error('Sales caller not found');
    }

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteSalesCaller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await SalesCaller.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404);
      throw new Error('Sales caller not found');
    }

    res.json({ message: 'Sales caller removed' });
  } catch (error) {
    next(error);
  }
};
