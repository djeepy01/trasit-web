import { useMemo } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

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
  const { ref, isVisible } = useScrollAnimation(0.18);

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

      // Animation : on passe progressivement de 0 à la longueur du segment.
      const draw = clamp01(isVisible ? 1 : 0);
      const dashoffset = (circumference - segmentLength) + (1 - draw) * segmentLength;

      return { ...item, rotation, dasharray, dashoffset };
    });

    return { size, stroke, radius, segments };
  }, [isVisible]);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="min-w-0">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: navy }}>
              Chaque investissement mérite une réponse claire.
            </h2>
            <p
              className="mt-8 text-[16px] md:text-[17px] leading-[1.65] text-[#1A1A1A] font-normal max-w-xl whitespace-pre-line"
              style={{ fontSize: '18px', fontWeight: '400', color: '#1A1A1A', lineHeight: '1.8' }}
            >
              Chantiers à l'arrêt. Stocks inexistants. Gérants introuvables.
              {'\n'}
              La distance crée des angles morts dangereux.
            </p>
            <p
              className="mt-7 text-[16px] md:text-[17px] leading-[1.65] text-[#1A1A1A] font-normal max-w-xl whitespace-pre-line"
              style={{ fontSize: '18px', fontWeight: '400', color: '#1A1A1A', lineHeight: '1.8' }}
            >
              TRASIT analyse, compte et évalue chaque actif sur place.
              {'\n'}
              Photos géolocalisées, horodatées, impossibles à falsifier. Rapport en 2 heures.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative">
              <svg
                width={donut.size}
                height={donut.size}
                viewBox={`0 0 ${donut.size} ${donut.size}`}
                className="-rotate-90"
                role="img"
                aria-label="Indicateurs clés TRASIT"
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
                      transition: 'stroke-dashoffset 1.2s ease',
                    }}
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <p className="text-[16px] font-semibold text-[#1A1A1A]">TRASIT</p>
                <p className="mt-1 text-sm text-[#1A1A1A]/70">Indicateurs</p>
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
                      <span className="font-normal text-[#1A1A1A]">{item.label}</span>
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

