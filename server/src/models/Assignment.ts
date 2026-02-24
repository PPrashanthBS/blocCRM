import { Schema, model, Types } from 'mongoose';

export interface AssignmentDocument {
  leadId: Types.ObjectId;
  callerId: Types.ObjectId;
  assignedAt: Date;
}

const AssignmentSchema = new Schema<AssignmentDocument>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    callerId: { type: Schema.Types.ObjectId, ref: 'SalesCaller', required: true },
    assignedAt: { type: Date, default: Date.now },
  },
  { collection: 'assignments' }
);

// Index to quickly count today's assignments per caller
AssignmentSchema.index({ callerId: 1, assignedAt: -1 });
// Prevent duplicate lead assignments
AssignmentSchema.index({ leadId: 1 }, { unique: true });

export default model<AssignmentDocument>('Assignment', AssignmentSchema);
