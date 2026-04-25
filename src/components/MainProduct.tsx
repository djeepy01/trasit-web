import { CheckCircle, ScanSearch } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ColoredBars = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
    <rect x="0" y="5" width="4" height="9" rx="0.75" fill="#1E5FA6" />
    <rect x="6" y="2" width="4" height="12" rx="0.75" fill="#2E8B57" />
    <rect x="12" y="0" width="4" height="14" rx="0.75" fill="#F9A825" />
  </svg>
);

const verticals = [
  { icon: '🏗', label: 'Construction & BTP', desc: 'Chantiers, entrepreneurs, matériaux' },
  { icon: '🌾', label: 'Agrobusiness', desc: 'Exploitations, récoltes, équipements' },
  { icon: '🏪', label: 'Commerce & Gestion', desc: 'Boutiques, stocks, gérants' },
];

const features = [
  'Rapports structurés avec photos géolocalisées',
  'Couverture dans 17 pays en Afrique',
  'Délai de livraison garanti en moins de 2 heures',
];

export default function MainProduct() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { ref: ref2, isVisible: isVisible2 } = useScrollAnimation(0.1);

  return (
    <section id="main-product" className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div
            ref={ref}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 mb-6">
              <span
                className="text-[#0D2F4A] text-xs font-semibold tracking-wider uppercase"
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#0D2F4A',
                  letterSpacing: '1px',
                  border: '1px solid #0D2F4A',
                  borderRadius: '4px',
                  padding: '5px 12px',
                }}
              >
                NOS INTERVENTIONS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
              Ce que vous voyez,<br />
              c'est ce qui existe.
            </h2>
            <p className="text-[#0D2F4A] text-lg leading-relaxed mb-8 font-light">
              TRASIT déploie des agents directement sur vos actifs et chantiers en Afrique. Nous vérifions la réalité de votre investissement — entrepreneur, avancement des travaux, état des équipements — et vous livrons un rapport complet, documenté et exploitable.
            </p>

            <ul className="space-y-3.5 mb-10">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="text-green-600 text-[18px] font-normal mt-0.5 shrink-0">&#10003;</span>
                  <span className="text-[#1A1A1A] text-[18px] font-normal leading-[1.6]">{f}</span>
                </li>
              ))}
            </ul>

            <button className="bg-[#8B1A1A] text-white px-7 py-3.5 text-sm font-semibold rounded-sm hover:bg-[#6d1515] transition-all duration-200">
              Découvrir nos services
            </button>
          </div>

          <div
            ref={ref2}
            className="relative"
            style={{
              opacity: isVisible2 ? 1 : 0,
              transform: isVisible2 ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
            }}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80"
                alt="Exploitation agricole en Afrique"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-6 top-8 animate-float" style={{ animationDelay: '0s' }}>
              <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-100 min-w-[180px]">
                <div className="flex items-center gap-3 py-2 border-b border-gray-100 first:pt-0">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <ColoredBars />
                  </div>
                  <div>
                    <div className="text-xs text-[#0D2F4A] font-semibold">Score de conformité</div>
                    <div className="text-lg font-black text-gray-900 leading-tight">94%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <ScanSearch size={16} className="text-[#0D2F4A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#0D2F4A] font-semibold">Sites vérifiés</div>
                    <div className="text-base font-black text-gray-900">✓</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 last:pb-0">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle size={16} className="text-[#0D2F4A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#0D2F4A] font-semibold">Rapport livré</div>
                    <div className="text-lg font-black text-gray-900 leading-tight">2h</div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        <div className="flex gap-4 w-full overflow-visible mt-10">
          {verticals.map(({ icon, label, desc }) => (
            <div
              key={label}
              className="flex-1 bg-white rounded-xl border border-gray-100 p-6"
              style={{ padding: '20px' }}
            >
              <span className="text-2xl leading-none">{icon}</span>
              <div>
                <div
                  className="text-[20px] font-bold text-[#1A1A1A] whitespace-nowrap"
                  style={{ fontSize: '19px', fontWeight: '700', color: '#1A1A1A' }}
                >
                  {label}
                </div>
                <div
                  className="text-[16px] text-[#666666] mt-1 whitespace-nowrap"
                  style={{ fontSize: '17px', fontWeight: '500', color: '#0D2F4A' }}
                >
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}