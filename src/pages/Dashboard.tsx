import { useCallback } from 'react';
import { Inbox } from 'lucide-react';

export default function Dashboard() {
  const openWhatsApp = useCallback(() => {
    // NOTE: Remplacer par le numéro WhatsApp officiel TRASIT (format international sans +)
    const trasitWhatsAppNumber = '0000000000';
    const url = `https://wa.me/${trasitWhatsAppNumber}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className="bg-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A' }}>
          Bienvenue sur votre espace TRASIT
        </h1>

        <div className="flex items-center justify-center mt-12">
          <div
            style={{
              width: '100%',
              maxWidth: '720px',
              background: '#F5F5F5',
              border: '1px solid #DDDDDD',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <div className="flex justify-center">
              <Inbox size={40} style={{ color: '#1A1A1A' }} aria-hidden />
            </div>

            <div className="mt-5" style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
              Aucune mission en cours
            </div>
            <div className="mt-3" style={{ fontSize: '18px', fontWeight: 400, color: '#0D2F4A' }}>
              Soumettez votre première demande via WhatsApp.
            </div>

            <button
              type="button"
              onClick={openWhatsApp}
              style={{
                marginTop: '22px',
                background: '#8B1A1A',
                color: 'white',
                fontSize: '18px',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '14px 32px',
              }}
            >
              Soumettre une demande
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

