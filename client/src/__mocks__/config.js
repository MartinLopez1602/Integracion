// Mock para config.js usado en pruebas
export const API_BASE_URL = 'http://localhost:5000';
export const FRONTEND_URL = 'http://localhost:3000';

export const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
export const buildFrontendUrl = (path) => `${FRONTEND_URL}${path}`;
export const buildImageUrl = (imagePath) => `${API_BASE_URL}/images/${imagePath}`;
