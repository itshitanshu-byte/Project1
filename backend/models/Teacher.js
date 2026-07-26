import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  college: { type: String, required: true },
  branch: { type: String, required: true },
  group: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved"], default: "pending" }
});

export default mongoose.model("Teacher", teacherSchema);
