import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setResetMessage('');
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
      setError("Impossible d'envoyer l'email. Vérifiez votre adresse.");
    }
  };

  return (
    <>
      <style>{`input::placeholder { font-size: 20px !important; color: #1A1A1A !important; opacity: 1 !important; }`}</style>
      <div style={{ minHeight: '100vh', background: '#FFFFFF', padding: '48px 24px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#1A1A1A' }}>
            tras<span style={{ color: '#8B1A1A' }}>·</span>it
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginTop: '32px' }}>
            Se connecter
          </h1>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div>
              <label
                htmlFor="connexion-email"
                style={{ display: 'block', fontSize: '20px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}
              >
                Email
              </label>
              <input
                id="connexion-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setResetMessage('');
                }}
                style={{
                  border: '1px solid #1A1A1A',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  fontSize: '20px',
                  color: '#1A1A1A',
                  backgroundColor: '#FFFFFF',
                  width: '100%',
                  boxSizing: 'border-box' as 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label
                  htmlFor="connexion-password"
                  style={{ display: 'block', fontSize: '20px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}
                >
                  Mot de passe
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="connexion-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      border: '1px solid #1A1A1A',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      fontSize: '20px',
                      color: '#1A1A1A',
                      backgroundColor: '#FFFFFF',
                      width: '100%',
                      boxSizing: 'border-box' as 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '20px',
                      color: '#1A1A1A',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      lineHeight: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={22} style={{ color: '#1A1A1A' }} /> : <Eye size={22} style={{ color: '#1A1A1A' }} />}
                  </button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{
                    fontSize: '20px',
                    color: '#1E5FA6',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>
            {error ? (
              <div style={{ fontSize: '20px', fontWeight: 400, color: '#8B1A1A', textAlign: 'center' }}>
                {error}
              </div>
            ) : null}
            {resetMessage ? (
              <div style={{ fontSize: '20px', fontWeight: 400, color: '#065F46', textAlign: 'center' }}>
                {resetMessage}
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#8B1A1A',
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '8px',
                boxSizing: 'border-box',
              }}
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
