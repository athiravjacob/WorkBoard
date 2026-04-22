import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../../domain/entities/User';

export interface IUserDocument extends Document<string> {
  _id: string;
  name: string;
  emailid: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  emailid: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: Object.values(UserRole), 
    default: UserRole.USER 
  }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
