import { Link } from 'react-router-dom';

export default function Inscription() {
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
            tras<span style={{ color: '#8B1A1A' }}>·</span>it
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
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
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
            type="password"
            name="passwordConfirm"
            placeholder="Confirmation mot de passe"
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

          <button
            type="button"
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
        </form>

        <div className="mt-8 text-center">
          <Link to="/" style={{ fontSize: '16px', color: '#0D2F4A' }}>
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

