// backend/models/Course.js
import mongoose from 'mongoose';

// One learning module (a lesson) inside a course
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Module title is required'], trim: true, maxlength: 120 },
  content: { type: String, required: [true, 'Module content is required'], trim: true, maxlength: 5000 },
  videoUrl: { type: String, trim: true, default: '', maxlength: 300 },
});

// One multiple-choice quiz question (4 options, one correct)
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: [true, 'Question text is required'], trim: true, maxlength: 300 },
    options: {
      type: [String],
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 4 && v.every((o) => typeof o === 'string' && o.trim()),
        message: 'Each question needs exactly 4 non-empty options',
      },
    },
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 1000 },
    duration: { type: String, required: [true, 'Duration is required'], trim: true, maxlength: 40 },
    instructor: { type: String, trim: true, default: 'ACADEXA Faculty' },
    modules: { type: [moduleSchema], default: [] },
    quiz: {
      type: [questionSchema],
      default: [],
      validate: {
        validator: (v) => v.length === 0 || v.length === 5,
        message: 'The quiz must have exactly 5 questions',
      },
    },
  },
  { timestamps: true }
);

// Public JSON NEVER contains lesson text or quiz answers - only counts.
// (Students get lesson content through /api/learning, admins through /api/courses/:id/full.)
courseSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    if (Array.isArray(ret.modules)) {
      ret.moduleCount = ret.modules.length;
      delete ret.modules;
    }
    if (Array.isArray(ret.quiz)) {
      ret.quizReady = ret.quiz.length === 5;
      delete ret.quiz;
    }
    return ret;
  },
});

// Full course (modules + quiz WITH correct answers) - admin editor only
courseSchema.methods.toAdminJSON = function toAdminJSON() {
  const o = this.toObject();
  return {
    id: o._id,
    title: o.title,
    description: o.description,
    duration: o.duration,
    instructor: o.instructor,
    modules: (o.modules || []).map((m) => ({ id: m._id, title: m.title, content: m.content, videoUrl: m.videoUrl || '' })),
    quiz: (o.quiz || []).map((q) => ({ question: q.question, options: q.options, correctIndex: q.correctIndex })),
  };
};

export default mongoose.model('Course', courseSchema);
