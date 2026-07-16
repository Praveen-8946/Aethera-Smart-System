import React, { useState, useContext } from 'react';
import { Sun, Home, Plug, TrendingUp, Activity } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';

export const Analytics: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { telemetry } = context;
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');

  const datasets = {
    day: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      solar: [0, 0.2, 3.2, 5.8, 4.2, 0.5],
      consumption: [1.2, 1.4, 2.8, 3.6, 2.5, 3.1]
    },
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      solar: [22, 28, 18, 32, 24, 30, 29],
      consumption: [18, 20, 19, 22, 21, 24, 23]
    },
    month: {
      labels: ['W1', 'W2', 'W3', 'W4'],
      solar: [120, 140, 110, 135],
      consumption: [95, 102, 98, 105]
    }
  };

  const activeData = datasets[timeframe];
  const maxVal = Math.max(...activeData.solar, ...activeData.consumption) || 10;
  const svgWidth = 600;
  const svgHeight = 220;

  const generateSVGPoints = (dataArray: number[]) => {
    const stepX = svgWidth / (dataArray.length - 1);
    return dataArray.map((val, idx) => {
      const x = idx * stepX;
      const y = svgHeight - (val / maxVal) * svgHeight * 0.8 - (svgHeight * 0.1);
      return { x, y, value: val };
    });
  };

  const solarPoints = generateSVGPoints(activeData.solar);
  const consPoints = generateSVGPoints(activeData.consumption);

  const solarPath = solarPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const consPath = consPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="space-y-6">
      {/* Energy Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Solar Generation</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">{telemetry.solarProduction} <span className="text-sm font-medium text-gray-400">kW</span></h2>
          </div>
          <p className="text-xs text-emerald-400 mt-4 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14% compared to yesterday
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Home Consumption</span>
              <Home className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">{telemetry.homeConsumption} <span className="text-sm font-medium text-gray-400">kW</span></h2>
          </div>
          <p className="text-xs text-cyan-400 mt-4 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Energy usage within safety threshold
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Grid Import Draw</span>
              <Plug className="w-4 h-4 text-rose-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">{telemetry.gridDraw} <span className="text-sm font-medium text-gray-400">kW</span></h2>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Self-reliance index: <strong className="text-emerald-400">76% autonomous</strong>
          </p>
        </GlassCard>
      </div>

      {/* SVG Analytics Chart */}
      <GlassCard className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Grid vs Solar Analytics</h3>
            <p className="text-xs text-gray-500">Hourly monitoring telemetry</p>
          </div>

          <div className="flex bg-black/45 p-1 rounded-xl border border-white/5">
            {(['day', 'week', 'month'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                  ${timeframe === t ? 'bg-violet-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full overflow-hidden mt-6">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = svgHeight - ratio * svgHeight * 0.8 - (svgHeight * 0.1);
              return (
                <line 
                  key={idx}
                  x1="0" 
                  y1={y} 
                  x2={svgWidth} 
                  y2={y} 
                  stroke="rgba(255,255,255,0.04)" 
                  strokeWidth="1" 
                />
              );
            })}

            <path 
              d={solarPath} 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
            />

            <path 
              d={consPath} 
              fill="none" 
              stroke="#8b5cf6" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]"
            />

            {solarPoints.map((p, idx) => (
              <g key={`s-${idx}`} className="group cursor-pointer">
                <circle cx={p.x} cy={p.y} r="5" fill="#f59e0b" stroke="#0b0c15" strokeWidth="2" />
                <circle cx={p.x} cy={p.y} r="12" fill="transparent" className="hover:fill-amber-500/10" />
                <text x={p.x} y={p.y - 12} textAnchor="middle" className="opacity-0 group-hover:opacity-100 fill-white text-[10px] font-bold pointer-events-none">
                  {p.value} kW
                </text>
              </g>
            ))}

            {consPoints.map((p, idx) => (
              <g key={`c-${idx}`} className="group cursor-pointer">
                <circle cx={p.x} cy={p.y} r="5" fill="#8b5cf6" stroke="#0b0c15" strokeWidth="2" />
                <circle cx={p.x} cy={p.y} r="12" fill="transparent" className="hover:fill-violet-500/10" />
                <text x={p.x} y={p.y - 12} textAnchor="middle" className="opacity-0 group-hover:opacity-100 fill-white text-[10px] font-bold pointer-events-none">
                  {p.value} kW
                </text>
              </g>
            ))}
          </svg>

          <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-gray-300">Solar Production</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
                <span className="font-semibold text-gray-300">Home Consumption</span>
              </div>
            </div>

            <div className="flex gap-6">
              {activeData.labels.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
