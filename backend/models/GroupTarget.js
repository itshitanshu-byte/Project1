import mongoose from "mongoose";

const groupTargetSchema = new mongoose.Schema({
  groupKey: { type: String, required: true, unique: true },
  target: { type: Number, required: true }
});

export default mongoose.model("GroupTarget", groupTargetSchema);
