import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import logger from '../../utils/logger';

export default function Login() {
  const { login } = useAuth();
  const [psaId, setPsaId] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(psaId, password);
      logger.info('Login success', { psaId });
    } catch {
      setErr('Invalid credentials');
      logger.warn('Login failed', { psaId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        PSA ID
        <input type="text" value={psaId} onChange={e => setPsaId(e.target.value)} placeholder="PSA ID" autoComplete="username" />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" />
      </label>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
