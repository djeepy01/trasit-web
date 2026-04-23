import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Footer from '../components/Footer';

const navy = '#0D2F4A';
const bordeaux = '#8B1A1A';

type ServiceCard = {
  title: string;
  description: string;
  checks: string[];
};

/** Trois verticaux métiers : contenu éditorial de la page Nos services */
const verticalServices: ServiceCard[] = [
  {
    title: 'Construction & BTP',
    description:
      "Nous vérifions l'avancement réel de votre chantier, la qualité des matériaux, la présence des équipes et la conformité avec votre devis.",
    checks: [
      'photos horodatées',
      'état des travaux',
      'présence ouvriers',
      'qualité matériaux',
      'immatriculation entrepreneur',
    ],
  },
  {
    title: 'Agrobusiness & Élevage',
    description:
      'Nous contrôlons vos actifs agricoles sur place — bétail, cultures, fermes — et comparons la réalité terrain avec ce qui vous a été déclaré.',
    checks: [
      'comptage animaux',
      'état sanitaire',
      'stade cultures',
      'stock déclaré vs observé',
      "conditions d'élevage",
    ],
  },
  {
    title: 'Commerce & Gestion',
    description:
      "Nous vérifions l'état réel de votre commerce, le stock présent, la gestion du gérant et la conformité avec vos attentes.",
    checks: [
      'stock physique',
      'état boutique',
      'présence gérant',
      'conformité brief client',
    ],
  },
];

/**
 * Page dédiée « Nos services » : offres par secteur, niveaux de service, CTA.
 */
export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* En-tête : fond blanc, texte navy */}
      <header
        className="pt-[calc(68px+3rem)] pb-12 md:pb-16 px-6 bg-white"
        style={{ color: navy }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Nos services
          </h1>
          <p className="mt-5 text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto">
            Une vérification terrain indépendante pour chaque type d&apos;investissement.
          </p>
        </div>
      </header>

      {/* Section 3 verticaux : cartes côte à côte */}
      <section className="px-6 pb-16 md:pb-24 bg-white" aria-labelledby="verticals-heading">
        <h2 id="verticals-heading" className="sr-only">
          Domaines d&apos;intervention
        </h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 lg:gap-8">
          {verticalServices.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 flex flex-col shadow-sm"
              style={{ color: navy }}
            >
              <h3 className="text-xl font-bold tracking-tight">{card.title}</h3>
              <p className="mt-4 text-sm md:text-[0.9375rem] leading-relaxed font-light text-[#0D2F4A]/90">
                {card.description}
              </p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#0D2F4A]/70">
                Ce qu&apos;on vérifie
              </p>
              <ul className="mt-3 space-y-2.5 flex-1">
                {card.checks.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-snug">
                    <Check
                      className="shrink-0 mt-0.5 text-[#2E8B57]"
                      size={18}
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Niveaux de service : deux colonnes */}
      <section
        className="px-6 py-16 md:py-20 bg-gray-50 border-y border-gray-100"
        aria-labelledby="service-levels-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="service-levels-heading"
            className="text-2xl md:text-3xl font-black text-center mb-10 md:mb-14"
            style={{ color: navy }}
          >
            Niveaux de service
          </h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div
              className="rounded-xl border border-gray-200 bg-white p-8 md:p-10"
              style={{ color: navy }}
            >
              <h3 className="text-xl font-bold">Rapport Standard</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed font-light text-[#0D2F4A]/90">
                Un rapport unique, livré en moins de 2 heures après l&apos;intervention. Idéal pour une
                vérification ponctuelle.
              </p>
            </div>
            <div
              className="rounded-xl border border-gray-200 bg-white p-8 md:p-10"
              style={{ color: navy }}
            >
              <h3 className="text-xl font-bold">Suivi Renforcé</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed font-light text-[#0D2F4A]/90">
                Plusieurs visites planifiées à chaque étape clé. Idéal pour un suivi continu de votre
                investissement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final : fond navy, bouton bordeaux */}
      <section
        className="py-16 md:py-24 px-6"
        style={{ backgroundColor: navy }}
        aria-labelledby="services-cta-heading"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="services-cta-heading"
            className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight"
          >
            Prêt à vérifier votre investissement ?
          </h2>
          <Link
            to="/#main-product"
            className="inline-block mt-8 px-8 py-4 text-sm font-semibold text-white rounded-sm transition-colors duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D2F4A]"
            style={{ backgroundColor: bordeaux }}
          >
            Commencer une demande
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
