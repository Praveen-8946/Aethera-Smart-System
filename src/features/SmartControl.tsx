import React, { useContext, useMemo } from 'react';
import { Power, Timer, Tv } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';

export const SmartControl: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { devices, toggleDevice, setDeviceValue, setDeviceColor, setDeviceMode, roomsList, activeRoom, setActiveRoom } = context;

  const filteredDevices = useMemo(() => {
    if (activeRoom === 'all') return devices;
    return devices.filter(d => d.room === activeRoom);
  }, [devices, activeRoom]);

  return (
    <div className="space-y-6">
      {/* Room Filter Headers */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        {roomsList.map(room => {
          const isSelected = activeRoom === room.id;
          return (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all duration-300 shrink-0
                ${isSelected
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500 text-white shadow-glow-violet'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
              {room.name}
            </button>
          );
        })}
      </div>

      {/* Devices Grid list */}
      {filteredDevices.length === 0 ? (
        <EmptyState message="No IoT Devices linked to this room yet." icon="Power" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDevices.map(device => {
            return (
              <GlassCard 
                key={device.id} 
                className={`flex flex-col justify-between border-t-2 relative overflow-hidden h-[240px]
                  ${device.isOn ? 'border-t-violet-500 shadow-glow-violet/10' : 'border-t-white/10'}`}
              >
                {device.isOn && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl pointer-events-none"></div>
                )}
                
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{device.name}</h4>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">{device.detail}</p>
                  </div>
                  
                  <button
                    onClick={() => toggleDevice(device.id)}
                    className={`p-2.5 rounded-2xl border transition-all duration-300
                      ${device.isOn 
                        ? 'bg-violet-600/20 border-violet-500/40 text-violet-400 shadow-glow-violet' 
                        : 'bg-black/35 border-white/5 text-gray-500 hover:text-gray-300'}`}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>

                {/* Specific Control Widgets based on device type */}
                <div className="my-4 flex-grow flex items-center">
                  {device.isOn ? (
                    <div className="w-full">
                      
                      {/* LIGHT/DIMMER slider */}
                      {device.type === 'light' && (
                        <div className="space-y-1.5 w-full">
                          <div className="flex justify-between text-xs text-gray-400 font-medium">
                            <span>Luminance Level</span>
                            <span className="text-white font-bold">{device.value}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={device.value}
                            onChange={(e) => setDeviceValue(device.id, parseInt(e.target.value))}
                            className="w-full custom-range cursor-pointer accent-violet-600"
                          />
                        </div>
                      )}

                      {/* RGB color settings */}
                      {device.type === 'rgb' && (
                        <div className="space-y-2.5 w-full">
                          <div className="flex justify-between text-xs text-gray-400 font-medium">
                            <span>Chroma Palette</span>
                            <span className="text-xs px-2 py-0.5 rounded-md font-bold text-white uppercase" style={{ backgroundColor: device.color }}>
                              {device.color}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].map(c => (
                              <button
                                key={c}
                                onClick={() => setDeviceColor(device.id, c)}
                                className={`w-6 h-6 rounded-full border transition-transform
                                  ${device.color === c ? 'scale-125 border-white' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CLIMATE dial panel */}
                      {device.type === 'climate' && (
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">HVAC Target Temp</span>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-3xl font-extrabold text-white">{device.value}</span>
                              <span className="text-sm font-semibold text-cyan-400">°F</span>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => setDeviceValue(device.id, (device.value || 72) - 1)}
                              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center font-black text-gray-300 hover:text-white"
                            >
                              -
                            </button>
                            <button
                              onClick={() => setDeviceValue(device.id, (device.value || 72) + 1)}
                              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center font-black text-gray-300 hover:text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      {/* APPLIANCE / SHADES states */}
                      {device.type === 'appliance' && (
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs text-gray-400">Preset Settings Mode</span>
                          <div className="flex gap-1 bg-black/45 p-1 rounded-xl border border-white/5">
                            {['eco', 'boost', 'auto'].map(m => (
                              <button
                                key={m}
                                onClick={() => setDeviceMode(device.id, m)}
                                className={`px-3 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wide transition-all
                                  ${device.mode === m ? 'bg-violet-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SPRINKLERS state */}
                      {device.type === 'sprinkler' && (
                        <div className="flex justify-between items-center w-full bg-blue-500/5 p-3 rounded-2xl border border-blue-500/10">
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-300 font-medium">Sprinkling active</span>
                          </div>
                          <span className="text-xs font-bold text-blue-400">{device.value} min left</span>
                        </div>
                      )}

                      {/* TV live stream status */}
                      {device.type === 'media' && (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Tv className="w-4 h-4" />
                          <span className="text-xs font-medium">Device Streaming Live Feed</span>
                        </div>
                      )}

                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 italic">Device is powered off</span>
                  )}
                </div>

                <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  <span>Room ID: {device.room}</span>
                  <span className={`w-2 h-2 rounded-full ${device.isOn ? 'bg-emerald-500 shadow-glow-emerald' : 'bg-gray-700'}`}></span>
                </div>

              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
