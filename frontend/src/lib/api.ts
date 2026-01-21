import axios from 'axios';
import type {
  GenerateImageRequest,
  GenerateImageResponse,
  JobStatusResponse,
  HealthCheckResponse,
} from '@/types/api.types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateImage = async (
  request: GenerateImageRequest
): Promise<GenerateImageResponse> => {
  const response = await api.post<GenerateImageResponse>(
    '/generate-image',
    request
  );
  return response.data;
};

export const getJobStatus = async (
  jobId: string
): Promise<JobStatusResponse> => {
  const response = await api.get<JobStatusResponse>(`/status/${jobId}`);
  return response.data;
};

export const getImageUrl = (jobId: string): string => {
  return `http://localhost:8000/image/${jobId}`;
};

export const checkHealth = async (): Promise<HealthCheckResponse> => {
  const response = await api.get<HealthCheckResponse>('/health');
  return response.data;
};
