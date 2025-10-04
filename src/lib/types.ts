// lib/types.ts - All TypeScript interfaces and types

export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  total_points: number;
  level: number;
  created_at: string;
  updated_at?: string;
  is_active:boolean
}

export interface Habit {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  difficulty_level: number;
  target_frequency: string;
  start_date: string;
  user_id: number;
  is_active: boolean;
  points_per_completion: number;
  current_streak: number;
  check_ins: HabitCheckIn[];
  created_at: string;
  updated_at?: string;
}

export interface HabitCheckIn {
  id: number;
  habit_id: number;
  check_in_date: string;
  notes: string | null;
  mood_rating: number | null;
  points_earned: number;
  created_at: string;
}

export interface Badge {
  id: number;
  user_id: number;
  badge_type: string;
  badge_name: string;
  badge_description: string;
  earned_at: string;
}

export interface AIRecommendation {
  id: number;
  user_id: number;
  recommendation_type: 'motivation' | 'improvement' | 'habit_suggestion';
  title: string;
  content: string;
  priority: number;
  is_read: boolean;
  source_ai: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface Progress {
  completedToday: number;
  totalHabits: number;
  completionRate: number;
  currentLevel: number;
  totalPoints: number;
}

export interface UserStats {
  total_points: number;
  level: number;
  total_habits: number;
  active_streaks: number[];
  badges_count: number;
  recent_badges: Badge[];
}

export interface WeeklyProgress {
  weekly_progress: DailyProgress[];
}

export interface DailyProgress {
  date: string;
  completed: number;
  total: number;
  completion_rate: number;
}

export interface AdminAnalytics {
  total_users: number;
  total_habits: number;
  total_checkins: number;
  active_users_last_7_days: number;
  average_habits_per_user: number;
}

// Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  category?: string;
  difficulty_level: number;
  target_frequency: string;
}

export interface CheckInRequest {
  mood_rating?: number;
  notes?: string;
}

export interface MessageResponse {
  message: string;
}

export interface APIError {
  detail: string;
}

// Admin types
export interface AdminInvite {
  id: number;
  email: string;
  invite_token: string;
  is_used: boolean;
  expires_at: string;
  created_at: string;
  used_at: string | null;
}

export interface CreateFirstAdminRequest {
  email: string;
  password: string;
  admin_creation_secret: string;
}

export interface AdminInviteRequest {
  email: string;
  admin_creation_secret: string;
}

export interface AdminInviteAccept {
  invite_token: string;
  password: string;
}