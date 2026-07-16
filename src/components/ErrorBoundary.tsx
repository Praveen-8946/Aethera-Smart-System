import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ErrorBoundaryProps {
  message: string;
  onReset: () => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ message, onReset }) => {
  return (
    <GlassCard className="border-rose-500/40 bg-rose-500/5 text-center p-12 max-w-xl mx-auto my-8">
      <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
        <AlertOctagon className="text-rose-500 w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-rose-400 mb-2">System Error Occurred</h3>
      <p className="text-gray-300 mb-6 text-sm leading-relaxed">{message}</p>
      <button 
        onClick={onReset}
        className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-glow-violet transition-all duration-300 text-sm"
      >
        Reset Gateway Connection
      </button>
    </GlassCard>
  );
};
