// lib/api.ts - Fixed with better debugging
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  APIError,
  CreateFirstAdminRequest,
  AdminInviteRequest,
  AdminInviteAccept,
  AdminInvite,
} from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Token management
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    console.log('🔐 getToken called, found:', token ? 'YES' : 'NO');
    return token;
  }
  return null;
};

const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    console.log('💾 Storing token in localStorage');
    localStorage.setItem('access_token', token);
  }
};

const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    console.log('🗑️ Removing token from localStorage');
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
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🚀 Making API request to:', endpoint);
  
  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add token if it exists
  const token = getToken();
  console.log('🔑 Token for request:', token ? `Bearer ${token.substring(0, 20)}...` : 'MISSING');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge with any headers from options
  const finalHeaders = {
    ...headers,
    ...(options.headers as Record<string, string>),
  };

  console.log('📤 Request headers:', finalHeaders);

  const config: RequestInit = {
    ...options,
    headers: finalHeaders,
  };

  try {
    const response = await fetch(url, config);

    console.log('📥 Response status:', response.status, response.statusText);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.status === 401) {
      console.log('❌ 401 Unauthorized - removing token');
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new APIException(401, 'Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API error response:', errorText);
      let errorDetail = 'API request failed';
      try {
        const errorJson = JSON.parse(errorText);
        errorDetail = errorJson.detail || errorDetail;
      } catch {
        errorDetail = errorText || errorDetail;
      }
      throw new APIException(response.status, errorDetail);
    }

    const data = await response.json();
    console.log('✅ API success response:', data);
    return data;
  } catch (error) {
    console.error('💥 API Error:', error);
    if (error instanceof APIException) {
      throw error;
    }
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
    console.log('🔐 Starting login process...');
    const response = await apiRequest<{
      message: string;
      access_token: string;
      token_type: string;
      user: unknown;
    }>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store token in localStorage
    if (response.access_token) {
      console.log('✅ Login successful, storing token...');
      setToken(response.access_token);
      
      // Verify token was stored
      const verifyToken = localStorage.getItem('access_token');
      console.log('🔍 Token storage verification:', verifyToken ? 'SUCCESS' : 'FAILED');
    } else {
      console.error('❌ No access_token in login response!');
    }

    return {
      message: response.message,
      user: response.user,
    };
  },

  logout: (): void => {
    console.log('👋 Logging out...');
    removeToken();
  },

  createFirstAdmin: (data: CreateFirstAdminRequest): Promise<MessageResponse> =>
    apiRequest('/create-first-admin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: (): Promise<User> => {
    console.log('👤 Getting current user...');
    return apiRequest('/me');
  },
};

// ... rest of your API functions remain the same
export const habitAPI = {
  getAllHabits: (): Promise<Habit[]> => apiRequest('/habits'),
  createHabit: (data: CreateHabitRequest): Promise<Habit> =>
    apiRequest('/habits', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  checkInHabit: (habitId: number, data: CheckInRequest = {}): Promise<Habit> =>
    apiRequest(`/check-in/${habitId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const progressAPI = {
  getDailyProgress: (): Promise<Progress> => apiRequest('/progress'),
  getWeeklyProgress: (): Promise<WeeklyProgress> => apiRequest('/progress/weekly'),
};

export const gamificationAPI = {
  getUserStats: (): Promise<UserStats> => apiRequest('/stats'),
  getBadges: (): Promise<Badge[]> => apiRequest('/badges'),
};

export const recommendationAPI = {
  generateRecommendation: (recommendationType: 'motivation' | 'improvement' | 'habit_suggestion'): Promise<AIRecommendation> =>
    apiRequest('/recommendations/generate', {
      method: 'POST',
      body: JSON.stringify({ recommendation_type: recommendationType }),
    }),
  getRecommendations: (limit: number = 10, unreadOnly: boolean = false): Promise<AIRecommendation[]> =>
    apiRequest(`/recommendations?limit=${limit}&unread_only=${unreadOnly}`),
  getDailyRecommendations: (): Promise<AIRecommendation[]> => apiRequest('/recommendations/daily'),
  markAsRead: (recommendationId: number): Promise<MessageResponse> =>
    apiRequest(`/recommendations/${recommendationId}/read`, {
      method: 'PATCH',
    }),
};

export const adminAPI = {
  getAllUsers: (): Promise<User[]> => apiRequest('/admin/users'),
  createUser: (email: string, password: string, role: string = 'user'): Promise<MessageResponse> =>
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