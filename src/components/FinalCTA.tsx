import { Mail } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function FinalCTA() {
  const { ref, isVisible } = useScrollAnimation(0.15);

  return (
    <section className="bg-[#0D2F4A] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className="flex flex-col lg:flex-row items-center justify-between gap-10"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="text-center lg:text-left">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Commencer maintenant
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight max-w-xl">
              Prêt à investir en toute confiance ?
            </h2>
            <p className="text-white/80 mt-4 text-lg font-light max-w-lg">
              Lancez votre première terrain dès aujourd'hui. Rapport livré en moins de 2 heures.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <button className="border border-white/30 text-white px-8 py-4 text-sm font-semibold rounded-sm hover:bg-white/10 hover:border-white/50 transition-all duration-200 flex items-center gap-2 justify-center">
              <Mail size={15} />
              Nous contacter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
