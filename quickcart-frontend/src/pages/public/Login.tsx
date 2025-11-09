import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as authService from '../../services/authService';
import styles from './Login.module.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Call the auth service to get the token
      const data = await authService.login({ email, password });

      // 2. Call the context's login function AND WAIT for it to finish
      const user = await login(data.token);

      // 3. NOW we are authenticated and can use the user object
      // --- FIX 2: Use the 'user' variable for role-based redirection ---
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        // If the user is a 'CUSTOMER' or 'DELIVERY_PARTNER'
        navigate('/my-account'); // Redirect non-admins to their account page
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p>Login to your QuickCart Admin</p>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            // --- FIX 1: Corrected typo from 'e.targe' to 'e.target' ---
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;