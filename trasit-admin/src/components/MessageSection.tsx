import { useEffect, useMemo, useState } from 'react';

type DonutLegendItem = {
  label: string;
  value: string;
  color: string;
};

const navy = '#0D2F4A';

const legendItems: DonutLegendItem[] = [
  { value: '98%', label: 'clients satisfaits', color: '#1E5FA6' },
  { value: '300+', label: 'interventions', color: '#2E8B57' },
  { value: '17', label: 'pays couverts', color: '#F9A825' },
  { value: '2h', label: 'délai de livraison', color: '#F26522' },
];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/** Section message : texte + donut animé au scroll. */
export default function MessageSection() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const donut = useMemo(() => {
    const stroke = 14;
    const size = 220;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    // 4 segments égaux, avec un petit espace entre segments pour la lisibilité.
    const gap = 6;
    const segmentLength = circumference / 4 - gap;

    const segments = legendItems.map((item, i) => {
      const rotation = i * 90;
      const dasharray = `${segmentLength} ${circumference - segmentLength}`;

      // Animation au montage (stroke-dashoffset).
      const dashoffsetHidden = circumference;
      const dashoffsetShown = circumference - segmentLength;
      const dashoffset = animate ? dashoffsetShown : dashoffsetHidden;

      return {
        ...item,
        rotation,
        dasharray,
        dashoffset,
        dashoffsetHidden,
        dashoffsetShown,
        delayMs: i * 200,
      };
    });

    return { size, stroke, radius, circumference, segments };
  }, [animate]);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="min-w-0">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: navy }}>
              Chaque investissement mérite une réponse claire.
            </h2>
            <p
              className="mt-8 leading-[1.65] max-w-xl whitespace-pre-line"
              style={{ fontSize: '20px', fontWeight: 500, color: '#1A1A1A', lineHeight: '1.8' }}
            >
              Chantiers à l'arrêt. Stocks inexistants. Gérants introuvables.
              {'\n'}
              La distance crée des angles morts dangereux.
            </p>
            <p
              className="mt-7 leading-[1.65] max-w-xl whitespace-pre-line"
              style={{ fontSize: '20px', fontWeight: 500, color: '#1A1A1A', lineHeight: '1.8' }}
            >
              TRASIT analyse, compte et évalue chaque actif sur place.
              {'\n'}
              Photos géolocalisées, horodatées, impossibles à falsifier. Rapport en 2 heures.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative">
              <style>{`
                @keyframes trasit-donut-draw {
                  from { stroke-dashoffset: var(--dash-from); }
                  to { stroke-dashoffset: var(--dash-to); }
                }
                @keyframes trasit-donut-spin {
                  from { transform: rotate(-90deg); }
                  to { transform: rotate(270deg); }
                }
              `}</style>
              <svg
                width={donut.size}
                height={donut.size}
                viewBox={`0 0 ${donut.size} ${donut.size}`}
                role="img"
                aria-label="Indicateurs clés TRASIT"
                style={{
                  transformOrigin: '50% 50%',
                  animation: 'trasit-donut-spin 18s linear infinite',
                }}
              >
                <circle
                  cx={donut.size / 2}
                  cy={donut.size / 2}
                  r={donut.radius}
                  fill="none"
                  stroke="rgba(13, 47, 74, 0.08)"
                  strokeWidth={donut.stroke}
                />

                {donut.segments.map((seg) => (
                  <circle
                    key={seg.color}
                    cx={donut.size / 2}
                    cy={donut.size / 2}
                    r={donut.radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={donut.stroke}
                    strokeLinecap="round"
                    strokeDasharray={seg.dasharray}
                    strokeDashoffset={seg.dashoffset}
                    transform={`rotate(${seg.rotation} ${donut.size / 2} ${donut.size / 2})`}
                    style={{
                      ['--dash-from' as any]: seg.dashoffsetHidden,
                      ['--dash-to' as any]: seg.dashoffsetShown,
                      animation: animate ? 'trasit-donut-draw 1.2s ease-out infinite alternate' : undefined,
                      animationDelay: animate ? `${seg.delayMs}ms` : undefined,
                    }}
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A' }}>TRASIT</p>
                <p style={{ marginTop: '4px', fontSize: '16px', fontWeight: 500, color: '#1A1A1A' }}>Indicateurs</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 max-w-md w-full">
              {legendItems.map((item) => (
                <div key={item.color} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-3 w-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-[16px] leading-snug font-semibold text-[#1A1A1A]">
                      {item.value}{' '}
                      <span style={{ fontSize: '16px', fontWeight: 500, color: '#1A1A1A' }}>{item.label}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

