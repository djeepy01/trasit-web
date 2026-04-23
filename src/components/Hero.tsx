import { CheckCircle, Clock, Shield, Aperture } from 'lucide-react';

const r = 30;
const cx = 40;
const cy = 40;
const circumference = 2 * Math.PI * r;
const quarterArc = circumference / 4;
const gapArc = (4 / 360) * circumference;
const maxArc = quarterArc - gapArc;

const gaugeSegments = [
  { color: '#1E5FA6', score: 94, rotation: 0,   label: 'Structure' },
  { color: '#2E8B57', score: 91, rotation: 90,  label: 'Avancement' },
  { color: '#F9A825', score: 88, rotation: 180, label: 'Documents' },
  { color: '#F26522', score: 96, rotation: 270, label: 'Conformité' },
];

const ScoreGauge = ({ value }: { value: number }) => (
  <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
    <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full -rotate-90">
      {gaugeSegments.map(({ rotation }, i) => (
        <circle
          key={`bg-${i}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#ebebeb"
          strokeWidth="6"
          strokeDasharray={`${maxArc} ${circumference}`}
          transform={`rotate(${rotation}, ${cx}, ${cy})`}
        />
      ))}
      {gaugeSegments.map(({ color, score, rotation }, i) => (
        <circle
          key={`seg-${i}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${(score / 100) * maxArc} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(${rotation}, ${cx}, ${cy})`}
        />
      ))}
    </svg>
    <div className="flex flex-col items-center">
      <span className="text-xl font-black text-gray-900 leading-none">{value}%</span>
      <span className="text-[8px] text-gray-500 font-semibold mt-0.5 uppercase tracking-wider">Score</span>
    </div>
  </div>
);

const GaugeLegend = () => (
  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
    {gaugeSegments.map(({ color, label, score }) => (
      <div key={label} className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[10px] text-gray-600 font-medium truncate">{label}</span>
        <span className="text-[10px] text-gray-900 font-bold ml-auto">{score}%</span>
      </div>
    ))}
  </div>
);

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-[68px]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
      }}
    >
      <div className="absolute inset-0 bg-black/62" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-7">
              <Shield size={12} className="text-white/70" />
              <span className="text-white/90 text-xs font-semibold tracking-wide">
                Décisions fondées sur des preuves terrain
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-6">
              Votre investissement mérite plus d'attention.
            </h1>
            <div className="mt-14 flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-black text-white">300+</div>
                <div className="text-white/75 text-xs font-medium mt-0.5">Audits</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-black text-white">17</div>
                <div className="text-white/75 text-xs font-medium mt-0.5">Pays couverts</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-black text-white">2h</div>
                <div className="text-white/75 text-xs font-medium mt-0.5">Délai rapport</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="relative animate-float" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white rounded-2xl shadow-2xl w-72 p-5 border border-gray-100">
                <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center text-white font-black text-xs">
                    TR
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-gray-900 text-sm leading-tight">Rapport TRASIT</div>
                    <div className="text-gray-600 text-xs font-medium mt-0.5 truncate">Sites</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs text-green-700 font-semibold">Validé</span>
                  </div>
                </div>

                <div className="mb-1.5">
                  <ScoreGauge value={94} />
                  <p className="text-center text-gray-700 text-xs font-semibold mt-1">Score de conformité</p>
                  <GaugeLegend />
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Aperture size={14} className="text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-800 font-semibold">Sites vérifiés</span>
                    <CheckCircle size={14} className="ml-auto text-green-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-800 font-semibold">Délai rapport</span>
                    <span className="ml-auto text-sm font-black text-gray-900">2h</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-800 font-semibold">Agent certifié</span>
                    <CheckCircle size={14} className="ml-auto text-green-600 shrink-0" />
                  </div>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex items-center justify-end">
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wider">TRASIT</span>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-gray-900 text-white rounded-xl px-3 py-1.5 text-xs font-bold shadow-lg">
                Rapport livré en 2h
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
        <div className="w-px h-6 bg-white/30" />
        <div className="w-1 h-1 rounded-full bg-white/40" />
      </div>
    </section>
  );
}
