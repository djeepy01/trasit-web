import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function Inscription() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigate = useNavigate();

  const getFirebaseAuthErrorMessage = (code?: string, message?: string) => {
    if (code === 'auth/email-already-in-use') return 'Cette adresse email est déjà utilisée.';
    if (code === 'auth/invalid-email') return 'Adresse email invalide.';
    if (code === 'auth/weak-password') return 'Mot de passe trop faible. Minimum 6 caractères.';
    if (code === 'auth/too-many-requests') return 'Trop de tentatives. Réessayez dans quelques minutes.';
    if (code === 'auth/network-request-failed') return 'Erreur réseau. Vérifiez votre connexion.';
    return `Erreur lors de la création du compte.${message ? ` (${message})` : ''}`;
  };

  const handleSubmit = async () => {
    if (password !== passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err?.code, err?.message);
      setError(getFirebaseAuthErrorMessage(err?.code, err?.message));
    }
  };

  return (
    <>
      <style>{`
        input::placeholder {
          color: #1A1A1A !important;
          opacity: 1 !important;
        }
      `}</style>
      <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-[480px] mx-auto">
        <div className="text-center">
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#1A1A1A' }}>
            tras<span style={{ color: '#8B1A1A', fontSize: '36px' }}>·</span>it
          </div>
          <h1 className="mt-8" style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A' }}>
            Créer votre compte
          </h1>
        </div>

        <form className="mt-10 space-y-4" style={{ width: '100%' }}>
          <input
            type="text"
            name="fullName"
            placeholder="Nom complet"
            style={{
              width: '100%',
              height: '52px',
              fontSize: '16px',
              border: '1px solid #DDDDDD',
              borderRadius: '8px',
              padding: '0 16px',
              color: '#1A1A1A',
            }}
          />
          <input
            type="email"
            name="email"
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
            }}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Téléphone"
            style={{
              width: '100%',
              height: '52px',
              fontSize: '16px',
              border: '1px solid #DDDDDD',
              borderRadius: '8px',
              padding: '0 16px',
              color: '#1A1A1A',
            }}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
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

          <div style={{ position: 'relative' }}>
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              name="passwordConfirm"
              placeholder="Confirmation mot de passe"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              style={{
                width: '100%',
                height: '52px',
                fontSize: '16px',
                border: '1px solid #DDDDDD',
                borderRadius: '8px',
                padding: '0 48px 0 16px',
                color: '#1A1A1A',
              }}
            />
            <button
              type="button"
              aria-label={showPasswordConfirm ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'}
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
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
              {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
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
            }}
          >
            Créer mon compte
          </button>
          {error ? (
            <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 400, color: '#8B1A1A' }}>
              {error}
            </div>
          ) : null}
        </form>

        <div className="mt-8 text-center">
          <Link to="/connexion" style={{ fontSize: '16px', color: '#0D2F4A' }}>
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

