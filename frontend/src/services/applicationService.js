// src/services/applicationService.js
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Create application
export const createApplication = async (applicationData) => {
  const response = await axiosInstance.post(API_PATHS.APPLICATIONS, applicationData);
  return response.data;
};

// Update application
export const updateApplication = async (id, applicationData) => {
  const response = await axiosInstance.put(`${API_PATHS.APPLICATIONS}/${id}`, applicationData);
  return response.data;
};

// Delete application
export const deleteApplication = async (id) => {
  const response = await axiosInstance.delete(`${API_PATHS.APPLICATIONS}/${id}`);
  return response.data;
};

// Get all applications
export const fetchApplications = async () => {
  const response = await axiosInstance.get(API_PATHS.APPLICATIONS);
  return response.data;
};
