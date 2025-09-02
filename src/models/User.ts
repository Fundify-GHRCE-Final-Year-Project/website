// models/User.ts
import mongoose, { Schema, model, models } from "mongoose";

const INTERESTS = [
  "Medical",
  "Coding",
  "Technology",
  "Pharmacy",
  "Army",
  "Defence",
  "Farming",
  "Finance",
  "Education",
  "Environment",
  "Sports",
  "Art & Culture",
  "Travel",
  "Social Work",
  "Music",
  "Business",
  "Science",
];

const userSchema = new Schema(
  {
    wallet: { type: String, required: true, unique: true },
    name: { type: String },
    country: { type: String },
    role: { type: String },
    phone: { type: String },
    address: { type: String },

    linkedin: { type: String },
    x: { type: String },
    github: { type: String },

    skills: { type: [String], default: [] },
    interests: { type: [String], default: [], enum: INTERESTS },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
