import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormField from '../../components/FormField';
import Alert from '../../components/Alert';
import useForm from '../../hooks/useForm';
import { loginUser, clearAuthError } from '../../store/authSlice';
import { validateLoginForm } from '../../utils/validation';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((s) => s.auth);
  const [success, setSuccess] = useState('');
  const expired = new URLSearchParams(location.search).get('expired');

  const { field, touchAll, isValid } = useForm({ email: '', password: '' }, validateLoginForm);

  useEffect(() => () => { dispatch(clearAuthError()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    touchAll();
    if (!isValid) return; // block submission when invalid
    const values = { email: field('email').value, password: field('password').value };
    const res = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(res)) {
      setSuccess('Login successful! Redirecting...');
      const role = res.payload.user.role;
      setTimeout(() => navigate(role === 'admin' ? '/admin/dashboard' : location.state?.from || '/dashboard', { replace: true }), 500);
    }
  };

  return (
    <section className="login-section">
      <div className="login-card">
        <h2>Student Login</h2>
        <p className="subtitle">Welcome back! Log in to continue your courses.</p>

        {expired && <Alert type="info">Your session expired. Please log in again.</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Email Address" type="email" autoComplete="email" {...field('email')} />
          <FormField label="Password" type="password" autoComplete="current-password" {...field('password')} />
          <p className="forgot-link"><Link to="/forgot-password">Forgot password?</Link></p>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading || !!success}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <Alert type="success">{success}</Alert>
        <Alert type="error">{error}</Alert>

        <p className="form-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  );
}
