import { z } from 'zod';

// Experience type
export type Experience = {
  role: string;
  company: string;
  duration: string;
};

// Investment type
export type Investment = {
  projectOwner: string; // Wallet address of the project's owner user has invested in
  index: number; // Nth number of project of project owner user has invested in
  amount: number; // Amount of ETH user has invested
  defunded: number; // Amount of ETH user has withdrawn/defunded
};

// User type
export type User = {
  wallet: string; // Wallet address of the user
  name: string; // Name of the user
  country: string; // Country where user lives
  investments: Investment[] | null; // Investments user has made
  projectCount: number; // Number of projects user has published
  role: string; // User's main job eg. Software Developer, Project Manager
  skills: string[]; // User's soft skills and hard skills, max 10
  experiences: Experience[]; // array of type experience where user can add his past experiences, max 5
  linkedin: string; // Link to user's linkedin
  x: string; // Link to user's x (twitter)
  github: string; // Link to user's github
};

// Project type
export type Project = {
  owner: string; // Wallet address of the project's owner
  members: string[]; // Wallet addresses of the members involved
  index: number; // Nth number of project exactly like in smart contract
  goal: number; // Total ETH needed for the project
  milestones: number; // Number of milestones, if 2 then it's 50% and 100%, if 3 then 33, 66, 99, basically divide the goal by milestones, max 20
  funded: number; // Amount of ETH funded
  released: number; // Amount of ETH released
  defunded: number; // Amount of ETH defunded
  ended: boolean; // Project funding is going on or not
  title: string; // Title of the project
  description: string; // Short description of the project
};

// Zod schemas for validation
export const ExperienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  duration: z.string().min(1, "Duration is required"),
});

export const InvestmentSchema = z.object({
  projectOwner: z.string().min(42, "Invalid wallet address"),
  index: z.number().int().positive(),
  amount: z.number().positive(),
  defunded: z.number().min(0),
});

export const UserSchema = z.object({
  wallet: z.string().min(42, "Invalid wallet address"),
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  investments: z.array(InvestmentSchema).nullable(),
  projectCount: z.number().int().min(0),
  role: z.string().min(1, "Role is required"),
  skills: z.array(z.string()).max(10, "Maximum 10 skills allowed"),
  experiences: z.array(ExperienceSchema).max(5, "Maximum 5 experiences allowed"),
  linkedin: z.string().url("Invalid LinkedIn URL"),
  x: z.string().url("Invalid X URL"),
  github: z.string().url("Invalid GitHub URL"),
});

export const ProjectSchema = z.object({
  owner: z.string().min(42, "Invalid wallet address"),
  members: z.array(z.string().min(42, "Invalid wallet address")),
  index: z.number().int().positive(),
  goal: z.number().positive(),
  milestones: z.number().int().min(1).max(20, "Milestones must be between 1 and 20"),
  funded: z.number().min(0),
  released: z.number().min(0),
  defunded: z.number().min(0),
  ended: z.boolean(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type ProjectsResponse = ApiResponse<Project[]>;
export type ProjectResponse = ApiResponse<Project>;
export type UserResponse = ApiResponse<User>;
export type UsersResponse = ApiResponse<User[]>; 