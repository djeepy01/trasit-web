const partners = [
  { name: 'Orange Money', tagline: 'Partenaire financier' },
  { name: 'Ecobank', tagline: 'Réseau panafricain' },
  { name: 'Oragroup', tagline: 'Groupe bancaire' },
  { name: 'BOAD', tagline: 'Banque ouest-africaine' },
  { name: 'AfDB', tagline: 'Banque africaine' },
  { name: 'Société Générale', tagline: 'Partenaire bancaire' },
  { name: 'BICICI', tagline: 'Côte d\'Ivoire' },
  { name: 'BNP Paribas', tagline: 'Partenaire mondial' },
  { name: 'Canal+ Afrique', tagline: 'Média partenaire' },
  { name: 'AFD', tagline: 'Développement' },
];

const PartnerLogo = ({ name, tagline }: { name: string; tagline: string }) => (
  <div className="flex flex-col items-center justify-center px-10 min-w-[160px]">
    <div className="text-gray-700 font-bold text-sm tracking-tight leading-tight">{name}</div>
    <div className="text-gray-500 text-[10px] font-medium uppercase tracking-wider mt-0.5">{tagline}</div>
  </div>
);

export default function PartnersStrip() {
  const doubled = [...partners, ...partners];

  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-600 text-center">
          Ils nous font confiance
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((partner, i) => (
            <PartnerLogo key={i} name={partner.name} tagline={partner.tagline} />
          ))}
        </div>
      </div>
    </section>
  );
}
