import api from './api';

export const postTransaction = async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
};