import { Schema, model, Types } from 'mongoose';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';

export interface LeadDocument {
  fullName?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  source?: string;
  state?: string;
  assignedTo?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const LeadSchema = new Schema<LeadDocument>(
  {
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
    assignedTo: { type: Schema.Types.ObjectId, ref: 'SalesCaller' },
  },
  {
    timestamps: true,
    strict: false,
    collection: 'leads',
  }
);

export default model<LeadDocument>('Lead', LeadSchema);
