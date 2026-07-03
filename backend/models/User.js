import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Prevents duplicate emails
  password: { type: String, required: true }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt'

export default mongoose.model("User", userSchema);