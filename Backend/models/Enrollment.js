// backend/models/Enrollment.js
import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    // learning flow: modules finished -> quiz -> certificate
    completedModules: [{ type: mongoose.Schema.Types.ObjectId }],
    quizAttempts: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    lastScore: { type: Number, default: 0 },
    passedAt: { type: Date },
  },
  { timestamps: true }
);

// A student can enroll in a course only once
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

enrollmentSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Enrollment', enrollmentSchema);
