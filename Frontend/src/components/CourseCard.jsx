import { Link } from 'react-router-dom';

// Reusable card used on Home, Courses, Dashboard and Learning pages.
//  - `enrollment` present  -> shows progress + "Continue Learning"
//  - otherwise             -> shows an Enroll / Login-to-enroll action
export default function CourseCard({ course, enrollment, user, onEnroll, enrolling }) {
  const { title, description, duration, instructor } = course;
  const isStudent = user?.role === 'student';

  return (
    <article className="course-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="course-info">
        <span><strong>Duration:</strong> {duration}</span>
        {instructor && <span><strong>Instructor:</strong> {instructor}</span>}
        {course.moduleCount !== undefined && (
          <span>{course.moduleCount > 0 ? `${course.moduleCount} modules${course.quizReady ? ' + final quiz' : ''}` : 'Content coming soon'}</span>
        )}
      </div>

      {enrollment ? (
        <>
          <div className="progress-wrap">
            <p>
              <span className={`badge badge-${enrollment.status.replace(/\s/g, '').toLowerCase()}`}>{enrollment.status}</span>{' '}
              <strong>{enrollment.progress}%</strong>
            </p>
            <progress value={enrollment.progress} max="100" />
          </div>
          {enrollment.status === 'Completed' ? (
            <Link to={`/certificate/${enrollment.id}`} className="btn btn-gold">🎓 View Certificate</Link>
          ) : (
            <Link to={`/learn/${enrollment.id}`} className="btn btn-primary">Continue Learning</Link>
          )}
        </>
      ) : isStudent ? (
        <button className="btn btn-primary" onClick={() => onEnroll?.(course)} disabled={enrolling}>
          {enrolling ? 'Enrolling...' : 'Enroll Now'}
        </button>
      ) : !user ? (
        <Link to="/login" className="btn btn-primary">Login to Enroll</Link>
      ) : null}
    </article>
  );
}
