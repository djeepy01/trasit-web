import { Star } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const testimonials = [
  {
    name: 'Amadou Diallo',
    role: 'Investisseur immobilier',
    location: 'Dakar, Sénégal',
    avatar: 'https://plus.unsplash.com/premium_photo-1723683613486-a15861aa678a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fHBlcnNvbm5lJTIwbm9pcnxlbnwwfHwwfHx8MA%3D%3D',
    quote:
      'J\'avais confié un chantier à un entrepreneur à Thiès sans pouvoir me déplacer. TRASIT m\'a fourni un rapport complet en 2 heures avec des photos et un score de conformité. Indispensable pour investir à distance.',
    rating: 5,
    vertical: '',
  },
  {
    name: 'Fatou Coulibaly',
    role: 'Directrice de portefeuille',
    location: 'Abidjan, Côte d\'Ivoire',
    avatar: 'https://plus.unsplash.com/premium_photo-1661589836910-b3b0bf644bd5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTY1fHxwZXJzb25uZSUyMG5vaXJ8ZW58MHx8MHx8fDA%3D',
    quote:
      'Nous utilisons TRASIT pour vérifier nos exploitations agricoles au Mali et en Guinée. La rigueur des agents, la qualité des rapports et la rapidité de livraison dépassent largement nos attentes.',
    rating: 5,
    vertical: 'Agrobusiness',
  },
  {
    name: 'Jean-Claude Mbeki',
    role: 'Promoteur immobilier',
    location: 'Douala, Cameroun',
    avatar: 'https://images.unsplash.com/photo-1597245237764-f063835ee292?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDIzfHxwZXJzb25uZSUyMG5vaXJ8ZW58MHx8MHx8fDA%3D',
    quote:
      'En tant qu\'investisseur basé à Paris, je ne peux pas être sur le terrain. TRASIT est devenu mon prolongement physique en Afrique. Chaque rapport me donne une vraie confiance dans mes décisions.',
    rating: 5,
    vertical: '',
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
    ))}
  </div>
);

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="testimonials" className="bg-[#F7F7F6] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p
            className="text-[#1A1A1A] text-xs font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A1A', letterSpacing: '2px' }}
          >
            Témoignages
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tight">
            Ils ont investi en confiance.
          </h2>
        </div>

        <div
          ref={ref}
          className="grid md:grid-cols-3 gap-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            fontFamily:
              'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
          }}
        >
        {testimonials.map(({ name, role, location, avatar, quote, rating }, i) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-7 shadow-sm border border-[#1A1A1A]/15 hover:shadow-md transition-shadow flex flex-col"
              style={{
                transitionDelay: `${i * 0.1}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s, box-shadow 0.2s ease`,
                padding: '28px',
                minHeight: '320px',
              }}
            >
              <div className="flex items-start justify-between mb-5">
                <Stars count={rating} />
              </div>

              <blockquote
                className="text-[#1A1A1A] text-[16px] leading-[1.8] flex-1 mb-6 font-light"
                style={{ fontSize: '20px', fontWeight: 500, color: '#1A1A1A', lineHeight: '1.85' }}
              >
                "{quote}"
              </blockquote>

              <div className="flex items-center gap-3 pt-5 border-t border-[#1A1A1A]/15">
                <img
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <div
                    className="font-bold text-[#1A1A1A] text-sm"
                    style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A1A' }}
                  >
                    {name}
                  </div>
                  <div
                    className="text-[#1A1A1A] text-xs"
                    style={{ fontSize: '20px', fontWeight: 500, color: '#1A1A1A' }}
                  >
                    {role}
                  </div>
                  <div
                    className="text-[#1A1A1A] text-xs"
                    style={{ fontSize: '20px', fontWeight: 500, color: '#1A1A1A' }}
                  >
                    {location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
