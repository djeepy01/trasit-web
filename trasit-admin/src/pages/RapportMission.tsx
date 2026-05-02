import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

type MissionType = 'btp' | 'agro' | 'commerce' | string;
type Frequency = 'unique' | 'suivi' | string;
type ServiceLevel = 'standard' | 'renforce' | string;

type MissionDoc = {
  uid?: string;
  timestamp?: { toDate: () => Date } | null;
  statut?: string;
  missionType?: MissionType;

  providerName?: string;
  providerRegistration?: string;
  providerOtherInfo?: string;

  siteAddress?: string;
  siteDistrict?: string;
  siteLandmarks?: string;
  siteExtraInfo?: string;

  onSiteContactName?: string;
  onSiteContactPhone?: string;

  btpConstructionType?: string;
  btpLevels?: string;
  btpSurface?: string;
  btpCurrentState?: string;
  btpToVerify?: string;

  agroSubtype?: string;
  agroDeclared?: string;
  agroToVerify?: string;

  commerceActivity?: string;
  commerceToVerify?: string;

  frequency?: Frequency;
  followupSteps?: string;
  serviceLevel?: ServiceLevel;

  providerPhotosCount?: number;
  providerPhotoNames?: string[];
};

const COLORS = {
  navy: '#0D2F4A',
  blue: '#1E5FA6',
  light: '#EBF2FA',
  burgundy: '#8B1A1A',
  text: '#1A1A1A',
  white: '#FFFFFF',
};

function missionTypeLabel(v?: string) {
  if (v === 'btp') return 'Construction & BTP';
  if (v === 'agro') return 'Agrobusiness';
  if (v === 'commerce') return 'Commerce & Gestion';
  return 'Mission';
}

function agroSubtypeLabel(v?: string) {
  if (v === 'animaux') return 'Animaux';
  if (v === 'cultures') return 'Cultures';
  if (v === 'les-deux') return 'Les deux';
  return '';
}

function frequencyLabel(v?: string) {
  if (v === 'unique') return 'Rapport unique';
  if (v === 'suivi') return 'Suivi sur plusieurs étapes';
  return '';
}

function serviceLevelLabel(v?: string) {
  if (v === 'standard') return 'Rapport Standard (15 000 FCFA)';
  if (v === 'renforce') return 'Suivi Renforcé (Sur devis)';
  return '';
}

function formatFrenchDate(d: Date) {
  const datePart = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
  const timePart = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
  const hhmm = timePart.replace(':', 'h');
  return `${datePart} à ${hhmm}`;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: COLORS.light, borderRadius: '12px', padding: '20px' }}>
      <div style={{ color: COLORS.navy, fontWeight: 800, fontSize: '18px' }}>{title}</div>
      <div style={{ marginTop: '12px', display: 'grid', gap: '10px' }}>{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '12px', alignItems: 'start' }}>
      <div style={{ color: COLORS.text, fontSize: '16px', fontWeight: 700 }}>{label}</div>
      <div style={{ color: COLORS.text, fontSize: '16px', fontWeight: 500, lineHeight: 1.7 }}>{value}</div>
    </div>
  );
}

export default function RapportMission() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mission, setMission] = useState<MissionDoc | null>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setError('');
      setMission(null);

      if (!id) {
        setError('Identifiant de mission manquant.');
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'fiches_mission', id));
        if (!snap.exists()) {
          if (!mounted) return;
          setError('Mission introuvable.');
          setLoading(false);
          return;
        }
        if (!mounted) return;
        setMission(snap.data() as MissionDoc);
        setLoading(false);
      } catch (e: unknown) {
        if (!mounted) return;
        setError('Erreur lors du chargement du rapport.');
        setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [id]);

  const submittedText = useMemo(() => {
    const d = mission?.timestamp?.toDate ? mission.timestamp.toDate() : null;
    return d ? `Soumis le ${formatFrenchDate(d)}` : '';
  }, [mission]);

  if (loading) {
    return (
      <div style={{ background: COLORS.white, minHeight: '100vh', padding: '28px 24px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text }}>Chargement…</div>
        </div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div style={{ background: COLORS.white, minHeight: '100vh', padding: '28px 24px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              border: `1px solid ${COLORS.navy}`,
              background: COLORS.white,
              color: COLORS.navy,
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            Retour
          </button>
          <div style={{ marginTop: '16px', fontSize: '16px', fontWeight: 500, color: COLORS.text }}>
            {error || 'Erreur.'}
          </div>
        </div>
      </div>
    );
  }

  const title = missionTypeLabel(mission.missionType);
  const statutText = mission.statut === 'en_attente' ? 'En attente' : 'En attente';
  const addressText = [mission.siteAddress, mission.siteDistrict].filter(Boolean).join(' — ');
  const photosCount = Number(mission.providerPhotosCount || 0);

  return (
    <div style={{ background: COLORS.white, minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ borderBottom: '1px solid #DDDDDD', background: COLORS.white }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', padding: '20px 24px' }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              border: `1px solid ${COLORS.navy}`,
              background: COLORS.white,
              color: COLORS.navy,
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            Retour
          </button>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ color: COLORS.navy, fontSize: '24px', fontWeight: 800 }}>{title}</div>
            <div
              style={{
                background: '#FEF3C7',
                color: '#92400E',
                border: '1px solid #F59E0B',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '16px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {statutText}
            </div>
          </div>

          {submittedText ? (
            <div style={{ marginTop: '10px', color: COLORS.text, fontSize: '16px', fontWeight: 500 }}>{submittedText}</div>
          ) : null}
        </div>
      </div>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '22px 24px 28px', display: 'grid', gap: '14px' }}>
        {/* Prestataire */}
        <SectionCard title="Prestataire">
          <Row label="Nom / raison sociale" value={mission.providerName} />
          <Row label="Numéro d'immatriculation" value={mission.providerRegistration} />
          <Row label="Autres informations" value={mission.providerOtherInfo} />
        </SectionCard>

        {/* Localisation */}
        <SectionCard title="Localisation du site">
          <Row label="Adresse complète" value={mission.siteAddress} />
          <Row label="Quartier" value={mission.siteDistrict} />
          <Row label="Repères visibles" value={mission.siteLandmarks} />
          <Row label="Informations complémentaires" value={mission.siteExtraInfo} />
        </SectionCard>

        {/* Contact */}
        <SectionCard title="Contact sur place">
          <Row label="Nom du contact" value={mission.onSiteContactName} />
          <Row label="Téléphone" value={mission.onSiteContactPhone} />
        </SectionCard>

        {/* Détails mission */}
        <SectionCard title="Détails de la mission">
          {mission.missionType === 'btp' ? (
            <>
              <Row label="Type de construction" value={mission.btpConstructionType} />
              <Row label="Nombre de niveaux" value={mission.btpLevels} />
              <Row label="Superficie" value={mission.btpSurface} />
              <Row label="État actuel déclaré" value={mission.btpCurrentState} />
              <Row label="Ce que vous souhaitez vérifier" value={mission.btpToVerify} />
            </>
          ) : null}
          {mission.missionType === 'agro' ? (
            <>
              <Row label="Type" value={agroSubtypeLabel(mission.agroSubtype)} />
              <Row label="Effectif ou surface déclarés" value={mission.agroDeclared} />
              <Row label="Ce que vous souhaitez vérifier" value={mission.agroToVerify} />
            </>
          ) : null}
          {mission.missionType === 'commerce' ? (
            <>
              <Row label="Type d'activité" value={mission.commerceActivity} />
              <Row label="Ce que vous souhaitez vérifier" value={mission.commerceToVerify} />
            </>
          ) : null}
        </SectionCard>

        {/* Fréquence */}
        <SectionCard title="Fréquence">
          <Row label="Fréquence" value={frequencyLabel(mission.frequency)} />
          {mission.frequency === 'suivi' ? <Row label="Étapes" value={mission.followupSteps} /> : null}
        </SectionCard>

        {/* Niveau de service */}
        <SectionCard title="Niveau de service">
          <Row label="Niveau" value={serviceLevelLabel(mission.serviceLevel)} />
        </SectionCard>

        {/* Photos */}
        <SectionCard title="Photos reçues">
          {photosCount > 0 ? (
            <Row label="Photos transmises" value={`${photosCount}`} />
          ) : (
            <Row label="Photos transmises" value="Aucune photo transmise" />
          )}
        </SectionCard>

        {/* Footer page */}
        <div style={{ background: COLORS.navy, padding: '20px', borderRadius: '12px' }}>
          <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 500, lineHeight: 1.7 }}>
            Votre demande est en cours de traitement. Nous vous contactons sous 24h pour confirmer la disponibilité d&apos;un agent.
          </div>
        </div>
      </div>
    </div>
  );
}

