import { useCallback, useEffect, useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

type MissionDoc = {
  id: string;
  uid: string;
  timestamp?: { toDate: () => Date } | null;
  statut?: string;
  missionType?: string;
  siteAddress?: string;
  siteDistrict?: string;
};

function missionTypeLabel(v?: string) {
  if (v === 'btp') return 'Construction & BTP';
  if (v === 'agro') return 'Agrobusiness';
  if (v === 'commerce') return 'Commerce & Gestion';
  return 'Mission';
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
  }).format(d).replace(':', 'h');
  return `${datePart} à ${timePart}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState<MissionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [expandedId, setExpandedId] = useState<string>('');

  const handleSignOut = useCallback(async () => {
    await signOut(auth);
    navigate('/connexion');
  }, [navigate]);

  const openWhatsApp = useCallback(() => {
    // NOTE: Remplacer par le numéro WhatsApp officiel TRASIT (format international sans +)
    const trasitWhatsAppNumber = '0000000000';
    const url = `https://wa.me/${trasitWhatsAppNumber}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setUser(user ?? null);
      try {
        if (!user?.uid) {
          setMissions([]);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, 'fiches_mission'),
          where('uid', '==', user.uid),
          orderBy('timestamp', 'desc')
        );

        const snap = await getDocs(q);
        const docs: MissionDoc[] = snap.docs.map((doc) => {
          const data = doc.data() as Omit<MissionDoc, 'id'>;
          return { id: doc.id, ...data };
        });

        setMissions(docs);
        setLoading(false);
      } catch {
        setMissions([]);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const hasMissions = useMemo(() => (Array.isArray(missions) ? missions.length > 0 : false), [missions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', textAlign: 'center' }}>Chargement...</div>
      </div>
    );
  }

  // Si l'utilisateur est déconnecté ou indisponible, on ne rend rien (évite un rendu cassé au 1er montage).
  if (!user?.uid) {
    return null;
  }

  return (
    <div className="bg-white px-6 py-12" style={{ paddingTop: '80px' }}>
      <div className="max-w-7xl mx-auto">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          borderBottom: '1px solid #DDDDDD',
          marginBottom: '32px'
        }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0D2F4A', margin: 0 }}>
            Vos missions
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/fiche-mission')}
              style={{
                background: '#1E5FA6',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '8px',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Nouvelle fiche
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                background: '#8B1A1A',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '8px',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {hasMissions && Array.isArray(missions) ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '12px' }}>
              {missions?.map((m) => {
                const d = m.timestamp?.toDate ? m.timestamp.toDate() : null;
                const dateText = d ? formatFrenchDate(d) : '';
                const address = [m.siteAddress, m.siteDistrict].filter(Boolean).join(' — ');
                const isExpanded = expandedId === m.id;

                return (
                  <div
                    key={m.id}
                    style={{
                      width: '100%',
                      border: '1px solid #DDDDDD',
                      borderRadius: '12px',
                      padding: '16px',
                      background: '#FFFFFF',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A1A' }}>{missionTypeLabel(m.missionType)}</div>
                        <div style={{ marginTop: '6px', fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.7 }}>
                          {address}
                        </div>
                        {dateText ? (
                          <div style={{ marginTop: '6px', fontSize: '16px', fontWeight: 500, color: '#1A1A1A' }}>
                            {dateText}
                          </div>
                        ) : null}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <div
                          style={{
                            background: '#FEF3C7',
                            color: '#92400E',
                            border: '1px solid #F59E0B',
                            borderRadius: '999px',
                            padding: '6px 10px',
                            fontSize: '16px',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          En attente
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/rapport/${m.id}`)}
                          style={{
                            background: '#1E5FA6',
                            color: '#FFFFFF',
                            fontSize: '16px',
                            fontWeight: 700,
                            borderRadius: '8px',
                            padding: '10px 14px',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Voir le détail
                        </button>
                      </div>
                    </div>

                    {isExpanded ? (
                      <div style={{ marginTop: '12px', borderTop: '1px solid #EEEEEE', paddingTop: '12px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.7 }}>
                          Statut : En attente
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center mt-12">
            <div
              style={{
                width: '100%',
                maxWidth: '720px',
                background: '#F5F5F5',
                border: '1px solid #DDDDDD',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
              }}
            >
              <div className="flex justify-center">
                <Inbox size={40} style={{ color: '#1A1A1A' }} aria-hidden />
              </div>

              <div className="mt-5" style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
                Aucune mission en cours
              </div>
              <div className="mt-3" style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A' }}>
                Soumettez votre première demande via WhatsApp.
              </div>

              <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => navigate('/fiche-mission')}
                  style={{
                    background: '#1E5FA6',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    padding: '14px 26px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Créer une fiche de mission
                </button>
                <button
                  type="button"
                  onClick={openWhatsApp}
                  style={{
                    background: '#8B1A1A',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    padding: '14px 26px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Soumettre via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

