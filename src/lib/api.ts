// lib/api.ts - Token-based API client for production

import type {
  User,
  Habit,
  Badge,
  AIRecommendation,
  Progress,
  UserStats,
  WeeklyProgress,
  AdminAnalytics,
  LoginRequest,
  SignupRequest,
  CreateHabitRequest,
  CheckInRequest,
  MessageResponse,
  APIError,
  CreateFirstAdminRequest,
  AdminInviteRequest,
  AdminInviteAccept,
  AdminInvite,
} from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Token management
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

// Custom error class
class APIException extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIException';
  }
}

// Generic API request handler
// Generic API request handler
// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Build headers with proper typing
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add token if it exists - read directly at fetch time
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Merge with any headers from options
  const finalHeaders = {
    ...headers,
    ...(options.headers as Record<string, string>),
  };

  const config: RequestInit = {
    ...options,
    headers: finalHeaders,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new APIException(401, 'Unauthorized');
    }

    if (!response.ok) {
      const error: APIError = await response.json();
      throw new APIException(response.status, error.detail || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIException) {
      throw error;
    }
    console.error('API Error:', error);
    throw new Error('Network error or server unavailable');
  }
}
// Authentication APIs
export const authAPI = {
  signup: (data: SignupRequest): Promise<MessageResponse> =>
    apiRequest('/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: async (data: LoginRequest): Promise<{ message: string; user: unknown }> => {
    const response = await apiRequest<{
      message: string;
      access_token: string;
      token_type: string;
      user: unknown;
    }>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store token and wait for localStorage to update
    if (response.access_token) {
      setToken(response.access_token);
      // Small delay to ensure localStorage write completes
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return {
      message: response.message,
      user: response.user,
    };
  },

  logout: (): void => {
    removeToken();
  },

  createFirstAdmin: (data: CreateFirstAdminRequest): Promise<MessageResponse> =>
    apiRequest('/create-first-admin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: (): Promise<User> => apiRequest('/me'),
};

// Habit APIs
export const habitAPI = {
  getAllHabits: (): Promise<Habit[]> => apiRequest('/habits'),

  createHabit: (data: CreateHabitRequest): Promise<Habit> =>
    apiRequest('/habits', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkInHabit: (
    habitId: number,
    data: CheckInRequest = {}
  ): Promise<Habit> =>
    apiRequest(`/check-in/${habitId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Progress APIs
export const progressAPI = {
  getDailyProgress: (): Promise<Progress> => apiRequest('/progress'),

  getWeeklyProgress: (): Promise<WeeklyProgress> => apiRequest('/progress/weekly'),
};

// Gamification APIs
export const gamificationAPI = {
  getUserStats: (): Promise<UserStats> => apiRequest('/stats'),

  getBadges: (): Promise<Badge[]> => apiRequest('/badges'),
};

// AI Recommendation APIs
export const recommendationAPI = {
  generateRecommendation: (
    recommendationType: 'motivation' | 'improvement' | 'habit_suggestion'
  ): Promise<AIRecommendation> =>
    apiRequest('/recommendations/generate', {
      method: 'POST',
      body: JSON.stringify({ recommendation_type: recommendationType }),
    }),

  getRecommendations: (
    limit: number = 10,
    unreadOnly: boolean = false
  ): Promise<AIRecommendation[]> =>
    apiRequest(`/recommendations?limit=${limit}&unread_only=${unreadOnly}`),

  getDailyRecommendations: (): Promise<AIRecommendation[]> =>
    apiRequest('/recommendations/daily'),

  markAsRead: (recommendationId: number): Promise<MessageResponse> =>
    apiRequest(`/recommendations/${recommendationId}/read`, {
      method: 'PATCH',
    }),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: (): Promise<User[]> => apiRequest('/admin/users'),

  createUser: (
    email: string,
    password: string,
    role: string = 'user'
  ): Promise<MessageResponse> =>
    apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),

  getAnalytics: (): Promise<AdminAnalytics> => apiRequest('/admin/analytics'),

  inviteAdmin: (data: AdminInviteRequest): Promise<AdminInvite> =>
    apiRequest('/admin/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getInvites: (): Promise<AdminInvite[]> => apiRequest('/admin/invites'),

  revokeInvite: (inviteId: number): Promise<MessageResponse> =>
    apiRequest(`/admin/invites/${inviteId}`, {
      method: 'DELETE',
    }),

  acceptInvite: (data: AdminInviteAccept): Promise<MessageResponse> =>
    apiRequest('/admin/accept-invite', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  authAPI,
  habitAPI,
  progressAPI,
  gamificationAPI,
  recommendationAPI,
  adminAPI,
};