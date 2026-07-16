import React, { createContext, useState, useEffect, useMemo } from 'react';
import { deviceService, telemetryService, automationService, logService } from '../services/apiClient';

// Interfaces mapping models
export interface Device {
  id: string;
  room: string;
  name: string;
  type: 'light' | 'rgb' | 'climate' | 'appliance' | 'sprinkler' | 'media' | 'shades';
  value?: number;
  color?: string;
  mode?: string;
  isOn: boolean;
  detail: string;
}

export interface Telemetry {
  solarProduction: number;
  gridDraw: number;
  batteryCharge: number;
  homeConsumption: number;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isEnabled: boolean;
}

export interface AlarmLog {
  id: number;
  time: string;
  event: string;
  type: 'info' | 'warning';
}

// Fallback Mock Datasets
const MOCK_DEVICES: Device[] = [
  { id: 'dev-l1', room: 'living', name: 'Main Chandelier', type: 'light', value: 80, isOn: true, detail: 'Dimmer Light' },
  { id: 'dev-l2', room: 'living', name: 'Accent Lightstrip', type: 'rgb', value: 60, color: '#06b6d4', isOn: true, detail: 'LED RGB' },
  { id: 'dev-l3', room: 'living', name: 'Climate System', type: 'climate', value: 72, mode: 'cool', isOn: true, detail: 'Central HVAC' },
  { id: 'dev-l4', room: 'living', name: 'Smart TV', type: 'media', isOn: false, detail: 'Sony OLED' },
  { id: 'dev-k1', room: 'kitchen', name: 'Ceiling Spots', type: 'light', value: 100, isOn: true, detail: 'Halogen Spotlights' },
  { id: 'dev-k2', room: 'kitchen', name: 'Refrigerator', type: 'appliance', value: 37, mode: 'eco', isOn: true, detail: 'Samsung Hub' },
  { id: 'dev-b1', room: 'bedroom', name: 'Night Lamp', type: 'light', value: 30, isOn: true, detail: 'Ambient Bulb' },
  { id: 'dev-o1', room: 'office', name: 'Desk Panel', type: 'light', value: 90, isOn: true, detail: 'Desk Lamp' },
  { id: 'dev-o2', room: 'office', name: 'Office Climate', type: 'climate', value: 70, mode: 'cool', isOn: true, detail: 'Split AC' },
  { id: 'dev-out1', room: 'outdoor', name: 'Garden Sprinklers', type: 'sprinkler', value: 15, isOn: false, detail: 'Schedule: 6AM' }
];

const MOCK_TELEMETRY: Telemetry = {
  solarProduction: 4.8,
  gridDraw: 1.2,
  batteryCharge: 88,
  homeConsumption: 3.6
};

const MOCK_AUTOMATIONS: Automation[] = [
  { id: 'auto-1', name: 'Sunset Ambient Lights', trigger: 'Sunset', action: 'Activate Living Room Accent Lightstrip at 40%', isEnabled: true },
  { id: 'auto-2', name: 'Energy Save HVAC Temp', trigger: 'No motion for 1h', action: 'Set Living Climate to 78°F', isEnabled: true }
];

const MOCK_ALARM_LOGS: AlarmLog[] = [
  { id: 1, time: '18:42:15', event: 'Front Door opened by User praveen_bhotla', type: 'info' },
  { id: 2, time: '15:20:10', event: 'Backyard floodlight sensor triggered (False alarm: cat detected)', type: 'warning' }
];

interface AppContextProps {
  isLoading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRoom: string;
  setActiveRoom: (room: string) => void;
  devices: Device[];
  toggleDevice: (id: string) => Promise<void>;
  setDeviceValue: (id: string, val: number) => Promise<void>;
  setDeviceColor: (id: string, col: string) => Promise<void>;
  setDeviceMode: (id: string, mode: string) => Promise<void>;
  telemetry: Telemetry;
  automations: Automation[];
  addAutomationRule: (name: string, trigger: string, action: string) => Promise<void>;
  toggleAutomationRule: (id: string) => Promise<void>;
  deleteAutomationRule: (id: string) => Promise<void>;
  alarmLogs: AlarmLog[];
  alarmMode: string;
  updateAlarmMode: (mode: string) => void;
  roomsList: { id: string; name: string; icon: string }[];
  usingFallback: boolean;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeRoom, setActiveRoom] = useState('all');
  
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [telemetry, setTelemetry] = useState<Telemetry>(MOCK_TELEMETRY);
  const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS);
  const [alarmLogs, setAlarmLogs] = useState<AlarmLog[]>(MOCK_ALARM_LOGS);
  
  const [alarmMode, setAlarmMode] = useState('disarmed');

  const roomsList = [
    { id: 'all', name: 'Whole House', icon: 'home' },
    { id: 'living', name: 'Living Room', icon: 'sofa' },
    { id: 'kitchen', name: 'Kitchen', icon: 'utensils' },
    { id: 'bedroom', name: 'Master Bedroom', icon: 'bed' },
    { id: 'office', name: 'Home Office', icon: 'laptop' },
    { id: 'outdoor', name: 'Outdoor Patio', icon: 'trees' }
  ];

  // Primary Server Data Loader
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [devs, tel, autos, logs] = await Promise.all([
        deviceService.getAll(),
        telemetryService.get(),
        automationService.getAll(),
        logService.getAll()
      ]);

      setDevices(devs);
      setTelemetry(tel);
      setAutomations(autos);
      setAlarmLogs(logs);
      setUsingFallback(false);
    } catch (err) {
      console.warn('API Gateway offline. Booting frontend in decoupled mock offline fallback mode.');
      setUsingFallback(true);
      // Data falls back to MOCK variables configured in React state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Device Actions
  const toggleDevice = async (id: string) => {
    const target = devices.find(d => d.id === id);
    if (!target) return;
    const nextState = !target.isOn;

    if (!usingFallback) {
      try {
        const res = await deviceService.updateState(id, { isOn: nextState });
        setDevices(prev => prev.map(d => d.id === id ? res : d));
        const logs = await logService.getAll();
        setAlarmLogs(logs);
        return;
      } catch (err) {
        console.warn('Failed to sync toggle with server. Performing client state toggle.');
      }
    }

    // Fallback Client Action
    setDevices(prev => prev.map(d => d.id === id ? { ...d, isOn: nextState } : d));
    const timeStr = new Date().toTimeString().split(' ')[0];
    setAlarmLogs(prev => [
      { id: Date.now(), time: timeStr, event: `Device "${target.name}" was ${nextState ? 'turned ON' : 'turned OFF'} (Client Fallback Mode).`, type: 'info' },
      ...prev
    ]);
  };

  const setDeviceValue = async (id: string, value: number) => {
    if (!usingFallback) {
      try {
        const res = await deviceService.updateState(id, { value });
        setDevices(prev => prev.map(d => d.id === id ? res : d));
        return;
      } catch (err) {
        console.warn('Failed to sync value update with server.');
      }
    }
    setDevices(prev => prev.map(d => d.id === id ? { ...d, value } : d));
  };

  const setDeviceColor = async (id: string, color: string) => {
    if (!usingFallback) {
      try {
        const res = await deviceService.updateState(id, { color });
        setDevices(prev => prev.map(d => d.id === id ? res : d));
        return;
      } catch (err) {
        console.warn('Failed to sync color update with server.');
      }
    }
    setDevices(prev => prev.map(d => d.id === id ? { ...d, color } : d));
  };

  const setDeviceMode = async (id: string, mode: string) => {
    if (!usingFallback) {
      try {
        const res = await deviceService.updateState(id, { mode });
        setDevices(prev => prev.map(d => d.id === id ? res : d));
        return;
      } catch (err) {
        console.warn('Failed to sync mode update with server.');
      }
    }
    setDevices(prev => prev.map(d => d.id === id ? { ...d, mode } : d));
  };

  // Automations Rules Actions
  const addAutomationRule = async (name: string, trigger: string, action: string) => {
    if (!usingFallback) {
      try {
        const res = await automationService.create({ name, trigger, action });
        setAutomations(prev => [...prev, res]);
        const logs = await logService.getAll();
        setAlarmLogs(logs);
        return;
      } catch (err) {
        console.warn('Failed to register rule on backend server.');
      }
    }
    const newRule: Automation = {
      id: `auto-${Date.now()}`,
      name,
      trigger,
      action,
      isEnabled: true
    };
    setAutomations(prev => [...prev, newRule]);
  };

  const toggleAutomationRule = async (id: string) => {
    if (!usingFallback) {
      try {
        const res = await automationService.toggle(id);
        setAutomations(prev => prev.map(a => a.id === id ? res : a));
        return;
      } catch (err) {
        console.warn('Failed to toggle rule state on backend server.');
      }
    }
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, isEnabled: !a.isEnabled } : a));
  };

  const deleteAutomationRule = async (id: string) => {
    if (!usingFallback) {
      try {
        await automationService.delete(id);
        setAutomations(prev => prev.filter(a => a.id !== id));
        const logs = await logService.getAll();
        setAlarmLogs(logs);
        return;
      } catch (err) {
        console.warn('Failed to delete rule on backend server.');
      }
    }
    setAutomations(prev => prev.filter(a => a.id !== id));
  };

  // Security Log Actions
  const updateAlarmMode = (mode: string) => {
    setAlarmMode(mode);
    const timeStr = new Date().toTimeString().split(' ')[0];
    setAlarmLogs(prev => [
      { id: Date.now(), time: timeStr, event: `Alarm status updated to ${mode.toUpperCase()} mode.`, type: mode === 'disarmed' ? 'info' : 'warning' },
      ...prev
    ]);
  };

  return (
    <AppContext.Provider value={{
      isLoading, error, setError,
      activeTab, setActiveTab,
      activeRoom, setActiveRoom,
      devices, toggleDevice, setDeviceValue, setDeviceColor, setDeviceMode,
      telemetry,
      automations, addAutomationRule, toggleAutomationRule, deleteAutomationRule,
      alarmLogs, alarmMode, updateAlarmMode,
      roomsList, usingFallback
    }}>
      {children}
    </AppContext.Provider>
  );
};
