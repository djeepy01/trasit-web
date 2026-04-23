import { useScrollAnimation } from '../hooks/useScrollAnimation';

const stats = [
  { number: '300+', label: 'réalisées', sub: 'Sites' },
  { number: '17', label: 'Pays couverts', sub: 'Afrique' },
  { number: '2h', label: 'Délai de livraison', sub: 'Rapport complet' },
  { number: '98%', label: 'Clients satisfaits', sub: 'Sur 300+' },
];

export default function Stats() {
  const { ref, isVisible } = useScrollAnimation(0.15);

  return (
    <section className="bg-[#F7F7F6] py-20 md:py-28 border-y border-gray-200/60">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {stats.map(({ number, label, sub }, i) => (
            <div
              key={label}
              className="text-center"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">
                {number}
              </div>
              <div className="mt-3 text-gray-800 font-semibold text-sm md:text-base">{label}</div>
              <div className="mt-1 text-gray-600 text-xs md:text-sm">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}