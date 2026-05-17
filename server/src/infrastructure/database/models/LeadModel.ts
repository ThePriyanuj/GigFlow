import mongoose, { Schema, Document } from 'mongoose';
import { LeadStatus, LeadSource } from '../../../shared/types/lead.types';

export interface ILeadDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  value: number;
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    company: { type: String, required: true, trim: true, maxlength: 200 },
    status: { type: String, enum: Object.values(LeadStatus), default: LeadStatus.NEW },
    source: { type: String, enum: Object.values(LeadSource), required: true },
    value: { type: Number, default: 0, min: 0 },
    notes: { type: String, maxlength: 2000 },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

LeadSchema.index({ status: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ createdBy: 1 });
LeadSchema.index({ name: 'text', email: 'text', company: 'text' });

export const LeadModel = mongoose.model<ILeadDocument>('Lead', LeadSchema);
