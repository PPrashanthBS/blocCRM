import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';

const allowedSortFields = new Set(['Timestamp', 'Name', 'Lead Source']);

/**
 * Convert an Excel serial‑date number to a JS Date.
 * Excel epoch = 1899‑12‑30; serial 1 = 1900‑01‑01.
 */
const excelSerialToDate = (serial: number): Date => {
  const epoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(epoch.getTime() + serial * 86_400_000);
};

const normalizeLead = (lead: any) => {
  const doc = lead as Record<string, any>;

  const fullName  = doc['Name']    || doc['fullName'] || doc['name'] || 'Unknown';
  const phone     = doc['Phone']   || doc['phone']    || doc['mobile'] || 'N/A';
  const source    = doc['Lead Source'] || doc['source'] || 'Imported';
  const city      = doc['City']    || doc['city']     || '';
  const state     = doc['State']   || doc['state']    || '';
  const notes     = doc['Any additional relevant metadata'] || doc['notes'] || '';

  let createdAt: string;
  if (typeof doc['Timestamp'] === 'number') {
    const d = excelSerialToDate(doc['Timestamp']);
    createdAt = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } else if (doc['Timestamp']) {
    const d = new Date(doc['Timestamp']);
    createdAt = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } else if (doc['createdAt']) {
    const d = new Date(doc['createdAt']);
    createdAt = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } else {
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
    status: 'new' as const,
    createdAt,
    assignedTo: doc.assignedTo || null,
  };
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, status, source, state, page = '1', limit = '10', sortBy, sortOrder } = req.query;

    const filter: Record<string, unknown> = {};

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
        (filter.$or as any[]).push({ Phone: asNum });
      }
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const sortField = typeof sortBy === 'string' && allowedSortFields.has(sortBy) ? sortBy : 'Timestamp';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
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
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};
