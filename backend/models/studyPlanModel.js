import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  subject: String,
  hours: Number,
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date
});

const daySchema = new mongoose.Schema({
  day: Number,
  tasks: [taskSchema]
});

const studyPlanSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  plan: [daySchema]
},
{ timestamps: true }
);

export default mongoose.model("StudyPlan", studyPlanSchema);