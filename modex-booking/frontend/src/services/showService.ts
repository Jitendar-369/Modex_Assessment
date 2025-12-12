import API from './api';
import { Show } from '../types';

export const getAllShows = async () => {
    const response = await API.get('/shows');
    return response.data;
};

export const getShowById = async (id: string) => {
    const response = await API.get(`/shows/${id}`);
    return response.data;
};

export const createShow = async (showData: any) => {
    const response = await API.post('/shows', showData);
    return response.data;
};

export const updateShow = async (id: string, showData: any) => {
    const response = await API.put(`/shows/${id}`, showData);
    return response.data;
};

export const deleteShow = async (id: string) => {
    const response = await API.delete(`/shows/${id}`);
    return response.data;
};
