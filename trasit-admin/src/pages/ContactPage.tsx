import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Footer from '../components/Footer';

const navy = '#0D2F4A';
const bordeaux = '#8B1A1A';

/**
 * Page Contact : formulaire, coordonnées, CTA (aligné sur Nos services / Comment ça marche).
 */
export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: brancher l'envoi (API, service tiers) quand le backend sera disponible
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      <header
        className="pt-[calc(68px+3rem)] pb-14 md:pb-20 px-6 bg-white"
        style={{ color: navy }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Contactez-nous
          </h1>
          <p
            className="mt-6 md:mt-8 leading-[1.65] max-w-3xl mx-auto"
            style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 500 }}
          >
            Une question ? Une demande particulière ? Nous vous répondons dans les plus brefs délais.
          </p>
        </div>
      </header>

      {/* Deux colonnes : formulaire + infos */}
      <section className="px-6 pb-20 md:pb-28 bg-white" aria-labelledby="contact-main-heading">
        <h2 id="contact-main-heading" className="sr-only">
          Formulaire et coordonnées
        </h2>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="min-w-0">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
            >
              <div>
                <label htmlFor="contact-full-name" className="block text-[16px] font-semibold text-[#1A1A1A] mb-2">
                  Nom complet
                </label>
                <input
                  id="contact-full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full rounded-sm border border-gray-300 px-4 py-3 text-[16px] text-[#1A1A1A] focus:border-[#1E5FA6] focus:outline-none focus:ring-2 focus:ring-[#1E5FA6]/20"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-[16px] font-semibold text-[#1A1A1A] mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-sm border border-gray-300 px-4 py-3 text-[16px] text-[#1A1A1A] focus:border-[#1E5FA6] focus:outline-none focus:ring-2 focus:ring-[#1E5FA6]/20"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="block text-[16px] font-semibold text-[#1A1A1A] mb-2">
                  Téléphone
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-sm border border-gray-300 px-4 py-3 text-[16px] text-[#1A1A1A] focus:border-[#1E5FA6] focus:outline-none focus:ring-2 focus:ring-[#1E5FA6]/20"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-[16px] font-semibold text-[#1A1A1A] mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full resize-y min-h-[160px] rounded-sm border border-gray-300 px-4 py-3 text-[16px] text-[#1A1A1A] focus:border-[#1E5FA6] focus:outline-none focus:ring-2 focus:ring-[#1E5FA6]/20"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 text-[16px] font-semibold text-white rounded-sm transition-opacity duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D2F4A]"
                style={{ backgroundColor: bordeaux }}
              >
                Envoyer le message
              </button>
              {submitted && (
                <p className="leading-[1.65]" style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 500 }} role="status">
                  Merci pour votre message. Nous vous recontacterons très bientôt.
                </p>
              )}
            </form>
          </div>

          <aside
            className="rounded-xl bg-[#EBF2FA] px-8 py-10 md:px-12 md:py-14 lg:px-14 lg:py-16 border border-gray-200/60"
            aria-labelledby="contact-aside-heading"
          >
            <h3 id="contact-aside-heading" className="sr-only">
              Autres moyens de contact
            </h3>
            <div className="space-y-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="text-[#1E5FA6]" size={22} aria-hidden />
                  <span className="text-[16px] font-bold" style={{ color: navy }}>
                    WhatsApp
                  </span>
                </div>
                <p className="leading-[1.65]" style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 500 }}>
                  Contactez-nous directement sur WhatsApp pour soumettre une demande
                </p>
              </div>
              <div>
                <p className="text-[16px] font-bold mb-2" style={{ color: navy }}>
                  Email
                </p>
                <a
                  href="mailto:contact@trasit.com"
                  className="text-[16px] md:text-[17px] leading-[1.65] text-[#1E5FA6] font-medium underline-offset-2 hover:underline break-all"
                >
                  contact@trasit.com
                </a>
              </div>
              <div>
                <p className="text-[16px] font-bold mb-2" style={{ color: navy }}>
                  Délai de réponse
                </p>
                <p className="leading-[1.65]" style={{ color: '#1A1A1A', fontSize: '16px', fontWeight: 500 }}>
                  Nous répondons sous 24 heures
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        className="py-16 md:py-24 px-6"
        style={{ backgroundColor: navy }}
        aria-labelledby="contact-cta-heading"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="contact-cta-heading"
            className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight"
          >
            Prêt à vérifier votre investissement ?
          </h2>
          <Link
            to="/#main-product"
            className="inline-block mt-8 px-8 py-4 text-[16px] font-semibold text-white rounded-sm transition-colors duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D2F4A]"
            style={{ backgroundColor: bordeaux }}
          >
            Soumettre une demande
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
