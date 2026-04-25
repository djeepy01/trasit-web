import { MessageCircle, ClipboardCheck, CreditCard, UserCheck, FileCheck } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const steps = [
  {
    number: '01',
    icon: MessageCircle,
    title: 'Soumettez via WhatsApp',
    desc: 'Envoyez l\'adresse et les détails de votre investissement sur notre numéro dédié.',
  },
  {
    number: '02',
    icon: ClipboardCheck,
    title: 'Validez votre fiche de mission',
    desc: 'Vous confirmez les détails de votre demande. Nous vérifions la disponibilité d\'un agent sur votre zone.',
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Procédez au paiement',
    desc: 'Paiement sécurisé par mobile money, virement ou carte bancaire.',
  },
  {
    number: '04',
    icon: UserCheck,
    title: 'Vérification effectuée sur place',
    desc: 'Notre agent se rend sur place et documente chaque détail en photos.',
  },
  {
    number: '05',
    icon: FileCheck,
    title: 'Recevez votre rapport',
    desc: 'Rapport complet livré en moins de 2 heures, directement sur WhatsApp et email.',
  },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="how-it-works" className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Le processus
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Simple. Rapide. Fiable.
          </h2>
          <p className="text-gray-700 mt-4 text-lg font-light max-w-xl mx-auto">
            Votre terrain en 5 étapes, de la fiche de mission au rapport final.
          </p>
        </div>

        <div
          ref={ref}
          className="relative"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="hidden lg:block absolute top-14 left-0 right-0 h-px bg-gray-200 mx-[10%]" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {steps.map(({ number, icon: Icon, title, desc }, i) => (
              <div
                key={number}
                className="relative flex flex-col items-center text-center md:min-w-[200px]"
                style={{
                  transitionDelay: `${i * 0.12}s`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                }}
              >
                <div className="relative z-10 w-[68px] h-[68px] rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-5 group-hover:border-[#8B1A1A] transition-colors shadow-sm">
                  <Icon size={22} className="text-gray-600" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-[9px] font-black">{number}</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 px-2">{title}</h3>
                <p className="text-gray-700 text-xs leading-relaxed px-1 w-full text-left">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
