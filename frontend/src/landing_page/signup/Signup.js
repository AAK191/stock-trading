import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [mode, setMode] = useState('signup');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function switchMode(newMode) {
    setMode(newMode);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const BACKEND = 'http://localhost:3002';

    const endpoint = mode === 'signup'
  ? `${BACKEND}/api/auth/register`
  : `${BACKEND}/api/auth/login`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(
          mode === 'signup'
            ? formData
            : { email: formData.email, password: formData.password }
        )
      });

      const data = await response.json();
      console.log("Full response data:", data);
console.log("accessToken value:", data.accessToken);
console.log("Type:", typeof data.accessToken);
      if (!response.ok) {
        setError(data.message);
        return;
      }

if (data.accessToken) {
  localStorage.setItem('accessToken', data.accessToken);
  window.location.href = `http://localhost:3001?token=${data.accessToken}`;
}
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <div style={styles.tabRow}>
          <button
            onClick={() => switchMode('signup')}
            style={mode === 'signup' ? styles.activeTab : styles.inactiveTab}
          >
            Sign Up
          </button>
          <button
            onClick={() => switchMode('login')}
            style={mode === 'login' ? styles.activeTab : styles.inactiveTab}
          >
            Login
          </button>
        </div>

        <h2 style={{ marginBottom: '24px' }}>
          {mode === 'signup' ? 'Open a free account' : 'Welcome back'}
        </h2>

        <form onSubmit={handleSubmit}>

          {mode === 'signup' && (
            <div style={styles.field}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Anusha"
                required
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading
              ? (mode === 'signup' ? 'Creating account...' : 'Logging in...')
              : (mode === 'signup' ? 'Sign up for free' : 'Login')
            }
          </button>

        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          {mode === 'signup' ? (
            <>Already have an account?{' '}
              <span style={styles.link} onClick={() => switchMode('login')}>Login</span>
            </>
          ) : (
            <>Don't have an account?{' '}
              <span style={styles.link} onClick={() => switchMode('signup')}>Sign up</span>
            </>
          )}
        </p>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px'
  },
  tabRow: {
    display: 'flex',
    marginBottom: '24px',
    borderBottom: '2px solid #eee'
  },
  activeTab: {
    flex: 1, padding: '10px', background: 'none', border: 'none',
    borderBottom: '2px solid #387ed1', color: '#387ed1',
    fontWeight: 'bold', cursor: 'pointer', marginBottom: '-2px'
  },
  inactiveTab: {
    flex: 1, padding: '10px', background: 'none',
    border: 'none', color: '#999', cursor: 'pointer'
  },
  field: { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  error: { color: 'red', fontSize: '13px', marginBottom: '12px' },
  submitBtn: {
    width: '100%', padding: '12px', background: '#387ed1',
    color: 'white', border: 'none', borderRadius: '4px',
    fontSize: '15px', cursor: 'pointer', marginTop: '4px'
  },
  link: { color: '#387ed1', cursor: 'pointer', textDecoration: 'underline' }
};

export default Signup;