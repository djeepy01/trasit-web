import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useNavigate } from 'react-router-dom';

const cards = [
  {
    label: 'CONSTRUCTION & BTP',
    stat: '7/10',
    text: '7 chantiers sur 10 en Afrique n\'atteignent pas leurs objectifs initiaux — délais non respectés, coûts dépassés, qualité insuffisante. Le manque de supervision terrain en est la cause directe.',
    source: 'WEBGRAM · Bernache Conseil',
    image: 'https://images.unsplash.com/photo-1653280662710-1cac52cde6d7?auto=format&fit=crop&w=1400&q=80',
    pills: [
      { label: 'Objectifs non atteints', value: '70%' },
      { label: 'Cause principale', value: 'Absence de suivi' },
    ],
  },
  {
    label: 'AGROBUSINESS & ÉLEVAGE',
    stat: '9/10',
    text: '9 projets agricoles sur 10 échouent en Afrique — fermes avicoles, élevages, plantations. Une fois les fonds versés, personne ne vérifie ce qui se passe réellement sur le terrain.',
    source: 'Banque Mondiale · BAD',
    image: 'https://images.unsplash.com/photo-1773143884070-643dc6f75f44?auto=format&fit=crop&w=1400&q=80',
    pills: [
      { label: 'Taux d\'échec', value: '90%' },
      { label: 'Cause principale', value: 'Zéro contrôle terrain' },
    ],
  },
  {
    label: 'COMMERCE & GESTION',
    stat: '-25%',
    text: 'Dans un commerce non contrôlé, un investisseur peut perdre jusqu\'à 25% de sa marge nette chaque mois — erreurs de caisse non détectées, stock non vérifié, gestion approximative du gérant.',
    source: 'PwC Africa · Kippa',
    image: 'https://images.unsplash.com/photo-1687422808311-a776f467a468?auto=format&fit=crop&w=1400&q=80',
    pills: [
      { label: 'Perte mensuelle', value: '-25%' },
      { label: 'Risque n°1', value: 'Gestion non supervisée' },
    ],
  },
];

function RiskCard({
  card,
  index,
}: {
  card: (typeof cards)[number];
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation(0.15);
  const navigate = useNavigate();
  const detailsRoute =
    index === 0 ? '/btp' : index === 1 ? '/agrobusiness' : index === 2 ? '/commerce' : '/';

  return (
    <div
      ref={ref}
      className="group relative w-full rounded-2xl overflow-hidden min-h-[320px] md:min-h-[360px] cursor-default"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={card.image}
          alt={card.label}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />

      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#8B1A1A] transition-colors duration-300" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between h-full p-8 md:p-12 gap-8">
        <div className="flex-1 max-w-xl">
          <span
            className="inline-block text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase mb-4"
            style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '2px', color: 'white' }}
          >
            {card.label}
          </span>
          <div
            className="text-5xl md:text-6xl font-black text-white leading-none mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: '80px', fontWeight: '800', color: 'white' }}
          >
            {card.stat}
          </div>
          <p
            className="text-white/80 text-sm md:text-base leading-relaxed font-light mb-3 max-w-md"
            style={{ fontSize: '18px', fontWeight: '400', color: 'white', lineHeight: '1.7' }}
          >
            {card.text}
          </p>
          <button
            type="button"
            onClick={() => navigate(detailsRoute)}
            className="mt-5 inline-flex items-center justify-center rounded-xl px-5 py-3 transition-opacity duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
            style={{
              background: '#8B1A1A',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 700,
              width: 'fit-content',
            }}
          >
            En savoir plus
          </button>
          <span className="inline-block text-white text-xs font-medium rounded-full px-3 py-1" style={{ backgroundColor: '#1E5FA6' }}>
            Source : {card.source}
          </span>
        </div>

        <div className="flex flex-col gap-3 shrink-0">
          {card.pills.map((pill) => (
            <div
              key={pill.label}
              className="backdrop-blur-md bg-white/10 border border-white/15 rounded-xl px-5 py-3 min-w-[200px]"
            >
              <div
                className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1px', color: 'white' }}
              >
                {pill.label}
              </div>
              <div
                className="text-white text-lg font-bold leading-tight"
                style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}
              >
                {pill.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RiskCards() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="bg-[#F7F7F5] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className="mb-14"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <span
            className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-4 text-[#8B1A1A]"
            style={{ fontSize: '16px', fontWeight: '700', color: '#8B1A1A', letterSpacing: '2px' }}
          >
            Le constat
          </span>
          <h2
            className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight max-w-2xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Investir sans contrôle,<br />
            c'est prendre un risque réel.
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {cards.map((card, i) => (
            <RiskCard key={card.label} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
