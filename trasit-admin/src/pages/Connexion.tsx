import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <>
      <style>{`input::placeholder { color: #1A1A1A !important; opacity: 1 !important; }`}</style>
      <div style={{ minHeight: '100vh', background: 'white', padding: '48px 24px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#1A1A1A' }}>
            tras<span style={{ color: '#8B1A1A' }}>·</span>it
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginTop: '32px' }}>
            Se connecter
          </h1>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                height: '52px',
                fontSize: '16px',
                border: '1px solid #DDDDDD',
                borderRadius: '8px',
                padding: '0 16px',
                color: '#1A1A1A',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '52px',
                  fontSize: '16px',
                  border: '1px solid #DDDDDD',
                  borderRadius: '8px',
                  padding: '0 48px 0 16px',
                  color: '#1A1A1A',
                  boxSizing: 'border-box',
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
                  color: '#1A1A1A',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  lineHeight: 0,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                width: '100%',
                height: '52px',
                background: '#8B1A1A',
                color: 'white',
                fontSize: '18px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '8px',
              }}
            >
              Se connecter
            </button>
            {error ? (
              <div style={{ fontSize: '16px', fontWeight: 400, color: '#8B1A1A', textAlign: 'center' }}>
                {error}
              </div>
            ) : null}
          </div>
          <div style={{ marginTop: '32px' }}>
            <Link to="/inscription" style={{ fontSize: '16px', color: '#0D2F4A' }}>
              Pas encore de compte ? S&apos;inscrire
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
