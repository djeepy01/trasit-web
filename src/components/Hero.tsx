import { Shield } from 'lucide-react';

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
    </div>
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
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-[380px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">TR</span>
                    </div>
                    <div>
                      <p className="font-bold text-[16px] text-gray-900">Rapport TRASIT</p>
                      <p className="text-[14px] text-gray-500">Construction</p>
                    </div>
                  </div>
                  <span className="text-[14px] font-semibold text-green-600">● Validé</span>
                </div>
              
                <div className="flex justify-center mb-2">
                  <ScoreGauge value={94} />
                </div>
              
                <p className="text-center text-[14px] text-gray-600 mb-3">Score de conformité</p>
              
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5 px-2">
                  <span className="text-[13px]"><span style={{color:'#1E5FA6'}}>●</span> Structure <strong>94%</strong></span>
                  <span className="text-[13px]"><span style={{color:'#2E8B57'}}>●</span> Avancement <strong>91%</strong></span>
                  <span className="text-[13px]"><span style={{color:'#F9A825'}}>●</span> Documents <strong>88%</strong></span>
                  <span className="text-[13px]"><span style={{color:'#F26522'}}>●</span> Conformité <strong>96%</strong></span>
                </div>
              
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-700">Intervention vérifiée</span>
                    <span className="text-green-500">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-700">Délai rapport</span>
                    <span className="text-[14px] font-bold">2h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-700">Agent indépendant</span>
                    <span className="text-green-500">✓</span>
                  </div>
                </div>
              
                <p className="text-right text-[13px] font-bold text-gray-900 mt-4">TRASIT</p>
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
