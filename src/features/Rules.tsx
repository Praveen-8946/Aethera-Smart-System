import React, { useState, useContext } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';

export const Rules: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { automations, addAutomationRule, toggleAutomationRule, deleteAutomationRule } = context;

  const [ruleName, setRuleName] = useState('');
  const [trigger, setTrigger] = useState('Motion Detected');
  const [action, setAction] = useState('Turn on Living Room Light to 100%');

  const triggerOptions = [
    'Motion Detected',
    'Time reaches 10:00 PM',
    'Temperature rises above 78°F',
    'Front Door is unlocked',
    'Solar Generation exceeds 4kW'
  ];

  const actionOptions = [
    'Turn on Living Room Light to 100%',
    'Arm Security System to Away Mode',
    'Power Off all climate HVAC units',
    'Close Patio Window Shades',
    'Trigger Sprinklers for 15 minutes'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;
    await addAutomationRule(ruleName, trigger, action);
    setRuleName('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Rules Builder Form Panel */}
      <GlassCard className="lg:col-span-1 h-fit">
        <h3 className="text-lg font-bold text-white mb-2">Create Automation</h3>
        <p className="text-xs text-gray-500 mb-6">Build conditional IoT device behavior triggers.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rule Label</label>
            <input 
              type="text" 
              placeholder="e.g. Welcome Home Lighting" 
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-xs glass-input text-white"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">IF (Trigger State)</label>
            <select 
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-xs glass-input text-white cursor-pointer bg-black"
            >
              {triggerOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">THEN (Execute Command)</label>
            <select 
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-xs glass-input text-white cursor-pointer bg-black"
            >
              {actionOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-semibold shadow-glow-violet transition-all duration-300 text-xs mt-6 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Link Rule Script
          </button>
        </form>
      </GlassCard>

      {/* Active Rules list container */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-1">
          <div>
            <h3 className="text-lg font-bold text-white">Active Rule Presets</h3>
            <p className="text-xs text-gray-500">Currently active automated routines</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full font-bold">
            {automations.length} total
          </span>
        </div>

        {automations.length === 0 ? (
          <GlassCard className="p-8">
            <EmptyState message="No automations configured. Build your first rule above." icon="GitBranch" />
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {automations.map(rule => (
              <GlassCard key={rule.id} className="flex justify-between items-center gap-4 py-4 px-5">
                
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{rule.name}</h4>
                  <p className="text-xs text-gray-400">
                    <span className="text-cyan-400 font-bold">IF</span> {rule.trigger} <span className="text-violet-400 font-bold">THEN</span> {rule.action}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* toggle Switch button */}
                  <button 
                    onClick={() => toggleAutomationRule(rule.id)}
                    className={`w-11 h-6 rounded-full transition-all duration-300 relative border
                      ${rule.isEnabled 
                        ? 'bg-violet-600 border-violet-500 shadow-glow-violet' 
                        : 'bg-black/45 border-white/5'}`}
                  >
                    <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all duration-300
                      ${rule.isEnabled ? 'left-5.5' : 'left-0.5'}`} 
                    />
                  </button>

                  <button 
                    onClick={() => deleteAutomationRule(rule.id)}
                    className="p-2 bg-black/35 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 text-gray-500 hover:text-rose-400 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </GlassCard>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
