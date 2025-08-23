// models/project.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  owner: string;
  index: number;
  goal: number;
  milestones: number;
  funded: number;
  released: number;
  timestamp: number;
  title?: string;
  description?: string;
}

export interface IInvestment extends Document {
  funder: string;
  investmentIndex: number;
  projectOwner: string;
  projectIndex: number;
  amount: number;
  timestamp: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    owner: { type: String, required: true, index: true },
    index: { type: Number, required: true, index: true },
    goal: { type: Number, required: true },
    milestones: { type: Number, required: true },
    funded: { type: Number, required: true },
    released: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    title: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
    collection: 'projects',
  }
);

const InvestmentSchema = new Schema<IInvestment>(
  {
    funder: { type: String, required: true, index: true },
    investmentIndex: { type: Number, required: true, index: true },
    projectOwner: { type: String, required: true, index: true },
    projectIndex: { type: Number, required: true, index: true },
    amount: { type: Number, required: true },
    timestamp: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: 'investments',
  }
);

// Add compound indexes
ProjectSchema.index({ owner: 1, index: 1 }, { unique: true });
InvestmentSchema.index({ funder: 1, investmentIndex: 1 }, { unique: true });

// Fix the model recompilation issue in Next.js
delete mongoose.models.Project;
delete mongoose.models.Investment;

export const ProjectModel =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export const InvestmentModel =
  mongoose.models.Investment || mongoose.model<IInvestment>('Investment', InvestmentSchema);
