import React, { useContext } from 'react';
import { Zap, Power, BatteryCharging, ShieldCheck, Sun, Cpu, Battery, ArrowRight, PlaneTakeoff, Moon, PartyPopper, ChevronRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';

export const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { telemetry, alarmMode, devices, setActiveTab } = context;
  const totalActiveDevices = devices.filter(d => d.isOn).length;

  return (
    <div className="space-y-6">
      {/* Main Quick Info Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-glow-violet">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">Net Usage</p>
            <h3 className="text-xl font-extrabold text-white">{telemetry.homeConsumption} kW</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
            <Power className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">Active Devices</p>
            <h3 className="text-xl font-extrabold text-white">{totalActiveDevices} <span className="text-xs text-gray-500">running</span></h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BatteryCharging className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">Battery Bank</p>
            <h3 className="text-xl font-extrabold text-white">{telemetry.batteryCharge}% <span className="text-xs text-emerald-400">charging</span></h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-glow-emerald">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase">Security Shield</p>
            <h3 className="text-xl font-extrabold text-white capitalize">{alarmMode.replace('_', ' ')}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Quick Commands & Floor plan simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Integrated Energy Grid</h3>
              <span className="text-xs px-2.5 py-1 bg-violet-500/15 border border-violet-500/20 text-violet-400 rounded-full font-bold">REAL-TIME TELEMETRY</span>
            </div>
            
            {/* SVG Live Energy Flow Animation */}
            <div className="relative h-44 border border-white/5 rounded-2xl bg-black/25 flex items-center justify-around px-4">
              
              {/* Solar Panel */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-2">
                  <Sun className="w-6 h-6 text-amber-500" />
                </div>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Solar Array</span>
                <span className="text-xs font-bold text-white">+{telemetry.solarProduction} kW</span>
              </div>

              {/* Flow Arrow Line 1 */}
              <div className="flex-1 max-w-[60px] h-0.5 border-t border-dashed border-cyan-500/30 relative">
                <span className="absolute top-[-3px] left-0 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              </div>

              {/* Gateway Center */}
              <div className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 border border-violet-400/25 flex items-center justify-center mb-2 shadow-glow-violet">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Core Gateway</span>
                <span className="text-xs font-bold text-violet-400">Online</span>
              </div>

              {/* Flow Arrow Line 2 */}
              <div className="flex-1 max-w-[60px] h-0.5 border-t border-dashed border-violet-500/30 relative">
                <span className="absolute top-[-3px] right-0 w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
              </div>

              {/* Battery Reserve */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2">
                  <Battery className="w-6 h-6 text-emerald-500" />
                </div>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Energy Bank</span>
                <span className="text-xs font-bold text-white">{telemetry.batteryCharge}% CAP</span>
              </div>

            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-gray-400">Total System Energy Efficiency is currently <span className="text-emerald-400 font-bold">Optimal</span>.</p>
            <button 
              onClick={() => setActiveTab('energy')}
              className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1"
            >
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </GlassCard>

        {/* Quick Actions preset switcher */}
        <GlassCard className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Command Presets</h3>
            <p className="text-xs text-gray-500 mb-6">Orchestrate your home state with a single toggle.</p>
            
            <div className="space-y-3">
              <button className="w-full py-3.5 px-4 bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between text-left transition-all duration-300">
                <div className="flex items-center gap-3">
                  <PlaneTakeoff className="w-5 h-5 text-rose-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Preset: Away Mode</h4>
                    <p className="text-[10px] text-gray-500">Shades down, HVAC eco, Arm Alarm</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>

              <button className="w-full py-3.5 px-4 bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between text-left transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Preset: Bedtime Mode</h4>
                    <p className="text-[10px] text-gray-500">All lights off, lock entryways, AC cool</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>

              <button className="w-full py-3.5 px-4 bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between text-left transition-all duration-300">
                <div className="flex items-center gap-3">
                  <PartyPopper className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Preset: Entertaining Mode</h4>
                    <p className="text-[10px] text-gray-500">Accent LEDs to Cyan, Lounge music on</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <span className="text-[10px] text-gray-500 font-bold block text-center uppercase tracking-widest">ACTIVE PRESET: CUSTOM USER</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
