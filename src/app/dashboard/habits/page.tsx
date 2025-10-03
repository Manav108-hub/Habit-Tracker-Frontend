// src/app/dashboard/habits/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { habitAPI } from '@/lib/api';
import type { Habit, CreateHabitRequest } from '@/lib/types';

function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateHabitRequest>({
    name: '',
    description: '',
    category: '',
    difficulty_level: 1,
    target_frequency: 'daily',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await habitAPI.getAllHabits();
      setHabits(data);
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await habitAPI.createHabit(formData);
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        category: '',
        difficulty_level: 1,
        target_frequency: 'daily',
      });
      loadHabits();
    } catch (error) {
      console.error('Failed to create habit:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckIn = async (habitId: number) => {
  // Disable multiple clicks
  const button = document.querySelector(`[data-habit-id="${habitId}"]`) as HTMLButtonElement;
  if (button) {
    button.disabled = true;
    button.textContent = 'Checking in...';
  }

  try {
    await habitAPI.checkInHabit(habitId);
    loadHabits();
  } catch (error) {
    console.error('Failed to check in:', error);
    alert('Failed to check in habit');
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = 'Check In';
    }
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
      <div className="dashboard-header flex-between">
        <div>
          <h1 className="dashboard-title">My Habits</h1>
          <p className="dashboard-subtitle">Create and track your daily habits</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Create Habit'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="card-title">Create New Habit</h2>
            <p className="card-description">Fill in the details to create a new habit</p>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Habit Name *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g., Morning Exercise"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Describe your habit..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    type="text"
                    placeholder="e.g., Health, Fitness"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="frequency">Frequency</label>
                  <select
                    id="frequency"
                    value={formData.target_frequency}
                    onChange={(e) => setFormData({ ...formData, target_frequency: e.target.value })}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulty Level: {formData.difficulty_level}</label>
                <input
                  id="difficulty"
                  type="range"
                  min="1"
                  max="5"
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({ ...formData, difficulty_level: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <div className="flex-between text-small text-muted">
                  <span>Easy</span>
                  <span>Hard</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  'Create Habit'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="card">
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
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Create Your First Habit
            </button>
          </div>
        </div>
      ) : (
        <div className="habit-list">
          {habits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <div className="habit-card-header">
                <div className="habit-card-info">
                  <h3 className="habit-card-title">{habit.name}</h3>
                  {habit.description && (
                    <p className="habit-card-description">{habit.description}</p>
                  )}
                  <div className="habit-card-meta">
                    {habit.category && (
                      <div className="habit-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                          <line x1="7" y1="7" x2="7.01" y2="7"/>
                        </svg>
                        <span>{habit.category}</span>
                      </div>
                    )}
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
                <div className="habit-card-actions" style={{ flexDirection: 'column', alignItems: 'end', gap: '0.5rem' }}>
                  {habit.current_streak > 0 && (
                    <div className="habit-streak">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                      </svg>
                      <span>{habit.current_streak} day streak</span>
                    </div>
                  )}
                  <button 
                    onClick={() => handleCheckIn(habit.id)}
                    className="btn btn-primary"
                  >
                    Check In
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HabitsPage;