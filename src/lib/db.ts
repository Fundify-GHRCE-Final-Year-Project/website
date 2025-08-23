import mongoose from "mongoose";

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;
  
  if (mongoose.connections[0].readyState) {
    isConnected = true;
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "indexed_data", // Use "test" since that's where your data is
    });
    isConnected = true;
    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}