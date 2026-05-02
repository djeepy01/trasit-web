import { LegalPageLayout, LegalSection } from '../components/LegalPageLayout';

/**
 * Mentions légales du site TRASIT.
 */
export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout title="Mentions légales">
      <LegalSection title="Éditeur">
        <p style={{ fontSize: '20px' }}>
          Le site est édité par <strong className="font-semibold text-[#0D2F4A]">KEEPLAND Holdings LLC</strong>
          , dont le siège est situé à Dubai, Émirats arabes unis (UAE).
        </p>
      </LegalSection>

      <LegalSection title="Directeur de publication">
        <p style={{ fontSize: '20px' }}>Jean Paul Wahi.</p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p style={{ fontSize: '20px' }}>
          Le site est hébergé par <strong className="font-semibold text-[#0D2F4A]">Vercel Inc.</strong>
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p style={{ fontSize: '20px' }}>
          <a href="mailto:contact@trasit.com" className="text-[#1E5FA6] font-medium underline-offset-2 hover:underline">
            contact@trasit.com
          </a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
