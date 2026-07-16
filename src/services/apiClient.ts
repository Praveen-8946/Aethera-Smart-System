import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const deviceService = {
  getAll: async () => {
    const res = await apiClient.get('/devices');
    return res.data;
  },
  updateState: async (id: string, updates: { isOn?: boolean; value?: number; color?: string; mode?: string }) => {
    const res = await apiClient.put(`/devices/${id}`, updates);
    return res.data;
  },
};

export const telemetryService = {
  get: async () => {
    const res = await apiClient.get('/telemetry');
    return res.data;
  },
};

export const automationService = {
  getAll: async () => {
    const res = await apiClient.get('/automations');
    return res.data;
  },
  create: async (rule: { name: string; trigger: string; action: string }) => {
    const res = await apiClient.post('/automations', rule);
    return res.data;
  },
  toggle: async (id: string) => {
    const res = await apiClient.put(`/automations/${id}/toggle`);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/automations/${id}`);
    return res.data;
  },
};

export const logService = {
  getAll: async () => {
    const res = await apiClient.get('/logs');
    return res.data;
  },
  add: async (event: string, type: 'info' | 'warning' = 'info') => {
    const res = await apiClient.post('/logs', { event, type });
    return res.data;
  },
};

export default apiClient;
