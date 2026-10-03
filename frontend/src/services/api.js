/**
 * VayuGuard Centralized API Service
 * Interacts with VayuGuard REST API backend using VITE_API_URL.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Core HTTP Request Wrapper
 */
async function request(endpoint, options = {}, explicitToken = null) {
  const token = explicitToken || localStorage.getItem('vayuguard_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (err) {
    throw new Error('Unable to connect to VayuGuard server. Please check your network connection.');
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || `HTTP Error ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Authentication API Services
export async function registerUser(data) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(data) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getCurrentUser(token = null) {
  return request('/auth/me', { method: 'GET' }, token);
}

// Air Quality API Services
export async function getCurrentAirQuality(location = null, token = null) {
  const query = location ? `?location=${encodeURIComponent(location)}` : '';
  return request(`/air-quality/current${query}`, { method: 'GET' }, token);
}

export async function getAirQualityHistory(location = null, token = null, limit = 50) {
  const params = new URLSearchParams();
  if (location) params.append('location', location);
  if (limit) params.append('limit', limit);
  const queryString = params.toString() ? `?${params.toString()}` : '';

  return request(`/air-quality/history${queryString}`, { method: 'GET' }, token);
}

export async function getAirQualitySummary(location = null, token = null) {
  const query = location ? `?location=${encodeURIComponent(location)}` : '';
  return request(`/air-quality/summary${query}`, { method: 'GET' }, token);
}

export async function getAirQualityById(id, token = null) {
  return request(`/air-quality/${id}`, { method: 'GET' }, token);
}

export async function createAirQualityReading(data, token = null) {
  return request('/air-quality', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);
}

// Alias for backwards compatibility
export const postAirQualityReading = createAirQualityReading;
