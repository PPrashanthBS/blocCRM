import { Schema, model } from 'mongoose';

export interface SalesCallerDocument {
  name: string;
  role: string;
  languages: string[];
  dailyLeadLimit: number;
  assignedStates?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SalesCallerSchema = new Schema<SalesCallerDocument>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    languages: { type: [String], required: true },
    dailyLeadLimit: { type: Number, required: true, min: 1 },
    assignedStates: { type: [String], default: [] },
  },
  { timestamps: true, collection: 'sales_callers' }
);

export default model<SalesCallerDocument>('SalesCaller', SalesCallerSchema);
