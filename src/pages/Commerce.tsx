import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Commerce() {
  const navigate = useNavigate();
  const steps = [
    {
      n: '1',
      title: 'Vous remplissez la fiche de mission',
      text: 'Adresse exacte, nom du gérant, ce que vous souhaitez documenter. Plus votre fiche est précise, plus le rapport est utile.',
    },
    {
      n: '2',
      title: 'Vous validez et payez',
      text: "Vous confirmez votre fiche et effectuez le paiement en ligne. TRASIT confirme la disponibilité d'un agent dans la zone avant tout déplacement.",
    },
    {
      n: '3',
      title: "L'agent se déplace",
      text: "Avec votre accord express, l'agent se présente sur place. Il suit une checklist précise basée sur votre fiche. Il ne connaît pas votre identité.",
    },
    {
      n: '4',
      title: 'Vous recevez votre rapport',
      text: 'En moins de 2 heures : photos géolocalisées, horodatées, organisées par zone. Un rapport factuel. Vous décidez.',
    },
  ];

  return (
    <>
      <div style={{ background: '#FFFFFF', paddingTop: '80px' }}>
        <section
          style={{
            display: 'flex',
            alignItems: 'stretch',
            minHeight: '520px',
            width: '100%',
          }}
        >
          <div style={{ width: '45%' }}>
            <img
              src="https://images.unsplash.com/photo-1555529771-122e5d9f2341?w=1400&auto=format&fit=crop"
              alt="Commerce et gestion"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ width: '55%', padding: '48px 40px' }}>
            <h1 style={{ fontSize: '52px', fontWeight: 800, color: '#1A1A1A', marginBottom: '20px' }}>
              Commerce &amp; Gestion
            </h1>
            <p style={{ fontSize: '32px', fontWeight: 600, color: '#1E5FA6', marginBottom: '32px' }}>
              Votre commerce tourne. Mais tourne-t-il vraiment pour vous ?
            </p>

            <p style={{ fontSize: '22px', color: '#1A1A1A', lineHeight: 1.8, marginBottom: '24px' }}>
              Déléguer la gestion d&apos;un commerce demande de la confiance. Mais la confiance sans vérification, c&apos;est une
              porte ouverte aux écarts — de stock, de caisse, de présence. Vous méritez un regard indépendant, régulier,
              factuel.
            </p>
            <p style={{ fontSize: '22px', color: '#1A1A1A', lineHeight: 1.8, marginBottom: '32px' }}>
              L&apos;agent se présente sur place avec votre accord express. Il documente ce qu&apos;il voit de manière factuelle
              et indépendante. Présence du personnel, état du stock visible, activité réelle au moment de la visite.
            </p>

            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>Ce que vous recevez :</p>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {[
                'État du stock visible et taux de remplissage',
                'Présence et activité réelle documentées',
                'Rapport factuel livré en moins de 2 heures',
              ].map((item) => (
                <li key={item} style={{ fontSize: '22px', color: '#1A1A1A', marginBottom: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#2E8B57', fontSize: '22px' }}>✅</span>
                    <span style={{ fontSize: '22px' }}>{item}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          style={{
            background: '#EBF2FA',
            padding: '60px 40px',
          }}
        >
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#1A1A1A', marginBottom: '40px' }}>Comment ça marche</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '20px',
              }}
            >
              {steps.map((s) => (
                <div
                  key={s.n}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '20px 18px',
                    border: '1px solid rgba(30,95,166,0.18)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '999px',
                        background: '#1E5FA6',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {s.n}
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '10px' }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: '20px', color: '#1A1A1A', lineHeight: 1.8 }}>{s.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => navigate('/fiche-mission')}
                style={{
                  background: '#8B1A1A',
                  color: '#FFFFFF',
                  fontSize: '17px',
                  fontWeight: 700,
                  padding: '16px 40px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '40px',
                }}
              >
                Soumettre une fiche de mission
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

