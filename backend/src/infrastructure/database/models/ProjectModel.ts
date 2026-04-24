import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectDocument extends Document<string> {
  _id: string;
  title: string;
  description: string;
  pmId?: string | null;
  teamMemberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    pmId: { type: String,ref: 'User', default: null },
    teamMemberIds: { type: [String], ref: 'User',default: [] },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const ProjectModel = mongoose.model<IProjectDocument>('Project', ProjectSchema);
