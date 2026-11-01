import { useState } from 'react';
import { Link } from 'react-router-dom';

// 5-question multiple-choice quiz. Grading happens on the server - this component only
// collects the answers and shows the result it receives.
export default function Quiz({ quiz, busy, result, enrollmentId, onSubmit, onRetry }) {
  const [answers, setAnswers] = useState(() => Array(quiz.total).fill(null));
  const allAnswered = answers.every((a) => a !== null);

  const choose = (qIndex, optIndex) => setAnswers((prev) => prev.map((a, i) => (i === qIndex ? optIndex : a)));
  const retry = () => {
    setAnswers(Array(quiz.total).fill(null));
    onRetry();
  };

  if (result) {
    return (
      <div className={`quiz-result ${result.passed ? 'pass' : 'fail'}`} role="status">
        <h2>{result.passed ? '🎉 You passed!' : 'Not passed yet'}</h2>
        <p className="quiz-score">{result.score} / {result.total}</p>
        {result.passed ? (
          <>
            <p>Congratulations! You completed the course. Your certificate is ready.</p>
            <Link to={`/certificate/${enrollmentId}`} className="btn btn-gold">🎓 View Certificate</Link>
          </>
        ) : (
          <>
            <p>You need at least {result.passMark} correct answers to pass.</p>
            {result.wrong.length > 0 && (
              <p>Review these questions: <strong>{result.wrong.map((i) => `Q${i + 1}`).join(', ')}</strong>. You can re-read the modules and try again - there is no limit on attempts.</p>
            )}
            <button className="btn btn-primary" onClick={retry}>Try Again</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="quiz">
      <h2>Final Quiz</h2>
      <p className="muted">Answer all {quiz.total} questions. You need {quiz.passMark} correct to pass and earn your certificate.</p>

      {quiz.questions.map((q) => (
        <fieldset key={q.index} className="quiz-q">
          <legend>{q.index + 1}. {q.question}</legend>
          {q.options.map((opt, oi) => (
            <label key={oi} className={`quiz-opt ${answers[q.index] === oi ? 'chosen' : ''}`}>
              <input type="radio" name={`q${q.index}`} checked={answers[q.index] === oi} onChange={() => choose(q.index, oi)} />
              <span>{opt}</span>
            </label>
          ))}
        </fieldset>
      ))}

      <button className="btn btn-primary" disabled={!allAnswered || busy} onClick={() => onSubmit(answers)}>
        {busy ? 'Submitting...' : allAnswered ? 'Submit Quiz' : `Answer all questions (${answers.filter((a) => a !== null).length}/${quiz.total})`}
      </button>
    </div>
  );
}
