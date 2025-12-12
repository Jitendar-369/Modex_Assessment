import API from './api';
import { User } from '../types';

export const register = async (userData: any) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
};

export const login = async (userData: any) => {
    const response = await API.post('/auth/login', userData);
    return response.data;
};
