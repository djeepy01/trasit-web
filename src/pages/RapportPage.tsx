import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { jsPDF } from 'jspdf';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';

type MissionPhoto = { url: string; zone?: string };

type FicheMissionDoc = {
  nomClient?: string;
  niveauService?: string;
  typeMission?: string;
  dateVisite?: unknown;
  prestataire?: string;
  adresse?: string;
  district?: string;
  contactSurSite?: string;
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
  if (!s || s === 'standard') return 'Ponctuel';
  return safeString(raw);
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

function formatZoneLabel(zone: string): string {
  const s = zone.replace(/_/g, ' ').trim();
  if (!s) return 'Photo';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function photosFromDoc(photos: unknown): MissionPhoto[] {
  if (!Array.isArray(photos)) return [];
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

const OBS_FALLBACK_P1 =
  "La visite de vérification a été réalisée à l'adresse déclarée par le prestataire. L'agent TRASIT, mandaté de manière indépendante, a accédé au site sans restriction en présence du contact désigné par le donneur d'ordre, conformément au protocole de vérification établi.";
const OBS_FALLBACK_P2 =
  "À la date d'intervention, les fondations du bâtiment sont entièrement achevées. L'élévation du premier niveau est en cours d'exécution. Les matériaux présents sur site — sacs de ciment, ferraillage structurel, échafaudage en place — sont cohérents avec la phase de travaux déclarée par l'entrepreneur.";
const OBS_FALLBACK_P3 =
  "L'ensemble des éléments documentés a fait l'objet d'une capture photographique géolocalisée et horodatée, consultable dans la section Photos de ce rapport. Aucune anomalie majeure n'a été relevée lors de l'inspection visuelle du site.";

const AVIS_FALLBACK_P1 =
  "Sur la base des éléments collectés lors de cette mission, TRASIT confirme que l'état réel du chantier est cohérent avec les informations qui vous avaient été transmises par le prestataire. Aucun écart significatif n'a été identifié entre la phase déclarée et l'avancement effectivement constaté sur site.";
const AVIS_FALLBACK_P2 =
  "Les preuves documentaires produites dans le cadre de cette mission — photographies horodatées, coordonnées GPS enregistrées, rapport d'agent signé — sont conservées de manière sécurisée dans vos archives TRASIT et restent accessibles à tout moment depuis votre espace client.";
const RECOMMANDATION =
  "L'avancement du chantier est conforme au calendrier déclaré. TRASIT recommande de programmer une prochaine vérification lors du passage au second niveau afin de maintenir une traçabilité continue et de disposer d'une documentation actualisée à chaque étape clé.";

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
  fontWeight: 500,
  color: '#6B1E2E',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const bodyStyle = {
  fontSize: '16px',
  color: '#1A1A1A',
  lineHeight: '1.8',
};

const labelDetailStyle = {
  fontSize: '14px',
  color: '#444444',
};

const valueDetailStyle = {
  fontSize: '16px',
  fontWeight: 500,
  color: '#1A1A1A',
};

const metaStyle = {
  fontSize: '14px',
  color: '#444444',
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
        setDocData(snap.exists() ? (snap.data() as FicheMissionDoc) : null);
      } finally {
        if (mounted) setDocLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [authUser, id, navigate]);

  const photos = useMemo(() => photosFromDoc(docData?.photos), [docData]);

  const refDisplay = useMemo(() => {
    const six = (id || '').slice(0, 6).toUpperCase();
    return `TRS-${six}`;
  }, [id]);

  const emissionDisplay = useMemo(() => formatDateFr(new Date()), []);

  const nomClient = safeString(docData?.nomClient) || 'Client';
  const niveauLabel = docData ? displayNiveauService(docData.niveauService) : 'Ponctuel';
  const typeMission = safeString(docData?.typeMission) || '—';
  const dateVisiteStr = (() => {
    if (!docData) return '—';
    const d = toDate(docData.dateVisite);
    return d ? formatDateFr(d) : '—';
  })();
  const prestataire = safeString(docData?.prestataire) || '—';
  const adresse = safeString(docData?.adresse) || '—';
  const district = safeString(docData?.district) || '—';
  const contactSurSite = safeString(docData?.contactSurSite) || '—';

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
    pdf.text(safeString(d.nomClient) || 'Client', m, y);
    y += 5;
    pdf.text(`Niveau de service : ${displayNiveauService(d.niveauService)}`, m, y);
    y += 10;

    const tm = safeString(d.typeMission) || '—';
    const dv = toDate(d.dateVisite);
    const dvs = dv ? formatDateFr(dv) : '—';
    const pr = safeString(d.prestataire) || '—';
    const ad = safeString(d.adresse) || '—';
    const di = safeString(d.district) || '—';
    const cs = safeString(d.contactSurSite) || '—';

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

    const recLines = pdf.splitTextToSize(RECOMMANDATION, contentW - 8);
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
        <div style={{ padding: 24, ...metaStyle }}>Chargement…</div>
      </div>
    );
  }

  if (authUser === null) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <div style={{ padding: 24, ...metaStyle }}>Redirection…</div>
      </div>
    );
  }

  if (docLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <div style={{ padding: 24, ...metaStyle }}>Chargement du rapport…</div>
      </div>
    );
  }

  if (!docData) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <div style={{ padding: 24, ...metaStyle }}>Rapport introuvable.</div>
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
          <div style={metaStyle}>Réf. {refDisplay}</div>
          <div style={{ ...metaStyle, marginTop: 6 }}>Émis le {emissionDisplay}</div>
        </div>
      </header>

      <section style={{ padding: '24px 28px', borderBottom: borderLight }}>
        <h1 style={{ ...titleMainStyle, margin: '0 0 16px' }}>Rapport de vérification</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span
            style={{
              background: '#6B1E2E',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '4px',
              padding: '4px 10px',
            }}
          >
            Document officiel TRASIT
          </span>
        </div>
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
            <div style={{ ...metaStyle, marginTop: 6 }}>{niveauLabel}</div>
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
              <div style={{ ...labelDetailStyle, marginBottom: 4 }}>{lab}</div>
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
        <div
          style={{
            marginTop: '16px',
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
        <span style={metaStyle}>tras-it.com/rapport/{id}</span>
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
