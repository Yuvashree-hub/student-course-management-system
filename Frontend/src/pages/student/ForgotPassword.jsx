import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../../components/FormField';
import Alert from '../../components/Alert';
import useForm from '../../hooks/useForm';
import { forgotPassword } from '../../api/authApi';
import { validateForgotForm } from '../../utils/validation';
import { errorMessage } from '../../utils/format';

export default function ForgotPassword() {
  const { values, field, touchAll, isValid } = useForm({ email: '' }, validateForgotForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [devLink, setDevLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevLink('');
    touchAll();
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await forgotPassword(values.email);
      setSuccess(res.message);
      if (res.devResetLink) setDevLink(res.devResetLink); // only present when running locally without email set up
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-card">
        <h2>Forgot Password</h2>
        <p className="subtitle">Enter your account email and we&apos;ll send you a link to reset your password.</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Email Address" type="email" autoComplete="email" {...field('email')} />
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <Alert type="success">{success}</Alert>
        {success && <p className="muted center small">The link is valid for 15 minutes. Check your spam folder if you don&apos;t see it.</p>}
        {devLink && (
          <Alert type="info">
            Email is not configured on this server (local testing). <a href={devLink}>Open reset link</a>
          </Alert>
        )}
        <Alert type="error">{error}</Alert>

        <p className="form-footer">
          Remembered it? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </section>
  );
}
