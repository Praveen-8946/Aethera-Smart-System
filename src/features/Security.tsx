import React, { useContext } from 'react';
import { VideoOff, Maximize2, Settings, ShieldOff, ShieldAlert, Shield } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';

export const Security: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { alarmMode, updateAlarmMode, alarmLogs } = context;

  const cameras = [
    { id: 1, name: 'Cam 01 - Front Driveway', status: 'live' },
    { id: 2, name: 'Cam 02 - Backyard Patio', status: 'live' },
    { id: 3, name: 'Cam 03 - Garage Entrance', status: 'offline' },
    { id: 4, name: 'Cam 04 - Living Room Wide', status: 'live' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Main Security Alarm Panel */}
      <div className="space-y-6 lg:col-span-2">
        
        {/* Live Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cameras.map(cam => (
            <GlassCard key={cam.id} className="p-4 relative overflow-hidden bg-black/40 min-h-[180px] flex flex-col justify-between border border-white/5">
              
              <div className="flex justify-between items-center z-10">
                <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'live' ? 'bg-rose-500 animate-pulse' : 'bg-gray-500'}`}></span>
                  {cam.name}
                </span>
                <span className="text-[10px] text-gray-400 font-bold bg-black/60 px-2 py-0.5 rounded uppercase">
                  {cam.status}
                </span>
              </div>

              {cam.status === 'live' ? (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
                  <div className="absolute left-0 w-full h-[1px] bg-cyan-500/25 shadow-glow-cyan animate-scan pointer-events-none"></div>
                  <div className="text-[10px] text-emerald-400/35 font-mono tracking-widest uppercase">
                    REC [00:0{cam.id}:34]
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-zinc-950/80">
                  <VideoOff className="w-8 h-8 text-gray-700 mb-2" />
                  <span className="text-xs text-gray-600 font-medium">CAM OFFLINE / ACCESS RESTRICTED</span>
                </div>
              )}

              <div className="flex justify-between items-center z-10 mt-12">
                <span className="text-[10px] font-mono text-gray-500">1080P // H.265</span>
                <div className="flex gap-1.5">
                  <button className="p-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-gray-400 hover:text-white transition-all text-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-gray-400 hover:text-white transition-all text-xs">
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </GlassCard>
          ))}
        </div>

        {/* Alarm Settings controls */}
        <GlassCard>
          <h3 className="text-lg font-bold text-white mb-2">System Guard Arming</h3>
          <p className="text-xs text-gray-500 mb-6">Choose how Aethera secures access points and smart sensors.</p>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'disarmed', name: 'Disarmed', desc: 'All sensors inactive', icon: ShieldOff },
              { id: 'armed_home', name: 'Armed Home', desc: 'Perimeter secure only', icon: ShieldAlert },
              { id: 'armed_away', name: 'Armed Away', desc: 'All sensors & cameras active', icon: Shield }
            ].map(mode => {
              const isActive = alarmMode === mode.id;
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => updateAlarmMode(mode.id)}
                  className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2
                    ${isActive 
                      ? 'bg-white/5 border-white/20 shadow-glass' 
                      : 'bg-black/25 border-transparent opacity-50 hover:opacity-80'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-white/10' : 'bg-white/5'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <span className="text-xs font-bold text-white leading-none mt-1">{mode.name}</span>
                  <span className="text-[9px] text-gray-500 leading-none">{mode.desc}</span>
                </button>
              );
            })}
          </div>
        </GlassCard>

      </div>

      {/* Security Incidents / Alerts Log column */}
      <GlassCard className="flex flex-col h-full justify-between min-h-[500px]">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Access & Incident Log</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Live Logs</span>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {alarmLogs.map(log => (
              <div key={log.id} className="text-xs border-l-2 border-white/5 pl-3 py-1 flex items-start justify-between gap-3">
                <div>
                  <p className="text-gray-300 font-medium leading-relaxed">{log.event}</p>
                  <span className="text-[9px] text-gray-500 font-semibold">{log.time}</span>
                </div>
                {log.type === 'warning' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shadow-glow-cyan shrink-0"></span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-4 mt-6 text-center">
          <span className="text-[10px] text-gray-500 font-bold uppercase">LOG STACK STORAGE: 99.8% VACANT</span>
        </div>
      </GlassCard>

    </div>
  );
};
