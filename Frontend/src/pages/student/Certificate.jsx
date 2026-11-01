import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import { fetchMyEnrollments } from '../../store/enrollmentSlice';

const longDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

// Printable course-completion certificate. "Print / Save as PDF" uses the browser's print dialog.
export default function Certificate() {
  const { enrollmentId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { list, loading, loaded, error } = useSelector((s) => s.enrollments);

  // Needed when the page is opened directly or refreshed
  useEffect(() => {
    if (!loaded) dispatch(fetchMyEnrollments());
  }, [dispatch, loaded]);

  if (!loaded && loading) return <Loader text="Preparing your certificate..." />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchMyEnrollments())} />;
  if (!loaded) return <Loader text="Preparing your certificate..." />;

  const enrollment = list.find((e) => e.id === enrollmentId);

  if (!enrollment) {
    return (
      <section className="container page center">
        <h1>Certificate not found</h1>
        <p className="muted">This enrollment does not exist or does not belong to you.</p>
        <p><Link to="/learning" className="btn btn-primary">Back to My Learning</Link></p>
      </section>
    );
  }

  if (enrollment.status !== 'Completed') {
    return (
      <section className="container page center">
        <h1>Certificate not available yet</h1>
        <p className="muted">
          Finish &quot;{enrollment.courseId.title}&quot; (100%) to unlock your certificate. Current progress: {enrollment.progress}%.
        </p>
        <p><Link to="/learning" className="btn btn-primary">Back to My Learning</Link></p>
      </section>
    );
  }

  const course = enrollment.courseId;
  const certificateId = `ACX-${enrollment.id.slice(-8).toUpperCase()}`;

  return (
    <section className="container page cert-page">
      <div className="cert-toolbar">
        <Link to="/learning" className="btn btn-secondary">← Back</Link>
        <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print / Save as PDF</button>
      </div>
      <p className="muted center cert-hint">
        Tip: in the print window choose <strong>Save as PDF</strong> as the destination, and set <strong>Layout: Landscape</strong>.
      </p>

      <div className="cert" id="certificate">
        <div className="cert-inner">
          <p className="cert-brand">ACADEXA</p>
          <h1 className="cert-title">Certificate of Completion</h1>
          <p className="cert-text">This is proudly presented to</p>
          <h2 className="cert-name">{user.name}</h2>
          <p className="cert-text">for successfully completing the course</p>
          <h3 className="cert-course">{course.title}</h3>
          <p className="cert-text">
            Duration: {course.duration} &nbsp;•&nbsp; Completed on {longDate(enrollment.passedAt || enrollment.updatedAt)}
          </p>

          <div className="cert-footer">
            <div className="cert-sign">
              <span className="cert-line" />
              <p>{course.instructor || 'ACADEXA Faculty'}</p>
              <small>Course Instructor</small>
            </div>
            <div className="cert-seal" aria-hidden="true">★</div>
            <div className="cert-sign">
              <span className="cert-line" />
              <p>{certificateId}</p>
              <small>Certificate ID</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
