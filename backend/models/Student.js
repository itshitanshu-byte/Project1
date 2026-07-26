import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNo: { type: String, required: true, unique: true },
  college: { type: String, required: true },
  branch: { type: String, required: true },
  group: { type: String, required: true },
  timeline: {
    tenth: { type: Boolean, default: true },
    twelfth: { type: Boolean, default: false },
    diploma: { type: Boolean, default: false },
    btech: { type: Boolean, default: true }
  },
  marks: {
    tenth: {
      board: { type: String, default: "" },
      score: { type: Number, default: null }
    },
    twelfth: {
      board: { type: String, default: "" },
      score: { type: Number, default: null }
    },
    diploma: {
      stream: { type: String, default: "" },
      score: { type: Number, default: null },
      weak: { type: String, default: "" }
    },
    btech: [
      {
        sem: { type: Number, required: true },
        subjects: [
          {
            name: { type: String, required: true },
            score: { type: Number, required: true }
          }
        ]
      }
    ]
  },
  cgpa: { type: Number, default: 0 },
  weakSubjects: [
    {
      name: { type: String, required: true },
      score: { type: Number, required: true },
      reason: { type: String, required: true }
    }
  ]
});

export default mongoose.model("Student", studentSchema);
