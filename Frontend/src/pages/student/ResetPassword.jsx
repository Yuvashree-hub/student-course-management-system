import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormField from '../../components/FormField';
import Alert from '../../components/Alert';
import useForm from '../../hooks/useForm';
import { resetPassword } from '../../api/authApi';
import { validateResetForm } from '../../utils/validation';
import { errorMessage } from '../../utils/format';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { values, field, touchAll, isValid } = useForm({ password: '', confirmPassword: '' }, validateResetForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    touchAll();
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await resetPassword(token, values.password);
      setSuccess(`${res.message} Redirecting to login...`);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-card">
        <h2>Reset Password</h2>
        <p className="subtitle">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="New Password (min 8 characters)" type="password" autoComplete="new-password" {...field('password')} />
          <FormField label="Confirm New Password" type="password" autoComplete="new-password" {...field('confirmPassword')} />
          <button type="submit" className="btn btn-primary btn-full" disabled={loading || !!success}>
            {loading ? 'Saving...' : 'Reset Password'}
          </button>
        </form>

        <Alert type="success">{success}</Alert>
        <Alert type="error">{error}</Alert>
        {error && <p className="form-footer"><Link to="/forgot-password">Request a new reset link</Link></p>}

        <p className="form-footer"><Link to="/login">Back to login</Link></p>
      </div>
    </section>
  );
}
