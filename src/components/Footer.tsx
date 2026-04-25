import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';

const serviceLinks = [
  { label: 'Nos services', to: '/nos-services' },
  { label: 'Comment ça marche', to: '/comment-ca-marche' },
  { label: 'Contact', to: '/contact' },
];

const legalLinks = [
  { label: "Conditions générales d'utilisation", to: '/cgu' },
  { label: 'Politique de confidentialité', to: '/confidentialite' },
  { label: 'Mentions légales', to: '/mentions-legales' },
];

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
            <p
              className="text-white/70 text-sm leading-relaxed font-light mb-6 max-w-[220px]"
              style={{ fontSize: '16px', fontWeight: '400', color: 'white' }}
            >
              La confiance pour chaque investissement en Afrique.
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

          <div>
            <h4
              className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5"
              style={{ fontSize: '16px', fontWeight: '700', color: 'white', letterSpacing: '2px' }}
            >
              Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/70 hover:text-white text-sm transition-colors font-light"
                    style={{ fontSize: '17px', fontWeight: '400', color: 'white' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-white text-xs font-bold uppercase tracking-[0.15em] mb-5"
              style={{ fontSize: '16px', fontWeight: '700', color: 'white', letterSpacing: '2px' }}
            >
              Légal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/70 hover:text-white text-sm transition-colors font-light"
                    style={{ fontSize: '17px', fontWeight: '400', color: 'white' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-white/60 text-xs text-center md:text-left"
            style={{ fontSize: '14px', fontWeight: '400', color: 'white' }}
          >
            © 2026 TRASIT
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              to="/cgu"
              className="text-white/60 hover:text-white/90 text-xs transition-colors"
              style={{ fontSize: '14px', fontWeight: '400', color: 'white' }}
            >
              CGU
            </Link>
            <Link
              to="/confidentialite"
              className="text-white/60 hover:text-white/90 text-xs transition-colors"
              style={{ fontSize: '14px', fontWeight: '400', color: 'white' }}
            >
              Confidentialité
            </Link>
            <Link
              to="/mentions-legales"
              className="text-white/60 hover:text-white/90 text-xs transition-colors"
              style={{ fontSize: '14px', fontWeight: '400', color: 'white' }}
            >
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
