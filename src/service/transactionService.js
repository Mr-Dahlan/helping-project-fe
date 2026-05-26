import api from './api';

export const postTransaction = async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
};

export const updateTransactionStatus = async (id, status) => {
    const response = await api.patch(`/transactions/${id}/status`, { status });
    return response.data;
};