import { LegalPageLayout, LegalSection } from '../components/LegalPageLayout';

/**
 * Conditions générales d'utilisation du site et du service TRASIT.
 */
export default function CguPage() {
  return (
    <LegalPageLayout title="Conditions générales d'utilisation">
      <LegalSection title="Objet du service">
        <p>
          Les présentes conditions générales d&apos;utilisation (CGU) définissent les règles d&apos;accès et
          d&apos;usage du site TRASIT ainsi que du service de vérification terrain proposé par TRASIT. En
          utilisant le site ou en passant commande, vous acceptez sans réserve les présentes CGU.
        </p>
      </LegalSection>

      <LegalSection title="Description du service TRASIT">
        <p>
          TRASIT est une plateforme de vérification terrain indépendante. Elle permet aux investisseurs de
          solliciter une mission de constat sur site (chantier, exploitation agricole, commerce, etc.),
          réalisée par un agent certifié, puis de recevoir un rapport structuré (photos, observations,
          éléments de conformité selon le brief). TRASIT n&apos;est pas partie au contrat qui vous lie à un
          tiers vérifié : elle fournit un service d&apos;observation et de documentation factuelle.
        </p>
      </LegalSection>

      <LegalSection title="Conditions d'accès et d'inscription">
        <p>
          L&apos;accès au site est libre. Certaines fonctionnalités (soumission de demande, suivi, livraison
          de rapport) peuvent nécessiter la création d&apos;un compte ou l&apos;identification via les canaux
          proposés (notamment WhatsApp). Vous vous engagez à fournir des informations exactes et à jour, et
          à préserver la confidentialité de vos identifiants le cas échéant.
        </p>
      </LegalSection>

      <LegalSection title="Obligations du client">
        <p>
          Vous vous engagez à fournir des informations exactes, complètes et licites concernant le site ou
          l&apos;actif à vérifier, ainsi qu&apos;un brief clair. Aucune intervention sur le terrain n&apos;est
          déclenchée avant confirmation du paiement conformément au processus indiqué sur la plateforme.
          Toute fausse déclaration ou tentative de détournement du service peut entraîner le refus ou
          l&apos;arrêt de la mission.
        </p>
      </LegalSection>

      <LegalSection title="Obligations de TRASIT">
        <p>
          TRASIT s&apos;engage à organiser la mission avec diligence, à assigner un agent lorsque la zone et
          les disponibilités le permettent, et à livrer le rapport dans les délais convenus au moment de la
          commande (notamment l&apos;objectif de livraison en moins de deux heures après la fin de
          l&apos;intervention sur place, sous réserve de force majeure ou de dysfonctionnement des canaux de
          communication).
        </p>
      </LegalSection>

      <LegalSection title="Limitation de responsabilité">
        <p>
          TRASIT agit en qualité d&apos;observateur indépendant. Les rapports reflètent la situation constatée
          au moment de la visite ; ils ne constituent pas un avis d&apos;expert juridique, comptable ou
          technique, ni un jugement sur la valeur d&apos;un investissement ou sur la bonne foi d&apos;un
          tiers. TRASIT ne saurait être tenue responsable des décisions d&apos;investissement ou de gestion
          prises sur la base du rapport.
        </p>
      </LegalSection>

      <LegalSection title="Politique de remboursement">
        <p>
          Aucun remboursement n&apos;est dû lorsque l&apos;agent s&apos;est effectivement déplacé sur le site
          pour réaliser la mission conformément au brief validé. En cas d&apos;annulation avant tout déplacement
          ou d&apos;impossibilité avérée imputable à TRASIT, une solution commerciale pourra être examinée au
          cas par cas, sans créer de précédent.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Le traitement des données personnelles est décrit dans la politique de confidentialité. TRASIT
          applique les principes du RGPD lorsque le traitement est soumis au règlement européen, et met en
          œuvre des mesures techniques et organisationnelles appropriées à la nature des données traitées.
        </p>
      </LegalSection>

      <LegalSection title="Droit applicable">
        <p>
          Les présentes CGU sont interprétées conformément au droit applicable dans le pays où la mission est
          exécutée ou, à défaut de disposition impérative contraire, au droit des pays d&apos;intervention
          concernés par votre demande, sans préjudice des droits impératifs dont pourrait bénéficier le
          consommateur.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative aux présentes CGU :{' '}
          <a href="mailto:contact@trasit.com" className="text-[#1E5FA6] font-medium underline-offset-2 hover:underline">
            contact@trasit.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
