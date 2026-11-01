// src/api/enrollmentApi.js
import apiClient from './apiClient';

export const getMyEnrollments = async () => (await apiClient.get('/enrollments/me')).data;
export const enrollInCourse = async (courseId) => (await apiClient.post('/enrollments', { courseId })).data;
export const unenrollFromCourse = async (id) => (await apiClient.delete(`/enrollments/${id}`)).data;
