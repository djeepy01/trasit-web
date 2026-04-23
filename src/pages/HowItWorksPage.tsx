import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const navy = '#0D2F4A';
const bordeaux = '#8B1A1A';

type ProcessStep = {
  displayNumber: string;
  title: string;
  description: string;
};

/** Les 5 étapes du parcours client TRASIT (page dédiée) */
const processSteps: ProcessStep[] = [
  {
    displayNumber: '01',
    title: 'Soumettez via WhatsApp',
    description:
      "Envoyez l'adresse et les détails de votre investissement sur notre numéro WhatsApp dédié. Un flow guidé vous pose les questions nécessaires en moins de 5 minutes.",
  },
  {
    displayNumber: '02',
    title: 'Validez votre brief',
    description:
      "Vous confirmez les détails de votre demande. Nous vérifions la disponibilité d'un agent sur votre zone.",
  },
  {
    displayNumber: '03',
    title: 'Procédez au paiement',
    description:
      "Paiement sécurisé par mobile money, virement ou carte bancaire. Aucune intervention n'est déclenchée avant confirmation du paiement.",
  },
  {
    displayNumber: '04',
    title: 'Vérification effectuée sur place',
    description:
      'Notre agent certifié se rend sur place et documente chaque détail en photos géolocalisées et horodatées, selon votre checklist personnalisée.',
  },
  {
    displayNumber: '05',
    title: 'Recevez votre rapport',
    description:
      'Rapport complet livré en moins de 2 heures directement sur WhatsApp et email. Score de conformité, photos annotées, écarts constatés, recommandations.',
  },
];

/**
 * Page « Comment ça marche » : timeline des étapes, délai, CTA (style aligné sur Nos services).
 */
export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      {/* En-tête */}
      <header
        className="pt-[calc(68px+3rem)] pb-14 md:pb-20 px-6 bg-white"
        style={{ color: navy }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Comment ça marche
          </h1>
          <p className="mt-6 md:mt-8 text-base md:text-lg leading-[1.65] max-w-3xl mx-auto text-[#1A1A1A] font-normal">
            De votre brief à votre rapport, voici comment TRASIT fonctionne.
          </p>
        </div>
      </header>

      {/* Timeline : fond bleu clair #EBF2FA uniquement sur cette section */}
      <section className="px-6 py-14 md:py-16 pb-20 md:pb-28 bg-[#EBF2FA]" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="sr-only">
          Les cinq étapes
        </h2>
        <ol className="max-w-3xl mx-auto space-y-14 md:space-y-20 list-none m-0 p-0">
          {processSteps.map((step, index) => (
            <li key={step.displayNumber} className="flex gap-5 md:gap-8 items-stretch">
              <div className="flex flex-col items-center shrink-0 w-14 sm:w-16">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#1E5FA6]/35 bg-white text-lg font-black tabular-nums shadow-sm"
                  style={{ color: navy }}
                >
                  {step.displayNumber}
                </span>
                {index < processSteps.length - 1 && (
                  <div
                    className="w-px flex-1 min-h-[2.5rem] mt-3 bg-[#1E5FA6]/25"
                    aria-hidden
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: navy }}>
                  {step.title}
                </h3>
                <p className="mt-4 text-[16px] md:text-[17px] leading-[1.65] text-[#1A1A1A] font-normal">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Bloc délai */}
      <section
        className="px-6 py-16 md:py-20 bg-white"
        aria-labelledby="delay-heading"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="delay-heading"
            className="text-2xl md:text-3xl font-black leading-tight tracking-tight"
            style={{ color: navy }}
          >
            Votre rapport en moins de 2 heures.
          </h2>
          <p className="mt-5 text-[16px] md:text-[17px] leading-[1.65] text-[#1A1A1A] font-normal max-w-2xl mx-auto">
            Dès la fin de l&apos;intervention de notre agent sur place.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section
        className="py-16 md:py-24 px-6"
        style={{ backgroundColor: navy }}
        aria-labelledby="how-cta-heading"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="how-cta-heading"
            className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight"
          >
            Vous avez un investissement à vérifier ?
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
