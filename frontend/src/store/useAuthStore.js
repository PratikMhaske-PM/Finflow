import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('finflow_token') || null,
    isAuthenticated: !!localStorage.getItem('finflow_token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, ...userData } = response.data;
            localStorage.setItem('finflow_token', token);
            set({
                user: userData,
                token,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Login failed',
                isLoading: false 
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { token, ...userData } = response.data;
            localStorage.setItem('finflow_token', token);
            set({
                user: userData,
                token,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Registration failed',
                isLoading: false 
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    logout: () => {
        localStorage.removeItem('finflow_token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    fetchProfile: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/auth/profile');
            set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            localStorage.removeItem('finflow_token');
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
    }
}));

export default useAuthStore;
