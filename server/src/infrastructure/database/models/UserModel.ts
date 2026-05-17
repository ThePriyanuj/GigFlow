import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../../shared/types/auth.types';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.SALES },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
