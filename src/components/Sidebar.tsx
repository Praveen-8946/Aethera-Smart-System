import React, { useState, useContext } from 'react';
import { LayoutDashboard, Power, Zap, Shield, GitMerge, X, Menu } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { activeTab, setActiveTab, usingFallback } = context;
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Overview', icon: LayoutDashboard },
    { id: 'devices', name: 'Smart Control', icon: Power },
    { id: 'energy', name: 'Energy Insights', icon: Zap },
    { id: 'security', name: 'Alarms System', icon: Shield },
    { id: 'automations', name: 'Smart Rules', icon: GitMerge }
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 glassmorphism rounded-2xl text-gray-300 hover:text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Drawer container */}
      <aside className={`fixed top-0 left-0 h-full w-72 glassmorphism z-40 border-r border-white/5 transition-transform duration-300 flex flex-col justify-between py-6 px-4 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        <div>
          {/* Logo / Branding */}
          <div className="flex items-center gap-3 px-3 mb-10 mt-6 lg:mt-0">
            <div className="w-9 h-9 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-glow-violet">
              <span className="text-white font-extrabold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">AETHERA</h1>
              <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">Smart Core OS</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-violet-600/35 to-indigo-600/10 text-white border border-violet-500/25 shadow-glow-violet' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile & Settings section */}
        <div>
          <div className="px-3 mb-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 tracking-wider mb-2">
              <span>GATEWAY LINK</span>
              <span className={`w-2 h-2 rounded-full ${usingFallback ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
            </div>
            <div className="py-2.5 px-3.5 bg-black/35 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
              <span className="text-gray-400 font-medium">Link Mode:</span>
              <span className={`font-bold capitalize ${usingFallback ? 'text-amber-400' : 'text-emerald-400'}`}>
                {usingFallback ? 'Decoupled' : 'Connected'}
              </span>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-4 flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full border border-violet-500/30 overflow-hidden bg-gradient-to-tr from-violet-500 to-indigo-700 flex items-center justify-center text-white font-bold">
              PB
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Praveen Bhotla</h4>
              <p className="text-[10px] text-gray-500">Lead Administrator</p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
