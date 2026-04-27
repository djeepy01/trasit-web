import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ShoppingBag, HardHat, CheckCircle2, Upload, X } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import emailjs from '@emailjs/browser';
import { onAuthStateChanged, type User } from 'firebase/auth';

type MissionType = 'btp' | 'agro' | 'commerce' | '';
type AgroSubtype = 'animaux' | 'cultures' | 'les-deux' | '';
type Frequency = 'unique' | 'suivi' | '';
type ServiceLevel = 'standard' | 'renforce' | '';

const COLORS = {
  navy: '#0D2F4A',
  primary: '#1E5FA6',
  light: '#EBF2FA',
  burgundy: '#8B1A1A',
  text: '#1A1A1A',
  white: '#FFFFFF',
  orange: '#C25A00',
  border: '#DDDDDD',
};

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px solid ${active || done ? COLORS.primary : COLORS.border}`,
          background: active ? COLORS.light : COLORS.white,
          flex: '0 0 auto',
        }}
        aria-hidden
      >
        {done ? <CheckCircle2 size={18} style={{ color: COLORS.primary }} /> : null}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text, lineHeight: 1.2 }}>{label}</div>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text, marginBottom: '8px' }}>{children}</div>
  );
}

function HelperNote({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: 'info' | 'warning';
}) {
  const bg = variant === 'info' ? COLORS.light : '#FEF3C7';
  const border = variant === 'info' ? COLORS.primary : '#F59E0B';
  const color = COLORS.text;
  return (
    <div
      style={{
        background: bg,
        border: `2px solid ${border}`,
        borderLeft: variant === 'warning' ? `5px solid ${border}` : undefined,
        borderRadius: '8px',
        padding: '16px 20px',
        fontSize: '16px',
        fontWeight: 500,
        color,
        lineHeight: 1.7,
      }}
    >
      {variant === 'warning' ? <span aria-hidden>⚠️ </span> : null}
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        height: '52px',
        fontSize: '16px',
        border: '2px solid #94A3B8',
        borderRadius: '8px',
        padding: '0 16px',
        color: COLORS.text,
        background: COLORS.white,
        outline: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        boxSizing: 'border-box',
        ...(props.style || {}),
      }}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{
        width: '100%',
        minHeight: '110px',
        fontSize: '16px',
        border: '2px solid #94A3B8',
        borderRadius: '8px',
        padding: '12px 16px',
        color: COLORS.text,
        background: COLORS.white,
        outline: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        boxSizing: 'border-box',
        lineHeight: 1.7,
        resize: 'vertical',
        ...(props.style || {}),
      }}
    />
  );
}

function SelectButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: '44px',
        padding: '0 14px',
        borderRadius: '8px',
        border: `2px solid ${active ? COLORS.primary : '#94A3B8'}`,
        background: active ? COLORS.light : COLORS.white,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        color: COLORS.text,
        fontSize: '16px',
        fontWeight: 700,
        outline: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

export default function FicheMission() {
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [missionType, setMissionType] = useState<MissionType>('btp');

  // SECTION A
  const [providerName, setProviderName] = useState('Entreprise Koné Construction');
  const [providerRegistration, setProviderRegistration] = useState('CI-ABJ-2023-456');
  const [providerOtherInfo, setProviderOtherInfo] = useState('Entrepreneur actif depuis 2018');

  // SECTION B
  const [siteAddress, setSiteAddress] = useState('Rue des Jardins, Cocody');
  const [siteDistrict, setSiteDistrict] = useState('Cocody');
  const [siteLandmarks, setSiteLandmarks] = useState('En face du marché Gouro, à 200m de la pharmacie centrale');
  const [siteExtraInfo, setSiteExtraInfo] = useState('Portail rouge, maison avec mur en parpaing visible depuis la rue');

  // SECTION C
  const [onSiteContactName, setOnSiteContactName] = useState('Moussa Diabaté');
  const [onSiteContactPhone, setOnSiteContactPhone] = useState('+225 07 12 34 56');

  // SECTION D (dynamic)
  const [btpConstructionType, setBtpConstructionType] = useState('Villa R+1');
  const [btpLevels, setBtpLevels] = useState('2');
  const [btpSurface, setBtpSurface] = useState('180m²');
  const [btpCurrentState, setBtpCurrentState] = useState('Fondations et dalle du rez-de-chaussée posées selon l entrepreneur');
  const [btpToVerify, setBtpToVerify] = useState('Vérifier l avancement réel des travaux et la qualité des matériaux utilisés');

  const [agroSubtype, setAgroSubtype] = useState<AgroSubtype>('');
  const [agroDeclared, setAgroDeclared] = useState('');
  const [agroToVerify, setAgroToVerify] = useState('');

  const [commerceActivity, setCommerceActivity] = useState('');
  const [commerceToVerify, setCommerceToVerify] = useState('');

  // SECTION E
  const [frequency, setFrequency] = useState<Frequency>('unique');
  const [followupSteps, setFollowupSteps] = useState('');

  // SECTION F
  const [providerPhotos, setProviderPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  // SECTION G
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>('standard');

  // ÉTAPE 3
  const [confirmed, setConfirmed] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const urls = providerPhotos.map((f) => URL.createObjectURL(f));
    setPhotoUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [providerPhotos]);

  const requiredErrorsStep2 = useMemo(() => {
    const errs: string[] = [];
    if (!providerName.trim()) errs.push('Prestataire: Nom complet ou raison sociale (obligatoire).');
    if (!siteAddress.trim()) errs.push('Localisation: Adresse complète (obligatoire).');
    if (!siteDistrict.trim()) errs.push('Localisation: Quartier (obligatoire).');
    if (!siteLandmarks.trim()) errs.push('Localisation: Deux repères visibles proches (obligatoire).');
    if (!onSiteContactName.trim()) errs.push('Contact sur place: Nom du contact (obligatoire).');
    if (!onSiteContactPhone.trim()) errs.push('Contact sur place: Téléphone du contact (obligatoire).');
    if (!frequency) errs.push('Fréquence: sélection obligatoire.');
    if (frequency === 'suivi' && !followupSteps.trim()) errs.push('Fréquence: précisez les étapes souhaitées.');
    if (!serviceLevel) errs.push('Niveau de service: sélection obligatoire.');

    if (missionType === 'btp') {
      if (!btpConstructionType.trim()) errs.push('Mission BTP: Type de construction (obligatoire).');
      if (!btpLevels.trim()) errs.push('Mission BTP: Nombre de niveaux (obligatoire).');
      if (!btpCurrentState.trim()) errs.push('Mission BTP: État actuel déclaré des travaux (obligatoire).');
      if (!btpToVerify.trim()) errs.push('Mission BTP: Ce que vous souhaitez vérifier (obligatoire).');
    }
    if (missionType === 'agro') {
      if (!agroSubtype) errs.push('Mission Agrobusiness: Type (obligatoire).');
      if (!agroDeclared.trim()) errs.push('Mission Agrobusiness: Effectif ou surface déclarés (obligatoire).');
      if (!agroToVerify.trim()) errs.push('Mission Agrobusiness: Ce que vous souhaitez vérifier (obligatoire).');
    }
    if (missionType === 'commerce') {
      if (!commerceActivity.trim()) errs.push('Mission Commerce: Type d’activité (obligatoire).');
      if (!commerceToVerify.trim()) errs.push('Mission Commerce: Ce que vous souhaitez vérifier (obligatoire).');
    }
    return errs;
  }, [
    providerName,
    siteAddress,
    siteDistrict,
    siteLandmarks,
    onSiteContactName,
    onSiteContactPhone,
    missionType,
    btpConstructionType,
    btpLevels,
    btpCurrentState,
    btpToVerify,
    agroSubtype,
    agroDeclared,
    agroToVerify,
    commerceActivity,
    commerceToVerify,
    frequency,
    followupSteps,
    serviceLevel,
  ]);

  if (authLoading) return null;
  if (!currentUser) {
    navigate('/connexion');
    return null;
  }

  const canGoStep2 = missionType !== '';

  const canGoStep3 = requiredErrorsStep2.length === 0;

  const missionTypeLabel =
    missionType === 'btp' ? 'Construction & BTP' : missionType === 'agro' ? 'Agrobusiness' : missionType === 'commerce' ? 'Commerce & Gestion' : '';

  const onNext = () => {
    setError('');
    if (step === 1) {
      if (!canGoStep2) {
        setError('Veuillez sélectionner un type de mission pour continuer.');
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!canGoStep3) {
        setError('Veuillez compléter tous les champs obligatoires avant de continuer.');
        return;
      }
      setStep(3);
      return;
    }
  };

  const onBack = () => {
    setError('');
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const onPickPhotos = (files: FileList | null) => {
    if (!files) return;
    const picked = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setProviderPhotos((prev) => [...prev, ...picked]);
  };

  const removePhoto = (idx: number) => {
    setProviderPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async () => {
    setError('');
    const user = auth.currentUser;
    if (!user) {
      setError('Non connecté.');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'fiches_mission'), {
        uid: user.uid,
        timestamp: serverTimestamp(),
        statut: 'en_attente',
        missionType,
        providerName,
        siteAddress,
        siteDistrict,
        onSiteContactName,
        onSiteContactPhone,
        frequency,
        serviceLevel,
      });
      console.log('FICHE SAUVEGARDÉE:', docRef.id);

      const formData = {
        providerName,
        providerRegistration,
        providerOther: providerOtherInfo,
        siteAddress,
        siteDistrict,
        siteLandmarks,
        siteExtra: siteExtraInfo,
        contactName: onSiteContactName,
        contactPhone: onSiteContactPhone,
        missionType,
        missionDescription:
          missionType === 'btp'
            ? `Type: ${btpConstructionType || ''}\nNiveaux: ${btpLevels || ''}\nSuperficie: ${btpSurface || ''}\nÉtat déclaré: ${btpCurrentState || ''}\nÀ vérifier: ${btpToVerify || ''}`
            : missionType === 'agro'
              ? `Type: ${agroSubtype || ''}\nDéclaré: ${agroDeclared || ''}\nÀ vérifier: ${agroToVerify || ''}`
              : missionType === 'commerce'
                ? `Activité: ${commerceActivity || ''}\nÀ vérifier: ${commerceToVerify || ''}`
                : '',
        frequency,
        serviceLevel,
      };

      await emailjs.send(
        'service_lv4j5fj',
        'template_0p8uw7j',
        {
          fiche_id: docRef.id,
          submitted_at: new Date().toLocaleString('fr-FR'),
          client_email: auth.currentUser?.email || '',
          provider_name: formData.providerName || '',
          provider_registration: formData.providerRegistration || '',
          provider_other: formData.providerOther || '',
          site_address: formData.siteAddress || '',
          site_district: formData.siteDistrict || '',
          site_landmarks: formData.siteLandmarks || '',
          site_extra: formData.siteExtra || '',
          contact_name: formData.contactName || '',
          contact_phone: formData.contactPhone || '',
          mission_type:
            formData.missionType === 'btp'
              ? 'Construction & BTP'
              : formData.missionType === 'agro'
                ? 'Agrobusiness'
                : 'Commerce & Gestion',
          mission_description: formData.missionDescription || '',
          mission_frequency: formData.frequency === 'unique' ? 'Rapport unique' : 'Suivi plusieurs étapes',
          service_level: formData.serviceLevel || '',
          photos_count: providerPhotos?.length || 0,
        },
        '-sXb-qvOyZDE-qVe9'
      );

      navigate('/dashboard');
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      setError('Erreur: ' + message);
    }
  };

  return (
    <>
      <div style={{ background: COLORS.white, minHeight: '100vh', padding: '48px 24px', color: '#1A1A1A' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', color: '#1A1A1A' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', color: '#1A1A1A' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: COLORS.primary, letterSpacing: '2px' }}>
                FICHE DE MISSION
              </div>
              <h1 style={{ marginTop: '10px', fontSize: '32px', fontWeight: 800, color: COLORS.navy }}>
                Préparez votre mission en 3 étapes
              </h1>
              <div style={{ marginTop: '12px', fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.8 }}>
                Ces informations nous permettent de planifier l’intervention et de livrer un rapport clair, cohérent et exploitable.
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                height: '44px',
                padding: '0 16px',
                borderRadius: '999px',
                border: `1px solid ${COLORS.navy}`,
                background: COLORS.white,
                color: COLORS.navy,
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Retour dashboard
            </button>
          </div>

          {/* Stepper */}
          <div
            style={{
              marginTop: '28px',
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '16px',
              padding: '18px 18px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '14px',
                alignItems: 'center',
              }}
            >
              <StepDot active={step === 1} done={step > 1} label="Étape 1 — Type de mission" />
              <StepDot active={step === 2} done={step > 2} label="Étape 2 — Détails" />
              <StepDot active={step === 3} done={false} label="Étape 3 — Confirmation" />
            </div>
          </div>

          {/* Content */}
          <div style={{ marginTop: '22px' }}>
            {step === 1 ? (
              <div
                style={{
                  background: COLORS.white,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '16px',
                  padding: '22px',
                }}
              >
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: COLORS.navy }}>Type de mission</h2>
                <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.8 }}>
                  Sélectionnez le type de mission à vérifier. Vous pourrez ensuite renseigner les détails.
                </div>

                <div
                  style={{
                    marginTop: '18px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '16px',
                  }}
                >
                  {[
                    {
                      key: 'btp' as const,
                      title: 'Construction & BTP',
                      subtitle: 'Vérifier l’avancement, la qualité et la conformité des travaux.',
                      icon: <HardHat size={26} style={{ color: COLORS.primary }} />,
                    },
                    {
                      key: 'agro' as const,
                      title: 'Agrobusiness',
                      subtitle: 'Élevage, cultures, exploitation — une image réelle de votre investissement.',
                      icon: <Leaf size={26} style={{ color: COLORS.primary }} />,
                    },
                    {
                      key: 'commerce' as const,
                      title: 'Commerce & Gestion',
                      subtitle: 'Vous investissez à distance. Nous observons sur place.',
                      icon: <ShoppingBag size={26} style={{ color: COLORS.primary }} />,
                    },
                  ].map((c) => {
                    const selected = missionType === c.key;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setMissionType(c.key)}
                        data-select-card="true"
                        style={{
                          textAlign: 'left',
                          borderRadius: '8px',
                          border: selected ? `2px solid ${COLORS.primary}` : '2px solid #94A3B8',
                          background: selected ? COLORS.light : COLORS.white,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                          padding: '18px',
                          cursor: 'pointer',
                          minHeight: '160px',
                          outline: 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '12px',
                              background: COLORS.white,
                              border: `1px solid ${selected ? COLORS.primary : COLORS.border}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            aria-hidden
                          >
                            {c.icon}
                          </div>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: COLORS.navy }}>{c.title}</div>
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '17px', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.7 }}>
                          {c.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* SECTION A */}
                <div
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '16px',
                    padding: '22px',
                  }}
                >
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: COLORS.navy }}>Informations sur le prestataire</h2>
                  <div style={{ marginTop: '12px' }}>
                    <HelperNote variant="info">
                      Ces informations nous permettent de vérifier l'existence légale et le passif de votre prestataire. Il ne sera jamais contacté.
                    </HelperNote>
                  </div>

                  <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                    <div>
                      <FieldLabel>Nom complet ou raison sociale *</FieldLabel>
                      <TextInput value={providerName} onChange={(e) => setProviderName(e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Numéro d'immatriculation</FieldLabel>
                      <TextInput value={providerRegistration} onChange={(e) => setProviderRegistration(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ marginTop: '14px' }}>
                    <FieldLabel>Autres informations connues</FieldLabel>
                    <TextArea value={providerOtherInfo} onChange={(e) => setProviderOtherInfo(e.target.value)} />
                  </div>
                </div>

                {/* SECTION B */}
                <div
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '16px',
                    padding: '22px',
                  }}
                >
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: COLORS.navy }}>Localisation du site</h2>
                  <div style={{ marginTop: '12px' }}>
                    <HelperNote variant="warning">
                      Une localisation imprécise ou introuvable entraîne l'annulation de la mission.
                    </HelperNote>
                  </div>

                  <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <FieldLabel>Adresse complète *</FieldLabel>
                      <TextInput value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Quartier *</FieldLabel>
                      <TextInput value={siteDistrict} onChange={(e) => setSiteDistrict(e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Deux repères visibles proches *</FieldLabel>
                      <TextInput value={siteLandmarks} onChange={(e) => setSiteLandmarks(e.target.value)} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <FieldLabel>Informations complémentaires</FieldLabel>
                      <TextArea value={siteExtraInfo} onChange={(e) => setSiteExtraInfo(e.target.value)} />
                      <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>
                        Tout détail supplémentaire qui peut aider à localiser précisément le site.
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION C */}
                <div
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '16px',
                    padding: '22px',
                  }}
                >
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: COLORS.navy }}>Contact sur place</h2>
                  <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>
                    La personne qui donnera accès au site le jour de la visite.
                  </div>
                  <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                    <div>
                      <FieldLabel>Nom du contact *</FieldLabel>
                      <TextInput value={onSiteContactName} onChange={(e) => setOnSiteContactName(e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Téléphone du contact *</FieldLabel>
                      <TextInput value={onSiteContactPhone} onChange={(e) => setOnSiteContactPhone(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* SECTION D */}
                <div
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '16px',
                    padding: '22px',
                  }}
                >
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: COLORS.navy }}>Description de la mission — {missionTypeLabel}</h2>

                  {missionType === 'btp' ? (
                    <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                      <div>
                        <FieldLabel>Type de construction *</FieldLabel>
                        <TextInput value={btpConstructionType} onChange={(e) => setBtpConstructionType(e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Nombre de niveaux *</FieldLabel>
                        <TextInput value={btpLevels} onChange={(e) => setBtpLevels(e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Superficie approximative</FieldLabel>
                        <TextInput value={btpSurface} onChange={(e) => setBtpSurface(e.target.value)} />
                      </div>
                      <div />
                      <div style={{ gridColumn: '1 / -1' }}>
                        <FieldLabel>État actuel déclaré des travaux *</FieldLabel>
                        <TextArea value={btpCurrentState} onChange={(e) => setBtpCurrentState(e.target.value)} />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <FieldLabel>Ce que vous souhaitez vérifier *</FieldLabel>
                        <TextArea value={btpToVerify} onChange={(e) => setBtpToVerify(e.target.value)} />
                      </div>
                    </div>
                  ) : null}

                  {missionType === 'agro' ? (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <FieldLabel>Type *</FieldLabel>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <SelectButton active={agroSubtype === 'animaux'} onClick={() => setAgroSubtype('animaux')}>
                            Animaux
                          </SelectButton>
                          <SelectButton active={agroSubtype === 'cultures'} onClick={() => setAgroSubtype('cultures')}>
                            Cultures
                          </SelectButton>
                          <SelectButton active={agroSubtype === 'les-deux'} onClick={() => setAgroSubtype('les-deux')}>
                            Les deux
                          </SelectButton>
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Effectif ou surface déclarés *</FieldLabel>
                        <TextInput value={agroDeclared} onChange={(e) => setAgroDeclared(e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Ce que vous souhaitez vérifier *</FieldLabel>
                        <TextArea value={agroToVerify} onChange={(e) => setAgroToVerify(e.target.value)} />
                      </div>
                    </div>
                  ) : null}

                  {missionType === 'commerce' ? (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <FieldLabel>Type d'activité *</FieldLabel>
                        <TextInput value={commerceActivity} onChange={(e) => setCommerceActivity(e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Ce que vous souhaitez vérifier *</FieldLabel>
                        <TextArea value={commerceToVerify} onChange={(e) => setCommerceToVerify(e.target.value)} />
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* SECTION E */}
                <div
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '16px',
                    padding: '22px',
                  }}
                >
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: COLORS.navy }}>Fréquence de la mission</h2>
                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setFrequency('unique')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setFrequency('unique');
                      }}
                      data-select-card="true"
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: frequency === 'unique' ? `2px solid ${COLORS.primary}` : '2px solid #94A3B8',
                        background: frequency === 'unique' ? COLORS.light : COLORS.white,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        outline: 'none',
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: 800, color: COLORS.text }}>Rapport unique</div>
                    </div>

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setFrequency('suivi')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setFrequency('suivi');
                      }}
                      data-select-card="true"
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: frequency === 'suivi' ? `2px solid ${COLORS.primary}` : '2px solid #94A3B8',
                        background: frequency === 'suivi' ? COLORS.light : COLORS.white,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        outline: 'none',
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: 800, color: COLORS.text }}>Suivi sur plusieurs étapes</div>
                    </div>

                    {frequency === 'suivi' ? (
                      <div style={{ marginTop: '10px' }}>
                        <FieldLabel>Précisez les étapes souhaitées *</FieldLabel>
                        <TextArea value={followupSteps} onChange={(e) => setFollowupSteps(e.target.value)} />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* SECTION F */}
                <div
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '16px',
                    padding: '22px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: COLORS.navy }}>Photos reçues du prestataire</h2>
                    <div
                      style={{
                        borderRadius: '999px',
                        background: COLORS.light,
                        border: `1px solid ${COLORS.primary}`,
                        padding: '6px 12px',
                        fontSize: '16px',
                        fontWeight: 800,
                        color: COLORS.text,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Recommandé
                    </div>
                  </div>

                  <div style={{ marginTop: '14px', fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>
                    Ajoutez les photos que le prestataire vous a déjà transmises (si vous en avez). Elles nous aideront à comparer les éléments déclarés et observés.
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '44px',
                        padding: '0 14px',
                        borderRadius: '999px',
                        border: `2px solid ${COLORS.primary}`,
                        background: COLORS.white,
                        color: COLORS.navy,
                        fontSize: '16px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      <Upload size={18} style={{ color: COLORS.primary }} />
                      Importer des photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => onPickPhotos(e.target.files)}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text }}>
                      {providerPhotos.length ? `${providerPhotos.length} fichier(s) ajouté(s)` : 'Aucun fichier pour le moment'}
                    </div>
                  </div>

                  {providerPhotos.length ? (
                    <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
                      {providerPhotos.map((f, idx) => {
                        const url = photoUrls[idx];
                        return (
                          <div
                            key={`${f.name}-${idx}`}
                            style={{
                              border: `1px solid ${COLORS.border}`,
                              borderRadius: '12px',
                              overflow: 'hidden',
                              background: COLORS.white,
                              position: 'relative',
                              minHeight: '120px',
                            }}
                          >
                            {url ? (
                              <img
                                src={url}
                                alt={f.name}
                                style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
                              />
                            ) : null}
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              aria-label="Supprimer la photo"
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '34px',
                                height: '34px',
                                borderRadius: '999px',
                                border: `1px solid ${COLORS.border}`,
                                background: COLORS.white,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <X size={16} style={{ color: COLORS.burgundy }} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {/* SECTION G */}
                <div
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '16px',
                    padding: '22px',
                  }}
                >
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: COLORS.navy }}>Niveau de service</h2>
                  <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setServiceLevel('standard')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setServiceLevel('standard');
                      }}
                      data-select-card="true"
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: serviceLevel === 'standard' ? `2px solid ${COLORS.primary}` : '2px solid #94A3B8',
                        background: serviceLevel === 'standard' ? COLORS.light : COLORS.white,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        outline: 'none',
                      }}
                    >
                      <div style={{ fontSize: '18px', fontWeight: 900, color: COLORS.text }}>Rapport Standard</div>
                      <div
                        style={{
                          marginTop: '8px',
                          fontSize: '17px',
                          fontWeight: 600,
                          color: '#1A1A1A',
                          lineHeight: 1.7,
                        }}
                      >
                        Une visite, un rapport complet livré sous 48h.
                      </div>
                      <div style={{ marginTop: '10px', fontSize: '20px', fontWeight: 800, color: COLORS.text }}>
                        15 000 FCFA
                      </div>
                    </div>

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setServiceLevel('renforce')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setServiceLevel('renforce');
                      }}
                      data-select-card="true"
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: serviceLevel === 'renforce' ? `2px solid ${COLORS.primary}` : '2px solid #94A3B8',
                        background: serviceLevel === 'renforce' ? COLORS.light : COLORS.white,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        outline: 'none',
                      }}
                    >
                      <div style={{ fontSize: '18px', fontWeight: 900, color: COLORS.text }}>Suivi Renforcé</div>
                      <div
                        style={{
                          marginTop: '8px',
                          fontSize: '17px',
                          fontWeight: 600,
                          color: '#1A1A1A',
                          lineHeight: 1.7,
                        }}
                      >
                        Plusieurs visites, suivi par étapes, rapport détaillé à chaque passage.
                      </div>
                      <div style={{ marginTop: '10px', fontSize: '20px', fontWeight: 800, color: COLORS.text }}>
                        Sur devis
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div
                style={{
                  background: COLORS.white,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '16px',
                  padding: '22px',
                }}
              >
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: COLORS.navy }}>Confirmation</h2>
                <div style={{ marginTop: '10px', fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.8 }}>
                  Vérifiez les informations ci-dessous avant de confirmer. Vous pourrez les ajuster en revenant aux étapes précédentes.
                </div>

                <div style={{ marginTop: '18px', border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '16px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: COLORS.primary, letterSpacing: '1px' }}>RÉCAPITULATIF</div>
                  <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text }}>Type de mission</div>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>{missionTypeLabel}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text }}>Prestataire</div>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>{providerName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text }}>Adresse</div>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>
                        {siteAddress} — {siteDistrict}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text }}>Contact sur place</div>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>
                        {onSiteContactName} ({onSiteContactPhone})
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text }}>Fréquence</div>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>
                        {frequency === 'unique' ? 'Rapport unique' : 'Suivi sur plusieurs étapes'}
                      </div>
                    </div>
                    {frequency === 'suivi' ? (
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text }}>Étapes souhaitées</div>
                        <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>{followupSteps}</div>
                      </div>
                    ) : null}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text }}>Photos reçues</div>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>
                        {providerPhotos.length ? `${providerPhotos.length} fichier(s)` : 'Aucune'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text }}>Niveau de service</div>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.7 }}>
                        {serviceLevel === 'standard' ? 'Rapport Standard' : serviceLevel === 'renforce' ? 'Suivi Renforcé' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                <label style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    style={{ width: '18px', height: '18px', marginTop: '3px' }}
                  />
                  <span style={{ fontSize: '16px', fontWeight: 700, color: COLORS.text, lineHeight: 1.7 }}>
                    Je confirme l&apos;exactitude des informations saisies et valide ma demande.
                  </span>
                </label>

                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!confirmed}
                  style={{
                    marginTop: '18px',
                    width: '100%',
                    height: '52px',
                    background: COLORS.burgundy,
                    color: COLORS.white,
                    fontSize: '18px',
                    fontWeight: 800,
                    borderRadius: '10px',
                    border: 'none',
                    cursor: confirmed ? 'pointer' : 'not-allowed',
                    opacity: confirmed ? 1 : 0.5,
                  }}
                >
                  Confirmer la fiche de mission
                </button>
              </div>
            ) : null}
          </div>

          {/* Footer nav */}
          <div
            style={{
              marginTop: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={onBack}
              disabled={step === 1}
              style={{
                height: '44px',
                padding: '0 16px',
                borderRadius: '999px',
                border: `1px solid ${COLORS.navy}`,
                background: COLORS.white,
                color: COLORS.navy,
                fontSize: '16px',
                fontWeight: 800,
                cursor: step === 1 ? 'not-allowed' : 'pointer',
                opacity: step === 1 ? 0.6 : 1,
              }}
            >
              Retour
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {error ? (
                <div style={{ fontSize: '16px', fontWeight: 600, color: COLORS.burgundy, lineHeight: 1.5 }}>
                  {error}
                </div>
              ) : null}
              <button
                type="button"
                onClick={onNext}
                disabled={(step === 1 && !canGoStep2) || (step === 2 && !canGoStep3) || step === 3}
                style={{
                  height: '44px',
                  padding: '0 18px',
                  borderRadius: '999px',
                  border: 'none',
                  background:
                    step === 1 ? (canGoStep2 ? COLORS.primary : '#A9C5E6') : step === 2 ? (canGoStep3 ? COLORS.primary : '#A9C5E6') : '#A9C5E6',
                  color: COLORS.white,
                  fontSize: '16px',
                  fontWeight: 900,
                  cursor: (step === 1 && canGoStep2) || (step === 2 && canGoStep3) ? 'pointer' : 'not-allowed',
                }}
              >
                Suivant
              </button>
            </div>
          </div>

          {step === 2 && requiredErrorsStep2.length ? (
            <div
              style={{
                marginTop: '14px',
                background: '#EBF2FA',
                border: '2px solid #1E5FA6',
                borderLeft: '5px solid #1E5FA6',
                borderRadius: '14px',
                padding: '14px 16px',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#0D2F4A' }}>Champs obligatoires manquants</div>
              <ul style={{ marginTop: '10px', paddingLeft: '18px' }}>
                {requiredErrorsStep2.slice(0, 6).map((e) => (
                  <li key={e} style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A', lineHeight: 1.7 }}>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

