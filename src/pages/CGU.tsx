import type { CSSProperties } from 'react';

const page: CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '48px 24px',
  maxWidth: 800,
  margin: '0 auto',
};

const h1: CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: '#1A1A1A',
  marginBottom: 8,
};

const subtitle: CSSProperties = {
  fontSize: 20,
  color: '#1A1A1A',
  marginBottom: 40,
};

const h2: CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: '#1E5FA6',
  marginTop: 40,
  marginBottom: 12,
};

const p: CSSProperties = {
  fontSize: 20,
  color: '#1A1A1A',
  lineHeight: 1.7,
  marginBottom: 12,
};

const ul: CSSProperties = {
  fontSize: 20,
  color: '#1A1A1A',
  paddingLeft: 24,
  lineHeight: 1.9,
  marginBottom: 12,
};

export default function CGU() {
  return (
    <main style={page}>
      <h1 style={h1}>Conditions Générales d&apos;Utilisation</h1>
      <p style={subtitle}>Dernière mise à jour : Mai 2026</p>

      <h2 style={h2}>Article 1 — Objet</h2>
      <p style={p}>
        TRASIT est une plateforme de vérification indépendante. Elle permet à ses clients de commander des missions de
        documentation sur site, réalisées par des agents indépendants sélectionnés et évalués par TRASIT.
      </p>

      <h2 style={h2}>Article 2 — Accès au service</h2>
      <p style={p}>
        L&apos;accès au service nécessite la création d&apos;un compte personnel. Le client est seul responsable de la
        confidentialité de ses identifiants de connexion.
      </p>

      <h2 style={h2}>Article 3 — Commande d&apos;une mission</h2>
      <p style={p}>
        Toute mission est initiée via une Fiche de mission complétée par le client. La mission est confirmée uniquement
        après validation explicite du client à l&apos;étape de confirmation. Le client reconnaît avoir pris
        connaissance du contenu de sa Fiche de mission avant validation.
      </p>

      <h2 style={h2}>Article 4 — Responsabilités du client</h2>
      <p style={p}>Le client est seul responsable de :</p>
      <ul style={ul}>
        <li>L&apos;exactitude de l&apos;adresse et des repères fournis</li>
        <li>La disponibilité du contact sur place à l&apos;heure convenue</li>
        <li>La prévenance du contact sur place 30 à 60 minutes avant l&apos;arrivée de l&apos;agent</li>
        <li>Toute information fournie dans la Fiche de mission</li>
      </ul>

      <h2 style={h2}>Article 5 — Niveaux de service</h2>
      <p style={p}>
        TRASIT propose plusieurs niveaux de service dont le détail et les tarifs sont communiqués lors de la commande.
        Le niveau de service choisi est indiqué dans la Fiche de mission validée par le client.
      </p>

      <h2 style={h2}>Article 6 — Politique de remboursement</h2>
      <p style={p}>Délai de traitement : 72 heures après décision TRASIT.</p>
      <p style={p}>Méthode : via le moyen de paiement utilisé lors de la commande.</p>
      <p style={p}>Remboursement intégral :</p>
      <ul style={ul}>
        <li>Agent non disponible après confirmation de la mission</li>
        <li>Délai de livraison non respecté et client refuse le rapport</li>
        <li>Erreur prouvée de TRASIT</li>
      </ul>
      <p style={p}>Aucun remboursement :</p>
      <ul style={ul}>
        <li>Adresse incorrecte ou repères insuffisants fournis par le client</li>
        <li>Contact sur place absent sans prévenance à l&apos;heure convenue</li>
        <li>Accès au site refusé sur place, quelle qu&apos;en soit la raison</li>
        <li>Fiche de mission mal formulée validée par le client</li>
        <li>Mission exécutée et rapport livré</li>
      </ul>

      <h2 style={h2}>Article 7 — Rapports</h2>
      <p style={p}>
        Les rapports sont signés TRASIT et téléchargeables depuis l&apos;espace client. Ils sont factuels et ne
        constituent pas un avis juridique ou financier.
      </p>

      <h2 style={h2}>Article 8 — Limitation de responsabilité</h2>
      <p style={p}>
        TRASIT documente ce qui est visible et accessible sur site à la date de la mission. TRASIT n&apos;est pas
        responsable des décisions prises par le client sur la base des rapports.
      </p>

      <h2 style={h2}>Article 9 — Données personnelles</h2>
      <p style={p}>
        Les données collectées sont utilisées uniquement pour l&apos;exécution des missions et l&apos;amélioration du
        service. Durée de conservation : 12 mois. Le client dispose d&apos;un droit d&apos;accès, de rectification et
        de suppression de ses données.
      </p>

      <h2 style={h2}>Article 10 — Droit applicable</h2>
      <p style={p}>
        Les présentes CGU sont soumises au droit applicable dans la juridiction du client. Tout litige sera soumis aux
        tribunaux compétents.
      </p>
    </main>
  );
}
