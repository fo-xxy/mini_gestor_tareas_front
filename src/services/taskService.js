import api from '../api/axios';

export const taskService = {
    getAll: () => api.get('/getTasks'),
    create: (data) => api.post('/insertTask', data),
    update: (id, data) => api.put(`/updateTask/${id}`, data),
    delete: (id) => api.delete(`/deleteTask/${id}`),
};