// src/api/learningApi.js
import apiClient from './apiClient';

export const getLearning = async (enrollmentId) => (await apiClient.get(`/learning/${enrollmentId}`)).data;
export const completeModuleApi = async (enrollmentId, moduleId) =>
  (await apiClient.post(`/learning/${enrollmentId}/modules/${moduleId}/complete`)).data;
export const submitQuizApi = async (enrollmentId, answers) =>
  (await apiClient.post(`/learning/${enrollmentId}/quiz`, { answers })).data;
