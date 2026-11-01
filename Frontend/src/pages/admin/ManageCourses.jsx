import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormField from '../../components/FormField';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import Alert from '../../components/Alert';
import useForm from '../../hooks/useForm';
import { fetchCourses, addCourse, editCourse, removeCourse } from '../../store/courseSlice';
import { getCourseFull } from '../../api/courseApi';
import { validateCourseForm, validateCourseContent } from '../../utils/validation';
import { errorMessage } from '../../utils/format';

const blank = { title: '', duration: '', instructor: '', description: '' };
const blankModule = () => ({ title: '', content: '', videoUrl: '' });
const blankQuestion = () => ({ question: '', options: ['', '', '', ''], correctIndex: 0 });
const blankQuiz = () => Array.from({ length: 5 }, blankQuestion);
const isBlankQuestion = (q) => !q.question.trim() && q.options.every((o) => !o.trim());

export default function ManageCourses() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.courses);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [modules, setModules] = useState([]);
  const [quiz, setQuiz] = useState(blankQuiz());
  const { values, field, touchAll, reset, isValid } = useForm(blank, validateCourseForm);

  useEffect(() => { dispatch(fetchCourses()); }, [dispatch]);

  // ---- modules editor ----
  const updateModule = (i, key, val) => setModules((ms) => ms.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)));
  const addModule = () => setModules((ms) => [...ms, blankModule()]);
  const removeModule = (i) => setModules((ms) => ms.filter((_, idx) => idx !== i));

  // ---- quiz editor (always 5 slots) ----
  const updateQuestion = (i, patch) => setQuiz((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const updateOption = (qi, oi, val) =>
    setQuiz((qs) => qs.map((q, idx) => (idx === qi ? { ...q, options: q.options.map((o, k) => (k === oi ? val : o)) } : q)));

  const resetEditor = () => {
    setEditingId(null);
    reset(blank);
    setModules([]);
    setQuiz(blankQuiz());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    touchAll();
    if (!isValid) return;

    // an untouched quiz means "no quiz yet"; otherwise all 5 questions must be complete
    const quizPayload = quiz.every(isBlankQuestion)
      ? []
      : quiz.map((q) => ({ question: q.question.trim(), options: q.options.map((o) => o.trim()), correctIndex: q.correctIndex }));
    const modulesPayload = modules.map((m) => ({ ...m, title: m.title.trim(), content: m.content.trim(), videoUrl: m.videoUrl.trim() }));

    const problem = validateCourseContent(modulesPayload, quizPayload);
    if (problem) {
      setMessage({ type: 'error', text: problem });
      return;
    }

    setSaving(true);
    const data = { ...values, modules: modulesPayload, quiz: quizPayload };
    const res = await dispatch(editingId ? editCourse({ id: editingId, data }) : addCourse(data));
    setSaving(false);
    if (res.error) {
      setMessage({ type: 'error', text: res.payload || 'Could not save course' });
    } else {
      setMessage({ type: 'success', text: editingId ? 'Course updated.' : 'Course added. Students were notified in real time.' });
      resetEditor();
    }
  };

  const startEdit = async (c) => {
    setMessage({ type: '', text: '' });
    try {
      const { course } = await getCourseFull(c.id); // includes lesson text + correct answers (admin only)
      setEditingId(course.id);
      reset({ title: course.title, duration: course.duration, instructor: course.instructor || '', description: course.description });
      setModules(course.modules.map((m) => ({ id: m.id, title: m.title, content: m.content, videoUrl: m.videoUrl || '' })));
      setQuiz(course.quiz.length === 5 ? course.quiz.map((q) => ({ ...q, options: [...q.options] })) : blankQuiz());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({ type: 'error', text: errorMessage(err) });
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete "${c.title}"? All enrollments for this course will be removed too.`)) return;
    const res = await dispatch(removeCourse(c.id));
    setMessage(res.error ? { type: 'error', text: res.payload } : { type: 'success', text: 'Course deleted.' });
  };

  return (
    <section className="container page">
      <h1>Manage Platform Courses</h1>

      <form onSubmit={handleSubmit} noValidate className="panel">
        <h3>{editingId ? 'Edit Course' : 'Add New Course'}</h3>
        <div className="form-grid">
          <FormField label="Course Title" {...field('title')} />
          <FormField label="Duration (e.g. 6 Weeks)" {...field('duration')} />
          <FormField label="Instructor" {...field('instructor')} />
        </div>
        <FormField label="Description" as="textarea" rows={3} {...field('description')} />

        <h4 className="editor-heading">📚 Learning modules</h4>
        <p className="muted small">Students read these in order and mark each one complete. You can add as many as you need.</p>
        {modules.map((m, i) => (
          <div key={i} className="editor-card">
            <div className="row-between">
              <strong>Module {i + 1}</strong>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeModule(i)}>Remove</button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input value={m.title} onChange={(e) => updateModule(i, 'title', e.target.value)} maxLength={120} />
            </div>
            <div className="form-group">
              <label>Lesson content (leave a blank line between paragraphs)</label>
              <textarea rows={5} value={m.content} onChange={(e) => updateModule(i, 'content', e.target.value)} maxLength={5000} />
            </div>
            <div className="form-group">
              <label>Video link (optional, https://...)</label>
              <input value={m.videoUrl} onChange={(e) => updateModule(i, 'videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={addModule}>+ Add module</button>

        <h4 className="editor-heading">📝 Final quiz (exactly 5 questions)</h4>
        <p className="muted small">
          Students unlock the quiz after finishing every module and need 3 correct answers to pass. Select the round button next to the correct option.
          Leave all 5 questions empty if you don&apos;t want a quiz yet - but students can only get a certificate when the quiz exists.
        </p>
        {quiz.map((q, qi) => (
          <div key={qi} className="editor-card">
            <strong>Question {qi + 1}</strong>
            <div className="form-group">
              <input value={q.question} onChange={(e) => updateQuestion(qi, { question: e.target.value })} placeholder="Type the question" maxLength={300} aria-label={`Question ${qi + 1}`} />
            </div>
            {q.options.map((opt, oi) => (
              <div key={oi} className="option-row">
                <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi} onChange={() => updateQuestion(qi, { correctIndex: oi })} aria-label={`Mark option ${oi + 1} as correct`} />
                <input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} maxLength={150} aria-label={`Question ${qi + 1} option ${oi + 1}`} />
              </div>
            ))}
          </div>
        ))}

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Course'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={resetEditor}>Cancel</button>}
        </div>
        <Alert type={message.type || 'info'}>{message.text}</Alert>
      </form>

      {loading && list.length === 0 ? (
        <Loader text="Loading courses..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => dispatch(fetchCourses())} />
      ) : (
        <div className="course-grid">
          {list.map((c) => (
            <article key={c.id} className="course-card">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <p className="course-info">
                <span><strong>Duration:</strong> {c.duration}</span>
                <span><strong>Instructor:</strong> {c.instructor}</span>
                <span><strong>Content:</strong> {c.moduleCount || 0} modules · {c.quizReady ? 'quiz ready ✅' : 'no quiz ⚠️'}</span>
              </p>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={() => startEdit(c)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(c)}>Delete</button>
              </div>
            </article>
          ))}
          {list.length === 0 && <p className="muted center">No courses yet. Add your first one above.</p>}
        </div>
      )}
    </section>
  );
}
