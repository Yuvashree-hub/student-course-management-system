import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormField from '../../components/FormField';
import Alert from '../../components/Alert';
import useForm from '../../hooks/useForm';
import { loginUser, logout, clearAuthError } from '../../store/authSlice';
import { validateLoginForm } from '../../utils/validation';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [localError, setLocalError] = useState('');
  const { field, touchAll, isValid } = useForm({ email: '', password: '' }, validateLoginForm);

  useEffect(() => () => { dispatch(clearAuthError()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    touchAll();
    if (!isValid) return;
    const res = await dispatch(loginUser({ email: field('email').value, password: field('password').value }));
    if (loginUser.fulfilled.match(res)) {
      if (res.payload.user.role !== 'admin') {
        dispatch(logout());
        setLocalError('This account does not have admin access.');
        return;
      }
      navigate('/admin/dashboard', { replace: true });
    }
  };

  return (
    <section className="login-section">
      <div className="login-card admin-card">
        <h2>Admin Portal Login</h2>
        <p className="subtitle"></p>
        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Admin Email" type="email" placeholder="admin@acadexa.com" {...field('email')} />
          <FormField label="Password" type="password" {...field('password')} />
          <p className="forgot-link"><Link to="/forgot-password">Forgot password?</Link></p>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Signing in...' : 'Login to Admin Console'}</button>
        </form>
        <Alert type="error">{localError || error}</Alert>
      </div>
    </section>
  );
}
