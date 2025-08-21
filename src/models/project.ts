// models/project.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  owner: string;
  index: number;
  goal: string; // Keep as string to handle BigInt serialization
  milestones: number;
  funded: string; // Keep as string to handle BigInt serialization
  released: string; // Keep as string to handle BigInt serialization
  timestamp: number;
  title?: string;
  description?: string;
}

export interface IInvestment extends Document {
  funder: string;
  investmentIndex: number;
  projectOwner: string;
  projectIndex: number;
  amount: string; // Keep as string to handle BigInt serialization
  timestamp: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    owner: { type: String, required: true, index: true },
    index: { type: Number, required: true, index: true },
    goal: { type: String, required: true }, // Changed to String
    milestones: { type: Number, required: true },
    funded: { type: String, required: true }, // Changed to String
    released: { type: String, required: true }, // Changed to String
    timestamp: { type: Number, required: true },
    title: { type: String },
    description: { type: String },
  },
  { 
    timestamps: true,
    collection: 'projects' // Explicitly set collection name
  }
);

const InvestmentSchema = new Schema<IInvestment>(
  {
    funder: { type: String, required: true, index: true },
    investmentIndex: { type: Number, required: true, index: true },
    projectOwner: { type: String, required: true, index: true },
    projectIndex: { type: Number, required: true, index: true },
    amount: { type: String, required: true }, // Changed to String
    timestamp: { type: Number, required: true },
  },
  { 
    timestamps: true,
    collection: 'investments' // Explicitly set collection name
  }
);

// Add compound indexes
ProjectSchema.index({ owner: 1, index: 1 }, { unique: true });
InvestmentSchema.index({ funder: 1, investmentIndex: 1 }, { unique: true });

// Fix the model compilation issue
delete mongoose.models.Project;
delete mongoose.models.Investment;

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
export const InvestmentModel = mongoose.model<IInvestment>('Investment', InvestmentSchema);