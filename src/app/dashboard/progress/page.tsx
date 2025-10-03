// src/app/dashboard/progress/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { progressAPI } from '@/lib/api';
import type { Progress, WeeklyProgress } from '@/lib/types';

function ProgressPage() {
  const [dailyProgress, setDailyProgress] = useState<Progress | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const [daily, weekly] = await Promise.all([
        progressAPI.getDailyProgress(),
        progressAPI.getWeeklyProgress(),
      ]);
      setDailyProgress(daily);
      setWeeklyProgress(weekly);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem' }}></div>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Progress</h1>
        <p className="dashboard-subtitle">Track your habit completion and growth</p>
      </div>

      {/* Today's Progress */}
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">Today&apos;s Progress</h2>
          <p className="card-description">Your completion status for today</p>
        </div>
        <div className="card-content">
          <div className="progress-bar-container">
            <div className="progress-bar-header">
              <span className="progress-bar-label">Overall Completion</span>
              <span className="progress-bar-value">{dailyProgress?.completionRate.toFixed(0)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${dailyProgress?.completionRate || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 mt-4">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Completed</span>
                <div className="stat-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
              </div>
              <div className="stat-card-value">{dailyProgress?.completedToday || 0}</div>
              <div className="stat-card-description">Habits checked in today</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Total Habits</span>
                <div className="stat-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </div>
              </div>
              <div className="stat-card-value">{dailyProgress?.totalHabits || 0}</div>
              <div className="stat-card-description">Active habits</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-title">Points Earned</span>
                <div className="stat-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
              </div>
              <div className="stat-card-value">{dailyProgress?.totalPoints || 0}</div>
              <div className="stat-card-description">Level {dailyProgress?.currentLevel || 1}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Weekly Progress</h2>
          <p className="card-description">Your completion rates for the past 7 days</p>
        </div>
        <div className="card-content">
          {weeklyProgress?.weekly_progress && weeklyProgress.weekly_progress.length > 0 ? (
            <div>
              {weeklyProgress.weekly_progress.map((day, index) => (
                <div key={index} className="mb-3">
                  <div className="progress-bar-header">
                    <span className="progress-bar-label">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="progress-bar-value">
                      {day.completed}/{day.total} ({day.completion_rate.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${day.completion_rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 className="empty-state-title">No data yet</h3>
              <p className="empty-state-description">
                Start tracking habits to see your weekly progress
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;