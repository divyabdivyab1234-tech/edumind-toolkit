import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Todo", todoSchema);
