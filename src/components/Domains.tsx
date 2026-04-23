import { useScrollAnimation } from '../hooks/useScrollAnimation';

const domains = [
  {
    title: 'Construction & BTP',
    subtitle: 'Chantiers, entrepreneurs, prestataires',
    photo: 'https://images.unsplash.com/photo-1740825961434-e9287638592b?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Agrobusiness & Élevage',
    subtitle: 'Fermes, cultures, élevages',
    photo: 'https://images.unsplash.com/photo-1664803667707-b55b13e1614b?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Commerce & Gestion',
    subtitle: 'Boutiques, stocks, gérants',
    photo: 'https://images.unsplash.com/photo-1760463921956-b21cfa5cb2ac?w=800&auto=format&fit=crop&q=80',
  },
];

export default function Domains() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Expertise
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Nos domaines d'intervention
          </h2>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {domains.map(({ title, subtitle, photo }, i) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
              }}
            >
              <img
                src={photo}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/80" />
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <h3 className="text-white text-xl font-black tracking-tight leading-tight mb-1">
                  {title}
                </h3>
                <p className="text-white/80 text-sm font-light">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
