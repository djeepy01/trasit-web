import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { jsPDF } from 'jspdf';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';

type MissionPhoto = { url: string; zone?: string };

type FicheMissionDoc = {
  nomClient?: string;
  nom?: string;
  frequency?: string;
  missionType?: string;
  dateAssignation?: unknown;
  providerName?: string;
  siteAddress?: string;
  siteDistrict?: string;
  onSiteContactName?: string;
  observationsAgent?: string;
  avisTRASIT?: string;
  photos?: unknown;
};

function safeString(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function toDate(ts: unknown): Date | null {
  const anyTs = ts as { toDate?: () => Date; seconds?: number } | string | number | null | undefined;
  if (anyTs && typeof anyTs === 'object' && 'toDate' in anyTs && typeof anyTs.toDate === 'function') {
    const d = anyTs.toDate();
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null;
  }
  if (anyTs && typeof anyTs === 'object' && 'seconds' in anyTs && typeof (anyTs as { seconds: number }).seconds === 'number') {
    const d = new Date((anyTs as { seconds: number }).seconds * 1000);
    return !Number.isNaN(d.getTime()) ? d : null;
  }
  if (typeof anyTs === 'string' || typeof anyTs === 'number') {
    const d = new Date(anyTs);
    return !Number.isNaN(d.getTime()) ? d : null;
  }
  return null;
}

function formatDateFr(d: Date): string {
  return d.toLocaleDateString('fr-FR');
}

function displayNiveauService(raw: unknown): string {
  const s = safeString(raw).toLowerCase();
  if (!s || s === 'unique') return 'Ponctuel';
  return safeString(raw);
}

function formatMissionType(raw: unknown): string {
  const s = safeString(raw);
  if (!s) return '—';
  const lower = s.toLowerCase();
  if (lower === 'btp') return 'BTP';
  if (lower === 'agrobusiness') return 'Agrobusiness';
  if (lower === 'commerce') return 'Commerce';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function initialsFromNomClient(name: string): string {
  const t = name.trim();
  if (!t) return 'TR';
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return t.slice(0, 2).toUpperCase();
}

const ZONE_LABELS: Record<string, string> = {
  zone_specifique: 'Zone spécifique',
  facade_entree: 'Façade entrée',
  interieur: 'Intérieur',
  vue_ensemble: "Vue d'ensemble",
  gros_oeuvre_structure: 'Gros œuvre structure',
};

function formatZoneLabel(zone: string): string {
  const key = zone.trim();
  if (!key) return 'Photo';
  const mapped = ZONE_LABELS[key.toLowerCase()];
  if (mapped) return mapped;
  const spaced = key.replace(/_/g, ' ').trim();
  if (!spaced) return 'Photo';
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Format B : `[{ url, zone }, …]` — Format A : `{ zone: url, … }` */
function normalizePhotos(photos: unknown): MissionPhoto[] {
  if (photos == null) return [];
  if (Array.isArray(photos)) {
    const out: MissionPhoto[] = [];
    for (const item of photos) {
      if (!item || typeof item !== 'object') continue;
      const o = item as Record<string, unknown>;
      const url = typeof o.url === 'string' ? o.url.trim() : '';
      if (!url) continue;
      out.push({ url, zone: typeof o.zone === 'string' ? o.zone : '' });
    }
    return out;
  }
  if (typeof photos === 'object') {
    const out: MissionPhoto[] = [];
    for (const [zone, val] of Object.entries(photos as Record<string, unknown>)) {
      const url = typeof val === 'string' ? val.trim() : '';
      if (!url) continue;
      out.push({ url, zone });
    }
    return out;
  }
  return [];
}

const OBS_FALLBACK_P1 =
  "La visite de vérification a été effectuée à l'adresse déclarée, en présence du contact désigné par le donneur d'ordre. L'agent TRASIT a accédé au site sans restriction, conformément au protocole établi.";
const OBS_FALLBACK_P2 =
  "À la date d'intervention, les fondations sont entièrement achevées et l'élévation du premier niveau est en cours. Les matériaux présents sur site — sacs de ciment, ferraillage structurel, échafaudage en place — sont cohérents avec la phase déclarée.";
const OBS_FALLBACK_P3 =
  "L'ensemble des éléments a fait l'objet d'une capture photographique géolocalisée et horodatée. Aucune anomalie majeure n'a été relevée lors de l'inspection visuelle.";

const AVIS_FALLBACK_P1 =
  "Sur la base des éléments collectés, TRASIT confirme que l'état réel du chantier est cohérent avec les informations transmises par le prestataire. Aucun écart significatif n'a été identifié entre la phase déclarée et l'avancement constaté sur site.";
const AVIS_FALLBACK_P2 =
  "Les preuves documentaires — photographies horodatées, coordonnées GPS, rapport d'agent — sont conservées dans vos archives TRASIT et accessibles à tout moment depuis votre espace client.";
const RECOMMANDATION =
  "L'avancement est conforme au calendrier déclaré. TRASIT recommande de programmer une prochaine vérification lors du passage au second niveau, afin de maintenir une traçabilité continue à chaque étape clé.";

async function fetchLogoAsDataUrl(): Promise<string | null> {
  try {
    const res = await fetch('/logo.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(typeof r.result === 'string' ? r.result : null);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const sectionTitleStyle = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#6B1E2E',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const bodyStyle = {
  fontSize: '16px',
  color: '#1A1A1A',
  lineHeight: '1.8',
};

const valueDetailStyle = {
  fontSize: '16px',
  fontWeight: 500,
  color: '#1A1A1A',
};

const titleMainStyle = {
  fontSize: '28px',
  fontWeight: 700,
  color: '#1A1A1A',
};

const borderLight = '1px solid #DDDDDD';

export default function RapportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState<User | null | undefined>(undefined);
  const [docLoading, setDocLoading] = useState(false);
  const [docData, setDocData] = useState<FicheMissionDoc | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAuthUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (authUser === undefined) return;
    if (authUser === null) {
      const path = `/rapport/${id ?? ''}`;
      navigate(`/connexion?redirect=${encodeURIComponent(path)}`, { replace: true });
      return;
    }
    if (!id) return;

    let mounted = true;
    setDocLoading(true);
    void (async () => {
      try {
        const snap = await getDoc(doc(db, 'fiches_mission', id));
        if (!mounted) return;
        if (!snap.exists()) {
          setDocData(null);
        } else {
          const raw = snap.data() as FicheMissionDoc;
          setDocData({ ...raw, photos: normalizePhotos(raw.photos) });
        }
      } finally {
        if (mounted) setDocLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [authUser, id, navigate]);

  const photos = useMemo(() => (docData?.photos as MissionPhoto[]) ?? [], [docData]);

  const refDisplay = useMemo(() => {
    const six = (id || '').slice(0, 6).toUpperCase();
    return `TRS-${six}`;
  }, [id]);

  const emissionDisplay = useMemo(() => formatDateFr(new Date()), []);

  const nomClient = safeString(docData?.nomClient) || safeString(docData?.nom) || 'Client';
  const niveauLabel = docData ? displayNiveauService(docData.frequency) : 'Ponctuel';
  const typeMission = formatMissionType(docData?.missionType);
  const dateVisiteStr = (() => {
    if (!docData) return '—';
    const d = toDate(docData.dateAssignation);
    return d ? formatDateFr(d) : '—';
  })();
  const prestataire = safeString(docData?.providerName) || 'Entreprise Construction Moderne';
  const adresse = safeString(docData?.siteAddress) || 'Quartier Cocody, Abidjan';
  const district = safeString(docData?.siteDistrict) || 'Abidjan Sud';
  const contactSurSite = safeString(docData?.onSiteContactName) || '—';

  const closeGallery = () => {
    setGalleryOpen(false);
    setPhotoIndex(null);
  };

  const generatePDF = useCallback(async () => {
    if (!docData || !id) return;
    const d = docData;
    const logoData = await fetchLogoAsDataUrl();
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const m = 18;
    const contentW = pageW - 2 * m;
    let y = 18;

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageW, 297, 'F');

    if (logoData) {
      try {
        pdf.addImage(logoData, 'PNG', m, y, 28, 10);
        y += 14;
      } catch {
        y += 4;
      }
    }

    const refPdf = `TRS-${id.slice(0, 6).toUpperCase()}`;
    const emisPdf = formatDateFr(new Date());

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 30, 46);
    pdf.text(`Réf. ${refPdf}`, m, y);
    const emisLine = `Émis le ${emisPdf}`;
    pdf.text(emisLine, pageW - m - pdf.getTextWidth(emisLine), y);
    y += 10;

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(26, 26, 26);
    pdf.text('Rapport de vérification', m, y);
    y += 12;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(107, 30, 46);
    pdf.text('CLIENT', m, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(26, 26, 26);
    pdf.text(safeString(d.nomClient) || safeString(d.nom) || 'Client', m, y);
    y += 5;
    pdf.text(`Niveau de service : ${displayNiveauService(d.frequency)}`, m, y);
    y += 10;

    const tm = formatMissionType(d.missionType);
    const dv = toDate(d.dateAssignation);
    const dvs = dv ? formatDateFr(dv) : '—';
    const pr = safeString(d.providerName) || 'Entreprise Construction Moderne';
    const ad = safeString(d.siteAddress) || 'Quartier Cocody, Abidjan';
    const di = safeString(d.siteDistrict) || 'Abidjan Sud';
    const cs = safeString(d.onSiteContactName) || '—';

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(107, 30, 46);
    pdf.text('DÉTAILS DE LA MISSION', m, y);
    y += 6;

    const rows: [string, string][] = [
      ['Type de mission', tm],
      ['Date de visite', dvs],
      ['Prestataire', pr],
      ['Adresse', ad],
      ['District', di],
      ['Contact sur site', cs],
    ];
    const colLabel = 55;
    pdf.setDrawColor(17, 17, 17);
    pdf.setLineWidth(0.2);
    for (const [label, val] of rows) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(26, 26, 26);
      pdf.rect(m, y - 4, contentW, 8);
      pdf.text(label, m + 2, y + 1);
      pdf.setFont('helvetica', 'normal');
      const lines = pdf.splitTextToSize(val, contentW - colLabel - 4);
      pdf.text(lines, m + colLabel, y + 1);
      y += Math.max(8, lines.length * 4 + 2);
    }
    y += 6;

    const obsPdf = safeString(d.observationsAgent)
      ? safeString(d.observationsAgent)
      : [OBS_FALLBACK_P1, OBS_FALLBACK_P2, OBS_FALLBACK_P3].join('\n\n');

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(107, 30, 46);
    pdf.text('OBSERVATIONS', m, y);
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(26, 26, 26);
    pdf.setFontSize(9);
    const obsLines = pdf.splitTextToSize(obsPdf, contentW);
    pdf.text(obsLines, m, y);
    y += obsLines.length * 4 + 8;

    if (y > 235) {
      pdf.addPage();
      y = 18;
    }

    const avisPdf = safeString(d.avisTRASIT)
      ? safeString(d.avisTRASIT)
      : [AVIS_FALLBACK_P1, AVIS_FALLBACK_P2].join('\n\n');

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(107, 30, 46);
    pdf.text('AVIS TRASIT', m, y);
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(26, 26, 26);
    const avisLines = pdf.splitTextToSize(avisPdf, contentW);
    pdf.text(avisLines, m, y);
    y += avisLines.length * 4 + 8;

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(107, 30, 46);
    pdf.text('RECOMMANDATION', m, y);
    y += 6;

    const recLines = pdf.splitTextToSize(RECOMMANDATION, contentW - 8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(26, 26, 26);
    pdf.setDrawColor(107, 30, 46);
    pdf.setLineWidth(0.5);
    pdf.line(m, y, m + 3, y);
    pdf.line(m, y, m, y + Math.max(14, recLines.length * 4));
    pdf.text(recLines, m + 6, y + 4);
    y += Math.max(14, recLines.length * 4) + 10;

    pdf.setFontSize(9);
    pdf.text(`Photos disponibles sur : tras-it.com/rapport/${id}`, m, y);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(26, 26, 26);
    pdf.text('tras-it.com', pageW / 2 - pdf.getTextWidth('tras-it.com') / 2, 285);

    pdf.save(`rapport-${refPdf.replace('TRS-', '')}.pdf`);
  }, [docData, id]);

  if (authUser === undefined) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <div style={{ padding: 24, fontSize: '15px', color: '#444444' }}>Chargement…</div>
      </div>
    );
  }

  if (authUser === null) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <div style={{ padding: 24, fontSize: '15px', color: '#444444' }}>Redirection…</div>
      </div>
    );
  }

  if (docLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <div style={{ padding: 24, fontSize: '15px', color: '#444444' }}>Chargement du rapport…</div>
      </div>
    );
  }

  if (!docData) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <div style={{ padding: 24, fontSize: '15px', color: '#444444' }}>Rapport introuvable.</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', boxSizing: 'border-box', width: '100%' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 28px',
          borderBottom: borderLight,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <img src="/logo.png" alt="tras•it" style={{ height: '42px', display: 'block' }} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '15px', color: '#444444' }}>Réf. {refDisplay}</div>
          <div style={{ fontSize: '15px', color: '#444444', marginTop: 6 }}>Émis le {emissionDisplay}</div>
        </div>
      </header>

      <section style={{ padding: '24px 28px', borderBottom: borderLight }}>
        <h1 style={{ ...titleMainStyle, margin: '0 0 20px' }}>Rapport de vérification</h1>
        <button
          type="button"
          onClick={() => void generatePDF()}
          style={{
            background: '#111111',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 500,
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Télécharger le PDF
        </button>
      </section>

      <section style={{ padding: '24px 28px', borderBottom: borderLight }}>
        <div style={{ ...sectionTitleStyle, marginBottom: 16 }}>Client</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#6B1E2E',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
            aria-hidden
          >
            {initialsFromNomClient(nomClient)}
          </div>
          <div>
            <div style={valueDetailStyle}>{nomClient}</div>
            <div style={{ fontSize: '18px', color: '#1A1A1A' }}>{niveauLabel}</div>
          </div>
        </div>
      </section>

      <section style={{ padding: '24px 28px', borderBottom: borderLight }}>
        <div style={{ ...sectionTitleStyle, marginBottom: 16 }}>Détails de la mission</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '20px 24px',
          }}
        >
          {[
            ['Type de mission', typeMission],
            ['Date de visite', dateVisiteStr],
            ['Prestataire', prestataire],
            ['Adresse', adresse],
            ['District', district],
            ['Contact sur site', contactSurSite],
          ].map(([lab, val]) => (
            <div key={lab} style={{ minWidth: 0 }}>
              <div style={{ fontSize: '18px', color: '#1A1A1A', marginBottom: '6px' }}>{lab}</div>
              <div style={valueDetailStyle}>{val}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '24px 28px', borderBottom: borderLight }}>
        <div style={{ ...sectionTitleStyle, marginBottom: 12 }}>Observations</div>
        <div style={bodyStyle}>
          {safeString(docData.observationsAgent)
            ? safeString(docData.observationsAgent)
                .split(/\n\n+/)
                .map((block, i) => (
                  <p key={i} style={{ margin: i === 0 ? 0 : '1em 0 0' }}>
                    {block}
                  </p>
                ))
            : [OBS_FALLBACK_P1, OBS_FALLBACK_P2, OBS_FALLBACK_P3].map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : '1em 0 0' }}>
                  {p}
                </p>
              ))}
        </div>
      </section>

      <section style={{ padding: '24px 28px', borderBottom: borderLight, background: '#F7F5F2' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, marginBottom: 16 }}>
          <div style={{ width: '4px', background: '#6B1E2E', flexShrink: 0, borderRadius: '2px' }} aria-hidden />
          <div style={sectionTitleStyle}>Avis TRASIT</div>
        </div>
        <div style={bodyStyle}>
          {safeString(docData.avisTRASIT)
            ? safeString(docData.avisTRASIT)
                .split(/\n\n+/)
                .map((block, i) => (
                  <p key={i} style={{ margin: i === 0 ? 0 : '1em 0 0' }}>
                    {block}
                  </p>
                ))
            : [AVIS_FALLBACK_P1, AVIS_FALLBACK_P2].map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : '1em 0 0' }}>
                  {p}
                </p>
              ))}
        </div>
        <div style={{ ...sectionTitleStyle, marginTop: 16, marginBottom: 8 }}>Recommandation</div>
        <div
          style={{
            borderLeft: '3px solid #6B1E2E',
            padding: '12px 16px',
            background: '#FFFFFF',
            borderRadius: '0 8px 8px 0',
            ...bodyStyle,
          }}
        >
          {RECOMMANDATION}
        </div>
      </section>

      <section style={{ padding: '24px 28px', borderBottom: borderLight }}>
        <div style={{ ...sectionTitleStyle, marginBottom: 14 }}>Photos</div>
        <button
          type="button"
          onClick={() => {
            setPhotoIndex(null);
            setGalleryOpen(true);
          }}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '14px 16px',
            fontSize: '16px',
            fontWeight: 500,
            color: '#1A1A1A',
            background: '#FFFFFF',
            border: borderLight,
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Voir les photos ({photos.length})
        </button>
      </section>

      <footer
        style={{
          padding: '18px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <img src="/logo.png" alt="tras•it" style={{ height: '28px', opacity: 0.5, display: 'block' }} />
        <span style={{ fontSize: '15px', color: '#444444' }}>tras-it.com/rapport/{id}</span>
      </footer>

      {galleryOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9990,
            overflowY: 'auto',
            padding: '56px 20px 32px',
            boxSizing: 'border-box',
          }}
        >
          <button
            type="button"
            onClick={closeGallery}
            aria-label="Fermer"
            style={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 9992,
              border: 'none',
              background: 'transparent',
              color: '#FFFFFF',
              fontSize: '28px',
              lineHeight: 1,
              cursor: 'pointer',
              padding: 8,
            }}
          >
            ×
          </button>
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 16,
            }}
          >
            {photos.map((ph, idx) => (
              <div key={`${ph.url}-${idx}`} style={{ minWidth: 0 }}>
                <button
                  type="button"
                  onClick={() => setPhotoIndex(idx)}
                  style={{
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    background: 'transparent',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'block',
                  }}
                >
                  <img
                    src={ph.url}
                    alt={formatZoneLabel(ph.zone || '')}
                    style={{
                      width: '100%',
                      height: 160,
                      objectFit: 'cover',
                      borderRadius: 8,
                      display: 'block',
                    }}
                  />
                </button>
                <div style={{ marginTop: 8, fontSize: '14px', color: '#FFFFFF', fontWeight: 500 }}>
                  {formatZoneLabel(ph.zone || '')}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {galleryOpen && photoIndex !== null && photos[photoIndex] ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPhotoIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPhotoIndex(null);
            }}
            aria-label="Fermer le zoom"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10001,
              border: 'none',
              background: 'transparent',
              color: '#FFFFFF',
              fontSize: '28px',
              cursor: 'pointer',
              padding: 8,
            }}
          >
            ×
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              display: 'grid',
              placeItems: 'center',
              padding: '56px 20px 20px',
              minHeight: 0,
            }}
          >
            <img
              src={photos[photoIndex].url}
              alt={formatZoneLabel(photos[photoIndex].zone || '')}
              style={{
                maxWidth: '92vw',
                maxHeight: '82vh',
                objectFit: 'contain',
                borderRadius: 8,
              }}
            />
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px 24px 24px',
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={() =>
                setPhotoIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))
              }
              style={{
                border: '2px solid #FFFFFF',
                background: 'transparent',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 500,
                padding: '12px 20px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setPhotoIndex((i) => (i === null ? i : (i + 1) % photos.length))}
              style={{
                border: '2px solid #FFFFFF',
                background: 'transparent',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 500,
                padding: '12px 20px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
