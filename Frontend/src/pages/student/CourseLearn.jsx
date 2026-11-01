import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import Alert from '../../components/Alert';
import Quiz from '../../components/Quiz';
import { getLearning, completeModuleApi, submitQuizApi } from '../../api/learningApi';
import { fetchMyEnrollments } from '../../store/enrollmentSlice';
import { errorMessage } from '../../utils/format';

// Learning page: modules on the left, lesson or quiz on the right.
// Enroll -> read all modules -> quiz unlocks -> pass (3/5) -> course completed -> certificate.
export default function CourseLearn() {
  const { enrollmentId } = useParams();
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState(null); // a module id, or 'quiz'
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [result, setResult] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getLearning(enrollmentId);
      setData(res);
      const next = res.course.modules.find((m) => !m.completed) || res.course.modules[0];
      setView((v) => v || (res.quiz ? 'quiz' : next?.id || null));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) return <Loader text="Opening your course..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const { course, enrollment, quiz, unlocked } = data;
  const completed = enrollment.status === 'Completed';
  const modules = course.modules;
  const current = modules.find((m) => m.id === view);
  const currentIndex = modules.findIndex((m) => m.id === view);

  const syncEnrollments = () => dispatch(fetchMyEnrollments());

  const markComplete = async (moduleId) => {
    setBusy(true);
    setActionError('');
    try {
      const res = await completeModuleApi(enrollmentId, moduleId);
      setData(res);
      const nextModule = res.course.modules.find((m) => !m.completed);
      if (nextModule) setView(nextModule.id);
      else if (res.quiz) setView('quiz'); // everything read: go to the quiz
      syncEnrollments();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const submitQuiz = async (answers) => {
    setBusy(true);
    setActionError('');
    try {
      const res = await submitQuizApi(enrollmentId, answers);
      setResult(res.result);
      setData(res);
      syncEnrollments();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const quizLabel = completed ? '✅ Quiz passed' : unlocked ? '📝 Final Quiz' : '🔒 Final Quiz';

  return (
    <section className="container page">
      <Link to="/learning" className="muted">← Back to My Learning</Link>

      <div className="learn-head">
        <div>
          <h1>{course.title}</h1>
          <p className="muted">{course.instructor} · {course.duration}</p>
        </div>
        <div className="learn-progress">
          <span className={`badge badge-${enrollment.status.replace(/\s/g, '').toLowerCase()}`}>{enrollment.status}</span>
          <progress value={enrollment.progress} max="100" />
          <small>{enrollment.progress}% complete</small>
        </div>
      </div>

      {completed && (
        <div className="alert alert-success learn-banner">
          🎉 Course completed{enrollment.bestScore ? ` - best quiz score ${enrollment.bestScore}/5` : ''}.{' '}
          <Link to={`/certificate/${enrollmentId}`} className="btn btn-gold btn-sm">🎓 View Certificate</Link>
        </div>
      )}
      <Alert type="error">{actionError}</Alert>

      {modules.length === 0 ? (
        <div className="state-box">
          <h3>Course content is coming soon</h3>
          <p>The instructor has not added lessons to this course yet. Please check back later.</p>
        </div>
      ) : (
        <div className="learn">
          <aside className="learn-side" aria-label="Course modules">
            <ol className="module-list">
              {modules.map((m, i) => (
                <li key={m.id}>
                  <button className={`module-item ${view === m.id ? 'selected' : ''} ${m.completed ? 'done' : ''}`} onClick={() => setView(m.id)}>
                    <span className="module-num">{m.completed ? '✓' : i + 1}</span>
                    <span>{m.title}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  className={`module-item ${view === 'quiz' ? 'selected' : ''} ${completed ? 'done' : ''}`}
                  disabled={!unlocked}
                  onClick={() => setView('quiz')}
                  title={unlocked ? '' : 'Finish all modules to unlock the quiz'}
                >
                  <span>{quizLabel}</span>
                </button>
              </li>
            </ol>
          </aside>

          <div className="learn-main">
            {view === 'quiz' ? (
              completed && !result ? (
                <div className="quiz-result pass">
                  <h2>✅ Quiz passed</h2>
                  <p>You have already passed this course.</p>
                  <Link to={`/certificate/${enrollmentId}`} className="btn btn-gold">🎓 View Certificate</Link>
                </div>
              ) : quiz ? (
                <Quiz
                  key={enrollment.quizAttempts}
                  quiz={quiz}
                  busy={busy}
                  result={result}
                  enrollmentId={enrollmentId}
                  onSubmit={submitQuiz}
                  onRetry={() => setResult(null)}
                />
              ) : result?.passed ? (
                <div className="quiz-result pass">
                  <h2>🎉 You passed!</h2>
                  <p className="quiz-score">{result.score} / {result.total}</p>
                  <Link to={`/certificate/${enrollmentId}`} className="btn btn-gold">🎓 View Certificate</Link>
                </div>
              ) : (
                <div className="state-box"><p>The quiz for this course has not been added yet. Please check back later.</p></div>
              )
            ) : current ? (
              <article className="lesson">
                <p className="muted">Module {currentIndex + 1} of {modules.length}</p>
                <h2>{current.title}</h2>
                {current.content.split(/\n{2,}/).map((para, i) => (
                  <p key={i} className="lesson-text">{para}</p>
                ))}
                {current.videoUrl && (
                  <p><a className="btn btn-secondary" href={current.videoUrl} target="_blank" rel="noopener noreferrer">▶ Watch video</a></p>
                )}

                <div className="btn-row">
                  {currentIndex > 0 && <button className="btn btn-secondary" onClick={() => setView(modules[currentIndex - 1].id)}>← Previous</button>}
                  {!current.completed ? (
                    <button className="btn btn-primary" disabled={busy || completed} onClick={() => markComplete(current.id)}>
                      {busy ? 'Saving...' : 'Mark module as complete'}
                    </button>
                  ) : (
                    <span className="badge badge-completed lesson-done">✓ Module completed</span>
                  )}
                  {currentIndex < modules.length - 1 && <button className="btn btn-secondary" onClick={() => setView(modules[currentIndex + 1].id)}>Next →</button>}
                  {currentIndex === modules.length - 1 && unlocked && !completed && quiz && (
                    <button className="btn btn-gold" onClick={() => setView('quiz')}>Go to Quiz →</button>
                  )}
                </div>
              </article>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
