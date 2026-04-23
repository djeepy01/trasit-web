import { Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';

const links = {
  Services: [
    'Audit',
    'Audit Agrobusiness',
    'Rapports terrain',
    'Suivi de chantier',
    'Due diligence',
  ],
  Légal: [
    'Conditions d\'utilisation',
    'Politique de confidentialité',
    'Mentions légales',
    'Cookies',
  ],
};

const socials = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Facebook, label: 'Facebook' },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#0D2F4A] relative overflow-hidden">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="text-white font-black uppercase tracking-tighter leading-none"
          style={{
            fontSize: 'clamp(80px, 18vw, 240px)',
            opacity: 0.035,
            letterSpacing: '-0.04em',
          }}
        >
          tras·it
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-10">
        <p className="text-white mb-10" style={{ fontWeight: 700, fontSize: '16px' }}>
          Fondé sur la réalité, rien d'autre.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 mb-14">
          <div className="col-span-2 lg:col-span-1">
            <div className="text-[1.55rem] font-black text-white tracking-tight leading-none mb-4">
              tras<span>·</span>it
            </div>
            <p className="text-white/70 text-sm leading-relaxed font-light mb-6 max-w-[220px]">
              Audit terrain pour investisseurs en Afrique. Agrobusiness.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                >
                  <Icon size={15} className="text-white/80" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/70 hover:text-white text-sm transition-colors font-light"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-xs text-center md:text-left">
            © 2026 TRASIT
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/60 hover:text-white/90 text-xs transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-white/60 hover:text-white/90 text-xs transition-colors">
              Confidentialité
            </a>
            <a href="#" className="text-white/60 hover:text-white/90 text-xs transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
