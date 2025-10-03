'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { progressAPI, gamificationAPI, habitAPI } from '@/lib/api';
import type { Progress, UserStats, Habit } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentHabits, setRecentHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication first
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      router.replace('/login');
      return;
    }
    
    setIsAuthenticated(true);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      const [progressData, statsData, habitsData] = await Promise.all([
        progressAPI.getDailyProgress(),
        gamificationAPI.getUserStats(),
        habitAPI.getAllHabits(),
      ]);
      
      setProgress(progressData);
      setStats(statsData);
      setRecentHabits(habitsData.slice(0, 3));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem' }}></div>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here&apos;s your progress overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid-dashboard">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Points</span>
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{stats?.total_points || 0}</div>
          <div className="stat-card-description">Keep earning to level up!</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Current Level</span>
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">Level {stats?.level || 1}</div>
          <div className="stat-card-description">{stats?.total_points || 0} / {(stats?.level || 1) * 100} XP</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Today&apos;s Progress</span>
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{progress?.completionRate.toFixed(0) || 0}%</div>
          <div className="stat-card-description">
            {progress?.completedToday || 0} of {progress?.totalHabits || 0} completed
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Badges Earned</span>
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{stats?.badges_count || 0}</div>
          <div className="stat-card-description">Collect them all!</div>
        </div>
      </div>

      {/* Recent Habits */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header flex-between">
          <div>
            <h2 className="card-title">Recent Habits</h2>
            <p className="card-description">Your most recent habits</p>
          </div>
          <Link href="/dashboard/habits" className="btn btn-outline">
            View All
          </Link>
        </div>
        <div className="card-content">
          {recentHabits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <h3 className="empty-state-title">No habits yet</h3>
              <p className="empty-state-description">
                Create your first habit to start tracking your progress
              </p>
              <Link href="/dashboard/habits" className="btn btn-primary">
                Create Habit
              </Link>
            </div>
          ) : (
            <div className="habit-list">
              {recentHabits.map((habit) => (
                <div key={habit.id} className="habit-card">
                  <div className="habit-card-header">
                    <div className="habit-card-info">
                      <h3 className="habit-card-title">{habit.name}</h3>
                      {habit.description && (
                        <p className="habit-card-description">{habit.description}</p>
                      )}
                      <div className="habit-card-meta">
                        <div className="habit-meta-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                          <span>{habit.check_ins.length} check-ins</span>
                        </div>
                        <div className="habit-meta-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                          <span>{habit.points_per_completion} points</span>
                        </div>
                      </div>
                    </div>
                    {habit.current_streak > 0 && (
                      <div className="habit-streak">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        </svg>
                        <span>{habit.current_streak} day streak</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3">
        <Link href="/dashboard/habits" className="card feature-card">
          <div className="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <h3 className="feature-title">Create New Habit</h3>
          <p className="feature-description">Add a new habit to track</p>
        </Link>

        <Link href="/dashboard/progress" className="card feature-card">
          <div className="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h3 className="feature-title">View Progress</h3>
          <p className="feature-description">See your weekly analytics</p>
        </Link>

        <Link href="/dashboard/recommendations" className="card feature-card">
          <div className="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
          <h3 className="feature-title">Get Recommendations</h3>
          <p className="feature-description">AI-powered habit suggestions</p>
        </Link>
      </div>
    </div>
  );
}