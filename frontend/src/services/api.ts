import axios from 'axios';
import type { TestCaseGenerationRequest, TestCaseGenerationResponse, TestCaseDBModel, TestCase } from '../types/testcaseTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Construct WebSocket URL dynamically based on API_BASE_URL
const getWsUrl = () => {
  const isSecure = window.location.protocol === 'https:';
  const protocol = isSecure ? 'wss:' : 'ws:';
  
  // If API_BASE_URL is a full URL, extract the host
  if (API_BASE_URL.startsWith('http')) {
    const host = API_BASE_URL.replace(/^https?:\/\//, '').split('/')[0];
    return `${protocol}//${host}/api/v1/ws/execute`;
  }
  
  // Fallback to current host if relative path (unlikely)
  return `${protocol}//${window.location.host}/api/v1/ws/execute`;
};

export const WS_URL = getWsUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const TestAppService = {
  generateTestCases: async (request: TestCaseGenerationRequest): Promise<TestCaseGenerationResponse> => {
    const response = await apiClient.post<TestCaseGenerationResponse>('/generate-testcases', request);
    return response.data;
  },
  getHistory: async (): Promise<TestCaseDBModel[]> => {
    const response = await apiClient.get<TestCaseDBModel[]>('/history');
    return response.data;
  },
  saveTestCases: async (suiteName: string, testCases: TestCase[]): Promise<TestCaseDBModel[]> => {
    const response = await apiClient.post<TestCaseDBModel[]>('/save-testcases', { suite_name: suiteName, test_cases: testCases });
    return response.data;
  },
  editTestCase: async (id: string, data: Partial<TestCaseDBModel>): Promise<TestCaseDBModel> => {
    const response = await apiClient.put<TestCaseDBModel>(`/edit/${id}`, data);
    return response.data;
  },
  deleteTestCase: async (id: string): Promise<{status: string, message: string}> => {
    const response = await apiClient.delete<{status: string, message: string}>(`/delete/${id}`);
    return response.data;
  },
  deleteSuite: async (suiteId: string): Promise<{status: string, message: string}> => {
    const response = await apiClient.delete<{status: string, message: string}>(`/delete-suite/${suiteId}`);
    return response.data;
  },
  generateFromFile: async (file: File): Promise<TestCaseGenerationResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<TestCaseGenerationResponse>('/generate-from-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  generateFromUrl: async (url: string): Promise<TestCaseGenerationResponse> => {
    const response = await apiClient.post<TestCaseGenerationResponse>('/generate-from-url', { url });
    return response.data;
  }
};
