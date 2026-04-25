import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

type NavItem = {
  label: string;
  to: string;
  /** Style pill bleu pour « Comment ça marche » */
  variant?: 'primary';
};

const navItems: NavItem[] = [
  { label: 'Comment ça marche', to: '/comment-ca-marche', variant: 'primary' },
  { label: 'Nos services', to: '/nos-services' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-300 ${
        scrolled ? 'border-gray-200 shadow-sm' : 'border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center shrink-0"
        >
          <span
            className="text-2xl font-bold text-gray-900 tracking-tight leading-none select-none"
            style={{ fontSize: '24px', fontWeight: '800' }}
          >
            tras<span className="text-[#8B1A1A]">·</span>it
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navItems.map(({ label, to, variant }) => (
            <Link
              key={label}
              to={to}
              className={
                variant === 'primary'
                  ? 'text-white text-sm font-medium transition-colors whitespace-nowrap px-4 py-2 rounded-md hover:opacity-90'
                  : 'text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors whitespace-nowrap'
              }
              style={
                variant === 'primary'
                  ? { backgroundColor: '#1E5FA6', borderRadius: '6px', fontSize: '15px', fontWeight: '500' }
                  : { fontSize: '15px', fontWeight: '500' }
              }
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm font-semibold px-2.5 py-1.5 rounded transition-colors"
            >
              {lang}
              <ChevronDown size={13} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[64px]">
                {(['FR', 'EN'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${
                      lang === l ? 'text-gray-900 bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <button
            type="button"
            className="text-sm font-medium border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-all duration-200"
            style={{ fontSize: '15px', fontWeight: '500' }}
          >
            S'inscrire
          </button>
          <button
            type="button"
            className="text-sm font-semibold bg-[#8B1A1A] text-white px-4 py-2 rounded-lg hover:bg-[#6d1515] transition-all duration-200 whitespace-nowrap"
            style={{ fontSize: '15px', fontWeight: '600' }}
          >
            Se connecter
          </button>
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 space-y-4">
          {navItems.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={closeMobile}
              className="block w-full text-left text-gray-800 hover:text-gray-900 text-sm font-medium py-1"
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-600 font-medium">Langue :</span>
            {(['FR', 'EN'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`text-sm font-bold px-2 py-0.5 rounded transition-colors ${
                  lang === l ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              className="border border-gray-300 text-gray-700 px-5 py-2.5 text-sm font-semibold rounded-sm"
            >
              S'inscrire
            </button>
            <button
              type="button"
              className="bg-[#8B1A1A] text-white px-5 py-2.5 text-sm font-semibold rounded-sm"
            >
              Se connecter
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
