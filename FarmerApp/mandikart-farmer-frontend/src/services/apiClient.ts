/**
 * MandiKart — API Client Service
 *
 * Centralized API client layer.
 * To be used within TanStack Query hooks.
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.mandikart.com/v1';

export const apiClient = {
  get: async <T>(endpoint: string, token?: string | null): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API GET Error: ${response.statusText}`);
    }
    return response.json();
  },

  post: async <T, D>(endpoint: string, data: D, token?: string | null): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API POST Error: ${response.statusText}`);
    }
    return response.json();
  },

  // TODO: Add PUT, PATCH, DELETE when required
};
