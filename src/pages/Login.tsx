import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch {
      setError('Email ou mot de passe incorrect.');
    }
  };

  const handleForgotPassword = async () => {
    setResetMessage('');
    setError('');
    if (!email.trim()) {
      setError('Veuillez saisir votre email.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Un email de réinitialisation a été envoyé.');
    } catch {
      setError('Impossible d\'envoyer l\'email. Vérifiez votre adresse.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
      <div style={{ width: '100%', maxWidth: '480px', padding: '48px 32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', textAlign: 'center', marginBottom: '40px' }}>Se connecter</h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '20px', fontWeight: '600', color: '#1A1A1A', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', fontSize: '20px', color: '#1A1A1A', border: '1px solid #1A1A1A', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '20px', fontWeight: '600', color: '#1A1A1A', marginBottom: '8px' }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 48px 14px 16px', fontSize: '20px', color: '#1A1A1A', border: '1px solid #1A1A1A', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#1E5FA6', textDecoration: 'underline' }}>
              Mot de passe oublié ?
            </button>
          </div>

          {error && <p style={{ fontSize: '16px', color: '#8B1A1A', marginBottom: '16px' }}>{error}</p>}
          {resetMessage && <p style={{ fontSize: '16px', color: '#065F46', marginBottom: '16px' }}>{resetMessage}</p>}

          <button type="submit" style={{ width: '100%', padding: '16px', fontSize: '20px', fontWeight: '700', color: '#FFFFFF', backgroundColor: '#8B1A1A', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
