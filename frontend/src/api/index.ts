import api from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authAPI = {
  register: async (email: string, name: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      name,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

export const machineAPI = {
  list: async (skip: number = 0, limit: number = 10) => {
    const response = await api.get('/machines', { params: { skip, limit } });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/machines/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/machines', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/machines/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/machines/${id}`);
  },
};

export const componentAPI = {
  list: async (machineId?: string, skip: number = 0, limit: number = 10) => {
    const response = await api.get('/components', {
      params: { machine_id: machineId, skip, limit },
    });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/components/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/components', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/components/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/components/${id}`);
  },
};

export const inspectionAPI = {
  list: async (skip: number = 0, limit: number = 10) => {
    const response = await api.get('/inspections', { params: { skip, limit } });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/inspections/${id}`);
    return response.data;
  },

  create: async (componentId: string, machineId: string, image: File) => {
    const formData = new FormData();
    formData.append('component_id', componentId);
    formData.append('machine_id', machineId);
    formData.append('file', image);

    const response = await api.post('/inspections', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const alertAPI = {
  list: async (skip: number = 0, limit: number = 10) => {
    const response = await api.get('/alerts', { params: { skip, limit } });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },

  acknowledge: async (id: string) => {
    const response = await api.post(`/alerts/${id}/acknowledge`);
    return response.data;
  },

  resolve: async (id: string) => {
    const response = await api.post(`/alerts/${id}/resolve`);
    return response.data;
  },
};

export const maintenanceAPI = {
  list: async (skip: number = 0, limit: number = 10) => {
    const response = await api.get('/maintenance', { params: { skip, limit } });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/maintenance/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/maintenance', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/maintenance/${id}`, data);
    return response.data;
  },

  complete: async (id: string) => {
    const response = await api.post(`/maintenance/${id}/complete`);
    return response.data;
  },
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getChartData: async (period: string = '30d') => {
    const response = await api.get('/dashboard/chart-data', { params: { period } });
    return response.data;
  },
};
