import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Agrobusiness() {
  const navigate = useNavigate();
  const steps = [
    {
      n: '1',
      title: 'Vous remplissez la fiche de mission',
      text: 'Adresse exacte, nom du prestataire agro, ce que vous souhaitez documenter. Plus votre fiche est précise, plus le rapport est utile.',
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
          style={{ display: 'flex', alignItems: 'stretch', width: '100%', minHeight: '520px' }}
        >
          <div style={{ width: '40%', display: 'flex', flexDirection: 'column', flexShrink: 0, minHeight: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1535090467336-9501f96eef89?w=1400&auto=format&fit=crop"
              alt="Agrobusiness"
              style={{ flex: 1, width: '100%', objectFit: 'cover', display: 'block', minHeight: 0 }}
            />
            <img
              src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1400&auto=format&fit=crop"
              alt="Élevage"
              style={{ flex: 1, width: '100%', objectFit: 'cover', display: 'block', minHeight: 0 }}
            />
          </div>

          <div
            style={{
              width: '60%',
              padding: '48px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: 0,
              overflowY: 'auto',
            }}
          >
            <h1 style={{ fontSize: '52px', fontWeight: 800, color: '#1A1A1A', marginBottom: '20px' }}>
              Agrobusiness &amp; Élevage
            </h1>
            <p style={{ fontSize: '32px', fontWeight: 600, color: '#1E5FA6', marginBottom: '32px' }}>
              Ce que votre prestataire vous déclare. Ce que TRASIT observe.
            </p>

            <p style={{ fontSize: '22px', color: '#1A1A1A', lineHeight: '1.8', marginBottom: '24px' }}>
              L&apos;agrobusiness attire. Les rendements annoncés séduisent. Mais entre le nombre d&apos;animaux déclaré et celui
              réellement présent, entre le stade annoncé et ce que montre le terrain — l&apos;écart peut représenter des mois
              de revenus perdus.
            </p>
            <p style={{ fontSize: '22px', color: '#1A1A1A', lineHeight: '1.8', marginBottom: '32px' }}>
              L&apos;agent se présente sur place avec votre accord express. Il documente ce qu&apos;il voit de manière factuelle
              et indépendante. État sanitaire apparent des animaux, stade de développement et état général des cultures
              documentés visuellement.
            </p>

            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>Ce que vous recevez :</p>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {[
                'Comptage visuel des animaux présents',
                'État sanitaire et nutritionnel apparent',
                'Rapport factuel livré en moins de 2 heures',
              ].map((item) => (
                <li key={item} style={{ fontSize: '22px', color: '#1A1A1A', marginBottom: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#2E8B57', fontSize: '22px' }}>✅</span>
                    <span>{item}</span>
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
                      <div style={{ fontSize: '20px', color: '#1A1A1A', lineHeight: '1.8' }}>{s.text}</div>
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

