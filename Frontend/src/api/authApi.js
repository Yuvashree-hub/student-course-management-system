// src/api/authApi.js
import apiClient from './apiClient';

export const registerStudent = async (data) => (await apiClient.post('/auth/register', data)).data;
export const loginStudent = async (credentials) => (await apiClient.post('/auth/login', credentials)).data;
export const fetchMe = async () => (await apiClient.get('/auth/me')).data;
export const forgotPassword = async (email) => (await apiClient.post('/auth/forgot-password', { email })).data;
export const resetPassword = async (token, password) =>
  (await apiClient.post(`/auth/reset-password/${token}`, { password })).data;
