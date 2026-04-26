const domains = [
  {
    title: 'Construction & BTP',
    subtitle: 'Chantiers, entrepreneurs, matériaux',
    photo: 'https://images.unsplash.com/photo-1740825961434-e9287638592b?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Agrobusiness & Élevage',
    subtitle: 'Exploitations, récoltes, équipements',
    photo: 'https://images.unsplash.com/photo-1664803667707-b55b13e1614b?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Commerce & Gestion',
    subtitle: 'Boutiques, stocks, gérants',
    photo: 'https://images.unsplash.com/photo-1760463921956-b21cfa5cb2ac?w=800&auto=format&fit=crop&q=80',
  },
];

export default function Domains() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p
            className="text-gray-600 text-xs font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A1A', letterSpacing: '2px' }}
          >
            Expertise
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Nos domaines d'intervention
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {domains.map(({ title, subtitle }) => (
            <div
              key={title}
              style={{
                background: '#EBF2FA',
                border: '1px solid #CBD5E1',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                minHeight: '140px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0D2F4A', marginBottom: '8px' }}>
                {title}
              </h3>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A' }}>
                {subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
