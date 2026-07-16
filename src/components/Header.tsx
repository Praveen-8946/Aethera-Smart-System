import React, { useState, useContext } from 'react';
import { CloudSun, Droplets, Sun, Bell } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export const Header: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { telemetry } = context;
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Energy peak production reached!', read: false },
    { id: 2, text: 'Living Room climate optimization preset complete.', read: false }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications([]);
  };

  const systemWeather = {
    temp: '74°F',
    condition: 'Clear Skies',
    humidity: '42%'
  };

  return (
    <header className="flex justify-between items-center mb-8 gap-4">
      <div>
        <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Gateway Admin console</h2>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Main Command Control</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Weather Widget */}
        <div className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 glassmorphism rounded-2xl border border-white/5 text-xs text-gray-300 font-medium">
          <CloudSun className="w-4 h-4 text-cyan-400" />
          <span>{systemWeather.temp} ({systemWeather.condition})</span>
          <span className="text-gray-600">|</span>
          <Droplets className="w-3.5 h-3.5 text-blue-400" />
          <span>{systemWeather.humidity} RH</span>
        </div>

        {/* Solar Production Quick metric */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 glassmorphism rounded-2xl border border-white/5 text-xs text-gray-300 font-medium">
          <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Solar: <strong className="text-white">{telemetry.solarProduction} kW</strong></span>
        </div>

        {/* Notification system */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-3 glassmorphism rounded-2xl text-gray-300 hover:text-white border border-white/5 relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 glassmorphism rounded-3xl p-5 shadow-glass z-50 border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Telemetry Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-semibold text-violet-400 hover:text-violet-300"
                  >
                    Dismiss All
                  </button>
                )}
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No active system notifications.</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-[11px] leading-relaxed text-gray-300">
                      {n.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
