import { CheckCircle, Camera, MapPin, FileText, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const reportRows = [
  { id: '#TR-2841', site: 'Chantier Abidjan Sud', type: '', score: 92, status: 'Conforme', date: '14 avr 2026' },
  { id: '#TR-2840', site: 'Exploitation Sikasso', type: 'Agro', score: 87, status: 'Conforme', date: '07 mar 2026' },
  { id: '#TR-2839', site: 'Résidence Dakar Nord', type: '', score: 96, status: 'Conforme', date: '18 jan 2026' },
  { id: '#TR-2838', site: 'Verger Bouaké', type: 'Agro', score: 61, status: 'À surveiller', date: '03 déc 2025' },
];

const MiniBarChart = ({ data, baseColor, lastColor }: { data: number[]; baseColor: string; lastColor: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[2px] h-8">
      {data.map((v, i) => {
        const ratio = v / max;
        const isLast = i === data.length - 1;
        const opacity = isLast ? 1 : 0.3 + ratio * 0.5;
        return (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${ratio * 100}%`,
              minHeight: '10%',
              backgroundColor: isLast ? lastColor : baseColor,
              opacity,
              boxShadow: isLast ? `0 0 8px ${lastColor}cc` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};

const SegmentedScore = ({ score }: { score: number }) => {
  const segments = 10;
  const filled = Math.round((score / 100) * segments);
  const color =
    score >= 80
      ? 'bg-emerald-400'
      : score >= 65
      ? 'bg-amber-400'
      : 'bg-red-400';

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-3.5 rounded-[2px] ${i < filled ? color : 'bg-white/12'}`}
          />
        ))}
      </div>
      <span className="text-white font-bold text-xs tabular-nums w-8">{score}%</span>
    </div>
  );
};

export default function Dashboard() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      className="relative py-24 md:py-36"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-gray-950/85" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-white/65 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Tableau de bord
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            La réalité de votre investissement.
          </h2>
          <p className="text-white/75 mt-4 text-lg font-light">
            Suivez chaque audit en temps réel depuis votre espace client.
          </p>
        </div>

        <div
          ref={ref}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <span className="text-white/65 text-sm font-medium">trasit — espace client</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/20 rounded-lg px-3 py-1.5">
                <TrendingUp size={13} className="text-emerald-400" />
                <span className="text-emerald-300 text-xs font-semibold">+12% ce mois</span>
              </div>
            </div>

            <div className="grid grid-cols-3 border-b border-white/10">
              {[
                { icon: FileText, label: 'Rapports totaux', value: '48', chart: [45, 60, 40, 70, 55, 80, 65, 75, 85, 90], baseColor: '#1E5FA6', lastColor: '#42A5F5' },
                { icon: CheckCircle, label: 'Conformes', value: '44', chart: [50, 65, 45, 72, 58, 82, 68, 78, 88, 95], baseColor: '#2E8B57', lastColor: '#66BB8A' },
                { icon: Camera, label: 'Photos collectées', value: '1 240', chart: [40, 58, 35, 68, 52, 78, 62, 72, 82, 92], baseColor: '#F26522', lastColor: '#FF9800' },
              ].map(({ icon: Icon, label, value, chart, baseColor, lastColor }) => (
                <div key={label} className="p-5 border-r border-white/10 last:border-r-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-white/65 text-[10px] font-semibold uppercase tracking-wider mb-1">{label}</div>
                      <div className="text-2xl font-black text-white leading-none">{value}</div>
                    </div>
                    <div className="w-7 h-7 bg-white/8 rounded-lg flex items-center justify-center">
                      <Icon size={14} className="text-white/70" />
                    </div>
                  </div>
                  <MiniBarChart data={chart} baseColor={baseColor} lastColor={lastColor} />
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    {['Réf.', 'Site', 'Type', 'Score', 'Statut', 'Date'].map((h) => (
                      <th
                        key={h}
                        className="text-left text-white/60 text-[10px] font-bold uppercase tracking-wider px-6 py-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-white/5 hover:bg-white/4 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-white/65 font-mono text-xs">{row.id}</td>
                      <td className="px-6 py-3.5 text-white font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-white/65 shrink-0" />
                          {row.site}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="bg-white/8 border border-white/10 text-white/80 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <SegmentedScore score={row.score} />
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            row.status === 'Conforme'
                              ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/12 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-white/65 text-xs">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3.5 flex items-center justify-between border-t border-white/8">
              <span className="text-white/60 text-xs">Affichage 4 sur 48 rapports</span>
              <button className="text-white/75 hover:text-white text-xs font-semibold transition-colors">
                Voir tous les rapports →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
