import { LegalPageLayout, LegalSection } from '../components/LegalPageLayout';

/**
 * Politique de confidentialité et traitement des données personnelles.
 */
export default function ConfidentialitePage() {
  return (
    <LegalPageLayout title="Politique de confidentialité">
      <LegalSection title="Données collectées">
        <p>
          Dans le cadre de votre demande et de la mission de vérification, nous pouvons collecter notamment :
          votre nom, votre adresse email, votre numéro de téléphone, la localisation du site ou de
          l&apos;actif à vérifier, ainsi que les informations relatives au prestataire ou à la contrepartie
          nécessaires à la fiche de mission (sans préjudice du principe de confidentialité décrit ci-dessous).
        </p>
      </LegalSection>

      <LegalSection title="Utilisation des données">
        <p>
          Les données sont utilisées uniquement pour traiter votre demande, organiser la mission, communiquer
          avec vous (notamment via WhatsApp ou email) et vous livrer le rapport. Elles ne sont pas revendues
          ni utilisées à des fins de prospection incompatible avec cette finalité.
        </p>
      </LegalSection>

      <LegalSection title="Confidentialité stricte">
        <p>
          Aucune donnée personnelle ou sensible du donneur d&apos;ordre n&apos;est partagée avec le
          prestataire ou la partie faisant l&apos;objet de la vérification, au-delà du strict nécessaire à
          l&apos;exécution du constat sur site (par exemple l&apos;adresse du lieu à visiter lorsque la
          mission l&apos;exige), conformément au processus TRASIT et à votre fiche de mission.
        </p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <p>
          Les données sont conservées pendant une durée de douze (12) mois à compter du dernier contact
          ou de la clôture de la mission, sauf obligation légale de conservation plus longue ou exercice de vos
          droits (suppression lorsque applicable).
        </p>
      </LegalSection>

      <LegalSection title="Droits de l'utilisateur">
        <p>
          Conformément au RGPD et aux lois applicables, vous disposez le cas échéant d&apos;un droit
          d&apos;accès, de rectification, d&apos;effacement (« droit à l&apos;oubli »), de limitation du
          traitement, d&apos;opposition et de portabilité. Pour exercer ces droits, écrivez-nous à l&apos;adresse
          ci-dessous. Vous pouvez également introduire une réclamation auprès de l&apos;autorité de protection
          des données compétente.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative à vos données :{' '}
          <a href="mailto:contact@trasit.com" className="text-[#1E5FA6] font-medium underline-offset-2 hover:underline">
            contact@trasit.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
