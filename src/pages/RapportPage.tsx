import { doc, getDoc } from 'firebase/firestore';
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

function formatDateOnly(ts: unknown): string {
  const d = toDate(ts);
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatDateTime(ts: unknown): string {
  const d = toDate(ts);
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
  return safeString(raw);
}

function formatContactOnSite(d: FicheMissionDoc): string {
  const nom = safeString(d.onSiteContactName);
  const tel = safeString(d.onSiteContactPhone);
  if (nom && tel) return `${nom} — ${tel}`;
  return nom || tel;
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

function getClientDisplayName(d: FicheMissionDoc): string {
  const fromClientName = safeString(d.clientName);
  if (fromClientName) return fromClientName;
  const prenom = safeString(d.prenom);
  const nom = safeString(d.nom);
  const combined = [prenom, nom].filter(Boolean).join(' ').trim();
  if (combined) return combined;
  const legacy = safeString(d.nomClient);
  if (legacy) return legacy;
  return 'Client';
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

  const borderBlack = '2px solid #111111';
  const borderBordeaux = '2px solid #6B1E2E';

  const container: CSSProperties = {
    maxWidth: 680,
    margin: '0 auto',
    padding: '0 20px',
    background: '#ffffff',
    boxSizing: 'border-box',
    width: '100%',
  };

  const sectionTitle: CSSProperties = {
    fontSize: 13,
    fontWeight: 900,
    color: '#111111',
    marginBottom: 14,
  };

  const text: CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: '#111111',
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

  const missionTypeRaw = docData.missionType ?? docData.typeMission;
  const niveauAffiche = safeString(docData.serviceLevel) || safeString(docData.niveauService);
  const dateVisiteSource = docData.timestamp ?? docData.dateVisite;

  const detailsRow = (label: string, value: string, isLast?: boolean) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isNarrow ? 'minmax(0, 1fr)' : 'minmax(0, 320px) minmax(0, 1fr)',
        gap: isNarrow ? 8 : 14,
        padding: '14px 12px',
        borderBottom: isLast ? 'none' : '1px solid #6B1E2E',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', wordBreak: 'break-word' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111111', minWidth: 0, wordBreak: 'break-word' }}>{value}</div>
    </div>
  );

  const logo = (
    <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1, flexShrink: 0 }}>
      <span style={{ fontSize: 24, fontWeight: 900, color: '#111111' }}>tras</span>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: '#A63D2F',
          display: 'inline-block',
          margin: '0 6px',
          transform: 'translateY(-2px)',
        }}
      />
      <span style={{ fontSize: 24, fontWeight: 900, color: '#111111' }}>it</span>
    </div>
  );

  const showVerifiedBadge = safeString(docData.statut) === 'achevée';
  const clientNameDisplay = getClientDisplayName(docData);

  const closeGallery = () => {
    setGalleryOpen(false);
    setPhotoIndex(null);
  };
  const openZoom = (idx: number) => setPhotoIndex(idx);
  const closeZoom = () => setPhotoIndex(null);
  const prevPhoto = () => setPhotoIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
  const nextPhoto = () => setPhotoIndex((i) => (i === null ? i : (i + 1) % photos.length));

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111111', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      <header style={{ borderBottom: '3px solid #111111', background: '#ffffff' }}>
        <div
          style={{
            ...container,
            paddingTop: 18,
            paddingBottom: 18,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>{logo}</div>
          <div style={{ textAlign: isNarrow ? 'left' : 'right', minWidth: 0, flex: isNarrow ? '1 1 100%' : '0 1 auto' }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#111111', wordBreak: 'break-word' }}>{safeString(docData.numerReference)}</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>{formatDateOnly(docData.dateEmission)}</div>
          </div>
        </div>
      </header>

      <section style={{ borderBottom: '1px solid #111111', background: '#ffffff' }}>
        <div
          style={{
            ...container,
            paddingTop: 14,
            paddingBottom: 14,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 900, color: '#111111', minWidth: 0, wordBreak: 'break-word', flex: showVerifiedBadge ? '1 1 auto' : '1 1 100%' }}>
            Statut de la mission : {safeString(docData.statut)}
          </div>
          {showVerifiedBadge ? (
            <div
              style={{
                fontSize: 15,
                fontWeight: 900,
                color: '#111111',
                border: borderBlack,
                padding: '8px 12px',
                borderRadius: 8,
                background: '#ffffff',
                flexShrink: 0,
              }}
            >
              Rapport vérifié
            </div>
          ) : null}
        </div>
      </section>

      <main style={{ ...container, paddingTop: 26, paddingBottom: 60 }}>
        <section style={{ border: borderBordeaux, borderRadius: 10, padding: 18, marginBottom: 18, background: '#ffffff' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: isNarrow ? 'column' : 'row',
              justifyContent: 'space-between',
              gap: 14,
              flexWrap: 'wrap',
              alignItems: isNarrow ? 'stretch' : 'flex-start',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#111111', marginBottom: 6, wordBreak: 'break-word' }}>{clientNameDisplay}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#111111', wordBreak: 'break-word' }}>{safeString(docData.numeroClient)}</div>
            </div>
            <div style={{ textAlign: isNarrow ? 'left' : 'right', minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>Niveau de service</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#111111', wordBreak: 'break-word' }}>{niveauAffiche}</div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 18, background: '#ffffff' }}>
          <div style={sectionTitle}>Détails de la mission</div>
          <div style={{ border: borderBordeaux, borderRadius: 10, overflow: 'hidden', background: '#ffffff' }}>
            {detailsRow('Type de mission', formatTypeMission(missionTypeRaw))}
            {detailsRow('Prestataire', safeString(docData.providerName))}
            {detailsRow('Adresse', safeString(docData.siteAddress))}
            {detailsRow('District', safeString(docData.siteDistrict))}
            {detailsRow('Contact sur site', formatContactOnSite(docData))}
            {detailsRow('Date de visite', formatDateOnly(dateVisiteSource))}
            {detailsRow('Date / heure émission', formatDateTime(docData.dateEmission), true)}
          </div>
        </section>

        <section style={{ marginBottom: 18, background: '#ffffff' }}>
          <div style={sectionTitle}>Photos de terrain</div>
          {photos.length === 0 ? (
            <div style={{ ...text, border: borderBlack, borderRadius: 10, padding: 14, background: '#ffffff' }}>Aucune photo disponible.</div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPhotoIndex(null);
                setGalleryOpen(true);
              }}
              style={{
                background: '#ffffff',
                border: borderBlack,
                borderRadius: 10,
                padding: '14px 18px',
                fontSize: 15,
                fontWeight: 700,
                color: '#111111',
                cursor: 'pointer',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              Voir les photos ({photos.length})
            </button>
          )}
        </section>

        <section style={{ marginBottom: 18, border: borderBlack, borderRadius: 10, padding: 18, background: '#ffffff' }}>
          <div style={{ ...sectionTitle, marginBottom: 10 }}>Observations de terrain</div>
          <div style={text}>{safeString(docData.observations)}</div>
        </section>

        <section style={{ marginBottom: 18, border: borderBlack, borderRadius: 10, padding: 18, background: '#ffffff' }}>
          <div style={{ ...sectionTitle, marginBottom: 10 }}>Avis TRASIT</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111111', marginBottom: 8 }}>Synthèse assistée par intelligence artificielle</div>
          <div style={text}>{safeString(docData.avisTrasit)}</div>
        </section>

        <section style={{ marginBottom: 18, border: borderBlack, borderRadius: 10, padding: 18, background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: borderBlack,
                display: 'grid',
                placeItems: 'center',
                fontSize: 15,
                fontWeight: 900,
                color: '#111111',
                background: '#ffffff',
                flexShrink: 0,
              }}
              aria-label="Certification officielle TRASIT"
            >
              ✓
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>
              Document officiel TRASIT : ce rapport atteste de la vérification terrain réalisée conformément aux standards
              d’indépendance et de traçabilité TRASIT.
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 18, background: '#ffffff' }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: '#ffffff',
              border: borderBlack,
              borderRadius: 10,
              padding: '14px 18px',
              fontSize: 15,
              fontWeight: 900,
              color: '#111111',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Télécharger le rapport PDF
          </button>
        </section>

        <footer
          style={{
            borderTop: '3px solid #111111',
            paddingTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            background: '#ffffff',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>TRASIT — Service de vérification terrain indépendante</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>trasit.com</div>
        </footer>
      </main>

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
