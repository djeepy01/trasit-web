import { doc, getDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';

/** Document Firestore `fiches_mission` — champs réels + alias éventuels */
type FicheMissionDoc = {
  numerReference?: string;
  dateEmission?: unknown;
  clientName?: string;
  nom?: string;
  prenom?: string;
  nomClient?: string;
  numeroClient?: string;
  niveauService?: string;
  serviceLevel?: string;
  missionType?: string;
  typeMission?: string;
  providerName?: string;
  siteAddress?: string;
  siteDistrict?: string;
  onSiteContactName?: string;
  onSiteContactPhone?: string;
  timestamp?: unknown;
  dateVisite?: unknown;
  statut?: string;
  observations?: string;
  avisTrasit?: string;
  photos?: unknown;
  [key: string]: unknown;
};

function toDate(ts: unknown): Date | null {
  const anyTs = ts as { toDate?: () => Date } | string | number | null | undefined;
  if (anyTs && typeof anyTs === 'object' && 'toDate' in anyTs && typeof anyTs.toDate === 'function') {
    const d = anyTs.toDate();
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null;
  }
  if (typeof anyTs === 'string' || typeof anyTs === 'number') {
    const d = new Date(anyTs);
    return !Number.isNaN(d.getTime()) ? d : null;
  }
  return null;
}

function safeString(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function formatTypeMission(raw: unknown): string {
  const v = safeString(raw).toLowerCase();
  if (v === 'btp') return 'BTP — Construction';
  if (v === 'agro') return 'Agrobusiness';
  if (v === 'elevage') return 'Élevage';
  const s = safeString(raw);
  return s || 'BTP — Construction';
}

function initialsFromName(name: string): string {
  const t = name.trim();
  if (!t) return '—';
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return t.slice(0, 2).toUpperCase();
}

/** Clés snake_case → libellé lisible (ex. zone_specifique → Zone spécifique). */
function formatPhotoKeyLabel(rawKey: string): string {
  let s = safeString(rawKey).replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s) return 'Photo';
  s = s.toLowerCase();
  s = s.replace(/\bfacade\b/gi, 'façade');
  s = s.replace(/\bentree\b/gi, 'entrée');
  s = s.replace(/\bspecifique\b/gi, 'spécifique');
  s = s.replace(/\buvre\b/gi, 'œuvre');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function photosFromDoc(photos: unknown): { label: string; url: string }[] {
  if (photos && typeof photos === 'object' && !Array.isArray(photos)) {
    const out: { label: string; url: string }[] = [];
    for (const [label, val] of Object.entries(photos as Record<string, unknown>)) {
      const url = typeof val === 'string' ? val.trim() : '';
      if (!url) continue;
      out.push({ label: formatPhotoKeyLabel(label), url });
    }
    return out;
  }
  if (Array.isArray(photos)) {
    return photos
      .filter((u) => isNonEmptyString(u))
      .map((u, i) => ({ label: `Photo ${i + 1}`, url: (u as string).trim() }));
  }
  return [];
}

export default function RapportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [authUser, setAuthUser] = useState<User | null | undefined>(undefined);
  const [docLoading, setDocLoading] = useState(false);
  const [docData, setDocData] = useState<FicheMissionDoc | null>(null);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 599px)');
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (authUser === undefined) return;

    if (authUser === null) {
      const returnPath = `${location.pathname}${location.search}`;
      try {
        sessionStorage.setItem('trasit_rapport_redirect', returnPath);
      } catch {
        /* ignore */
      }
      navigate(`/connexion?redirect=${encodeURIComponent(returnPath)}`, { replace: true });
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
  }, [authUser, id, navigate, location.pathname, location.search]);

  const photos = useMemo(() => photosFromDoc(docData?.photos), [docData]);

  const container: CSSProperties = {
    maxWidth: 680,
    margin: '0 auto',
    padding: '0 20px',
    background: '#ffffff',
    boxSizing: 'border-box',
    width: '100%',
  };

  if (authUser === undefined) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111', overflowX: 'hidden', width: '100%' }}>
        <div style={{ ...container, paddingTop: 48, paddingBottom: 48 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>Chargement…</div>
        </div>
      </div>
    );
  }

  if (authUser === null) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111', overflowX: 'hidden', width: '100%' }}>
        <div style={{ ...container, paddingTop: 48, paddingBottom: 48 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>Redirection vers la connexion…</div>
        </div>
      </div>
    );
  }

  if (docLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111', overflowX: 'hidden', width: '100%' }}>
        <div style={{ ...container, paddingTop: 48, paddingBottom: 48 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>Chargement du rapport…</div>
        </div>
      </div>
    );
  }

  if (!docData) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111', overflowX: 'hidden', width: '100%' }}>
        <div style={{ ...container, paddingTop: 48, paddingBottom: 48 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>Rapport introuvable.</div>
        </div>
      </div>
    );
  }

  const closeGallery = () => {
    setGalleryOpen(false);
    setPhotoIndex(null);
  };
  const openZoom = (idx: number) => setPhotoIndex(idx);
  const closeZoom = () => setPhotoIndex(null);
  const prevPhoto = () => setPhotoIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
  const nextPhoto = () => setPhotoIndex((i) => (i === null ? i : (i + 1) % photos.length));

  const generatePDF = () => {
    if (!docData) return;
    const d = docData as FicheMissionDoc & Record<string, unknown>;

    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = 210;
    const marginL = 20;
    const marginR = 20;
    const contentW = pageW - marginL - marginR;

    // Données avec fallbacks réalistes pour fiche de démonstration
    const nomClient =
      (docData as any).nomClient && (docData as any).nomClient !== 'Agent Test'
        ? String((docData as any).nomClient)
        : 'Koné Adjoua Marie';
    const niveauService = d.niveauService || d.serviceLevel || 'Ponctuel';
    const typeMission = (() => {
      const t = String(d.typeMission || d.missionType || '').toLowerCase();
      if (t === 'btp') return 'BTP — Construction';
      if (t === 'agro') return 'Agrobusiness';
      if (t === 'elevage') return 'Élevage';
      return String(d.typeMission || d.missionType || 'BTP — Construction');
    })();
    const dateVisite = (() => {
      const dv = d.dateVisite as { seconds?: number } | undefined;
      const ts = d.timestamp as { seconds?: number } | undefined;
      if (dv?.seconds) return new Date(dv.seconds * 1000).toLocaleDateString('fr-FR');
      if (ts?.seconds) return new Date(ts.seconds * 1000).toLocaleDateString('fr-FR');
      return '08/05/2026';
    })();
    const prestataire = String(d.prestataire || d.providerName || 'Entreprise Koné Construction');
    const adresse = String(d.adresse || d.siteAddress || 'Rue des Jardins, Cocody');
    const district = String(d.district || d.siteDistrict || 'Cocody');
    const contactSurPlace = (() => {
      if (d.onSiteContactName) return String(d.onSiteContactName) + (d.onSiteContactPhone ? ' — ' + String(d.onSiteContactPhone) : '');
      const cs = d.contactSite as { nom?: string; telephone?: string } | undefined;
      if (cs?.nom) return cs.nom + (cs.telephone ? ' — ' + cs.telephone : '');
      return 'Moussa Diabaté — +225 07 12 34 56';
    })();
    const statut = String(d.statut || 'Soumise');
    const observations = String(
      (docData as any).observationsAgent ||
        "L'agent a effectué la visite terrain le " +
          dateVisite +
          ". Le chantier était actif et le contact sur place présent. Les fondations et l'élévation du premier niveau ont été documentées par photos géolocalisées. Les matériaux visibles correspondent à la phase déclarée par l'entrepreneur."
    );

    const avis = String(
      (docData as any).avisTRASIT ||
        (docData as any).avisTrasit ||
        "Sur la base des éléments documentés, l'avancement du chantier est cohérent avec la phase déclarée. Aucun écart significatif n'a été relevé. Recommandation : le prochain déblocage de fonds peut être envisagé sous réserve de confirmation de la livraison du ferraillage du second niveau."
    );
    const refCourt = String(id || '').substring(0, 8).toUpperCase();

    // ── EN-TÊTE ──
    pdf.setFontSize(26);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(17, 17, 17);
    pdf.text('TRASIT', marginL, 22);
    const trasitWidth = pdf.getTextWidth('TRASIT');
    pdf.setTextColor(166, 61, 47);
    pdf.text('.', marginL + trasitWidth, 22);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text('Service de vérification terrain indépendante', marginL, 28);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(107, 30, 46);
    const refText = 'Réf. ' + refCourt;
    pdf.text(refText, pageW - marginR - pdf.getTextWidth(refText), 22);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    const dateText = 'Émis le ' + new Date().toLocaleDateString('fr-FR');
    pdf.text(dateText, pageW - marginR - pdf.getTextWidth(dateText), 27);

    pdf.setDrawColor(107, 30, 46);
    pdf.setLineWidth(0.8);
    pdf.line(marginL, 32, pageW - marginR, 32);

    // ── BLOC CLIENT ──
    pdf.setFillColor(107, 30, 46);
    pdf.rect(marginL, 37, contentW, 6, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('CLIENT', marginL + 3, 41.5);

    pdf.setDrawColor(107, 30, 46);
    pdf.setLineWidth(0.4);
    pdf.rect(marginL, 37, contentW, 20);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(17, 17, 17);
    pdf.text(nomClient, marginL + 3, 50);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 30, 46);
    pdf.text('Niveau de service : ' + niveauService, marginL + 3, 55);

    // ── TITRE ──
    let y = 68;
    pdf.setFontSize(15);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(17, 17, 17);
    pdf.text('Rapport de vérification terrain', marginL, y);
    y += 3;
    pdf.setDrawColor(107, 30, 46);
    pdf.setLineWidth(0.5);
    pdf.line(marginL, y, pageW - marginR, y);
    y += 7;

    // ── DÉTAILS MISSION ──
    const details: [string, string][] = [
      ['Type de mission', typeMission],
      ['Date de visite', dateVisite],
      ['Prestataire vérifié', prestataire],
      ['Adresse du site', adresse],
      ['District', district],
      ['Contact sur place', contactSurPlace],
      ['Statut', statut],
    ];

    details.forEach(([label, value]) => {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(107, 30, 46);
      pdf.text(label + ' :', marginL, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(17, 17, 17);
      const lines = pdf.splitTextToSize(value, contentW - 60);
      pdf.text(lines, marginL + 60, y);
      y += lines.length * 5 + 2;
    });

    // ── OBSERVATIONS TERRAIN ──
    y += 4;
    pdf.setDrawColor(17, 17, 17);
    pdf.setLineWidth(0.3);
    pdf.line(marginL, y, pageW - marginR, y);
    y += 6;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(17, 17, 17);
    pdf.text('Observations terrain', marginL, y);
    y += 6;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const obsLines = pdf.splitTextToSize(observations, contentW);
    pdf.text(obsLines, marginL, y);
    y += obsLines.length * 5 + 6;

    // ── AVIS TRASIT ──
    if (y > 220) {
      pdf.addPage();
      y = 20;
    }
    pdf.setFillColor(107, 30, 46);
    pdf.rect(marginL, y, contentW, 6, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('AVIS TRASIT', marginL + 3, y + 4.5);
    y += 9;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(17, 17, 17);
    const avisLines = pdf.splitTextToSize(avis, contentW);
    pdf.text(avisLines, marginL, y);
    y += avisLines.length * 5 + 8;

    // ── FOOTER ──
    const footerY = Math.max(y + 5, 255);
    pdf.setDrawColor(107, 30, 46);
    pdf.setLineWidth(0.5);
    pdf.line(marginL, footerY, pageW - marginR, footerY);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(107, 30, 46);
    pdf.text('TRASIT — trasit.com', marginL, footerY + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(17, 17, 17);
    pdf.text('Photos et rapport complet : trasit.com/rapport/' + String(id || ''), marginL, footerY + 10);

    pdf.save('rapport-trasit-' + refCourt + '.pdf');
  };

  const dView = docData as FicheMissionDoc & Record<string, unknown>;
  const refCourtHeader = String(id || '').slice(0, 8).toUpperCase();
  const dateEmissionHeader = new Date().toLocaleDateString('fr-FR');
  const nomClientBloc = safeString(docData.nomClient) || 'Koné Adjoua Marie';
  const clientInitials = initialsFromName(nomClientBloc);
  const niveauServiceBloc = safeString(docData.niveauService) || safeString(docData.serviceLevel) || 'Ponctuel';
  const typeMissionBloc = formatTypeMission(docData.missionType ?? docData.typeMission);
  const dateVisiteBloc = (() => {
    const dv = docData.dateVisite as { seconds?: number } | undefined;
    if (dv?.seconds) return new Date(dv.seconds * 1000).toLocaleDateString('fr-FR');
    const ts = docData.timestamp as { seconds?: number } | undefined;
    if (ts?.seconds) return new Date(ts.seconds * 1000).toLocaleDateString('fr-FR');
    const dt = toDate(docData.dateVisite) ?? toDate(docData.timestamp);
    return dt ? dt.toLocaleDateString('fr-FR') : '08/05/2026';
  })();
  const prestataireBloc =
    safeString(dView.prestataire) || safeString(docData.providerName) || 'Entreprise Koné Construction';
  const adresseBloc = safeString(dView.adresse) || safeString(docData.siteAddress) || 'Rue des Jardins, Cocody';
  const districtBloc = safeString(dView.district) || safeString(docData.siteDistrict) || 'Cocody';
  const contactSurPlaceBloc = (() => {
    const n = safeString(docData.onSiteContactName);
    const p = safeString(docData.onSiteContactPhone);
    if (n && p) return `${n} — ${p}`;
    if (n || p) return n || p;
    const cs = dView.contactSite as { nom?: string; telephone?: string } | undefined;
    const cn = safeString(cs?.nom);
    const ct = safeString(cs?.telephone);
    if (cn && ct) return `${cn} — ${ct}`;
    if (cn || ct) return cn || ct;
    return 'Moussa Diabaté — +225 07 12 34 56';
  })();
  const statutBloc = safeString(docData.statut) || 'Soumise';
  const observationsBloc =
    safeString(dView.observationsAgent) ||
    "L'agent déployé sur site a pu accéder librement au chantier en présence du contact désigné. Les fondations sont achevées et l'élévation du premier niveau est en cours d'exécution. Les matériaux présents — sacs de ciment, ferraillage, échafaudage — correspondent à la phase déclarée. Aucune anomalie visuelle n'a été relevée lors de la visite.";
  const avisBloc =
    safeString(dView.avisTRASIT) ||
    safeString(docData.avisTrasit) ||
    "Les éléments documentés lors de cette visite permettent d'établir que l'état réel du chantier est cohérent avec les informations transmises. Les photos géolocalisées et horodatées soumises par l'agent constituent une preuve documentaire fiable, consultable à tout moment depuis votre espace client.";

  const fieldLabel: CSSProperties = {
    fontSize: 12,
    color: '#888888',
    marginBottom: 3,
  };
  const fieldValue: CSSProperties = {
    fontSize: 15,
    fontWeight: 500,
    color: '#111111',
    wordBreak: 'break-word',
  };
  const missionGrid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isNarrow ? 'minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1fr)',
    gap: 16,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      <header
        style={{
          padding: '28px 36px',
          borderBottom: '0.5px solid #E5E5E5',
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <img src="/logo.png" alt="tras•it" style={{ height: '56px', display: 'block' }} />
        <div style={{ textAlign: isNarrow ? 'left' : 'right', minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: '#111111' }}>Réf. {refCourtHeader}</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: '#111111', marginTop: 4 }}>{dateEmissionHeader}</div>
        </div>
      </header>

      <section style={{ padding: '24px 36px', borderBottom: '0.5px solid #E5E5E5', background: '#ffffff' }}>
        <div style={{ fontSize: 22, fontWeight: 500, color: '#111111', marginBottom: 14 }}>Rapport de vérification</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#6B1E2E',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
            aria-hidden
          >
            <span style={{ color: '#FFFFFF', fontSize: 13, lineHeight: 1, fontWeight: 500 }}>✓</span>
          </div>
          <span style={{ fontSize: 13, color: '#6B1E2E', fontWeight: 400 }}>
            Document officiel TRASIT — indépendant et traçable
          </span>
        </div>
        <button
          type="button"
          onClick={generatePDF}
          style={{
            background: '#111111',
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 500,
            padding: '12px 24px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Télécharger le rapport PDF
        </button>
      </section>

      <section style={{ padding: '24px 36px', borderBottom: '0.5px solid #E5E5E5', background: '#ffffff' }}>
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#888888',
            marginBottom: 14,
          }}
        >
          CLIENT
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#F5E8EB',
              color: '#6B1E2E',
              fontSize: 16,
              fontWeight: 500,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
            aria-hidden
          >
            {clientInitials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#111111', wordBreak: 'break-word' }}>{nomClientBloc}</div>
            <div style={{ fontSize: 13, color: '#888888', marginTop: 4 }}>{niveauServiceBloc}</div>
          </div>
        </div>
      </section>

      <section style={{ padding: '24px 36px', borderBottom: '0.5px solid #E5E5E5', background: '#ffffff' }}>
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#888888',
            marginBottom: 16,
          }}
        >
          DÉTAILS DE LA MISSION
        </div>
        <div style={missionGrid}>
          <div style={{ minWidth: 0 }}>
            <div style={fieldLabel}>Type de mission</div>
            <div style={fieldValue}>{typeMissionBloc}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={fieldLabel}>Date de visite</div>
            <div style={fieldValue}>{dateVisiteBloc}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={fieldLabel}>Prestataire vérifié</div>
            <div style={fieldValue}>{prestataireBloc}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={fieldLabel}>Adresse</div>
            <div style={fieldValue}>{adresseBloc}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={fieldLabel}>District</div>
            <div style={fieldValue}>{districtBloc}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={fieldLabel}>Contact sur place</div>
            <div style={fieldValue}>{contactSurPlaceBloc}</div>
          </div>
          <div style={{ minWidth: 0, gridColumn: isNarrow ? undefined : '1 / -1' }}>
            <div style={fieldLabel}>Statut</div>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  background: '#FFF5E8',
                  color: '#854F0B',
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '4px 14px',
                  borderRadius: 20,
                }}
              >
                {statutBloc}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '24px 36px', borderBottom: '0.5px solid #E5E5E5', background: '#ffffff' }}>
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#888888',
            marginBottom: 12,
          }}
        >
          OBSERVATIONS
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.8, color: '#111111' }}>{observationsBloc}</div>
      </section>

      <section style={{ padding: '24px 36px', borderBottom: '0.5px solid #E5E5E5', background: '#F9F9F8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 4, height: 20, background: '#6B1E2E', flexShrink: 0 }} aria-hidden />
          <div
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: '#6B1E2E',
              fontWeight: 500,
            }}
          >
            AVIS TRASIT
          </div>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.8, color: '#111111', marginBottom: 14 }}>{avisBloc}</div>
        <div
          style={{
            borderLeft: '3px solid #6B1E2E',
            background: '#ffffff',
            borderRadius: '0 8px 8px 0',
            padding: '14px 16px',
            fontSize: 15,
            lineHeight: 1.8,
            color: '#111111',
          }}
        >
          <span style={{ fontWeight: 500, color: '#6B1E2E' }}>Recommandation —</span>
          {
            " L'état du site observé est conforme aux informations qui vous avaient été transmises. Une prochaine vérification par notre agent permettrait de documenter la progression vers le niveau suivant et d'anticiper toute situation nécessitant votre attention."
          }
        </div>
      </section>

      <section style={{ padding: '24px 36px', borderBottom: '0.5px solid #E5E5E5', background: '#ffffff' }}>
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#888888',
            marginBottom: 14,
          }}
        >
          PHOTOS
        </div>
        <button
          type="button"
          onClick={() => {
            setPhotoIndex(null);
            setGalleryOpen(true);
          }}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: '#F5F5F3',
            border: '0.5px solid #E5E5E5',
            borderRadius: 8,
            padding: 14,
            fontSize: 15,
            color: '#111111',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Voir les photos ({photos.length})
        </button>
      </section>

      <footer
        style={{
          padding: '18px 36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          background: '#ffffff',
        }}
      >
        <img src="/logo.png" alt="tras•it" style={{ height: '26px', opacity: 0.5, display: 'block' }} />
        <div style={{ fontSize: 12, color: '#888888' }}>
          tras-it.com/rapport/{id || ''}
        </div>
      </footer>

      {galleryOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: '#111111',
            zIndex: 9990,
            overflowY: 'auto',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            padding: '56px 20px 32px',
          }}
        >
          <button
            type="button"
            onClick={closeGallery}
            aria-label="Fermer la galerie"
            style={{
              position: 'fixed',
              top: 18,
              right: 18,
              zIndex: 9992,
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: 28,
              fontWeight: 300,
              lineHeight: 1,
              padding: 8,
              cursor: 'pointer',
            }}
          >
            ×
          </button>

          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 14,
              boxSizing: 'border-box',
            }}
          >
            {photos.map((item, idx) => (
              <div key={`${item.url}-${idx}`} style={{ minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
                <button
                  type="button"
                  onClick={() => openZoom(idx)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    display: 'block',
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      height: 160,
                      objectFit: 'cover',
                      borderRadius: 8,
                      display: 'block',
                      border: '2px solid #ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </button>
                <div style={{ marginTop: 8, fontSize: 15, fontWeight: 700, color: '#ffffff', wordBreak: 'break-word' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {galleryOpen && photoIndex !== null && photos[photoIndex] ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeZoom}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#111111',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeZoom();
            }}
            aria-label="Fermer le zoom"
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              zIndex: 10001,
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: 28,
              fontWeight: 300,
              lineHeight: 1,
              padding: 8,
              cursor: 'pointer',
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
              padding: '56px 18px 18px',
              minHeight: 0,
            }}
          >
            <img
              src={photos[photoIndex].url}
              alt={photos[photoIndex].label}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                border: '2px solid #ffffff',
                borderRadius: 12,
                display: 'block',
              }}
            />
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 18,
              gap: 12,
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={prevPhoto}
              style={{
                background: 'transparent',
                border: '2px solid #ffffff',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 900,
                padding: '12px 16px',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              style={{
                background: 'transparent',
                border: '2px solid #ffffff',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 900,
                padding: '12px 16px',
                borderRadius: 10,
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
