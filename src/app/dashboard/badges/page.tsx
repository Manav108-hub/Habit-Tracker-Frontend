// src/app/dashboard/badges/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { gamificationAPI } from '@/lib/api';
import type { Badge } from '@/lib/types';

function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const data = await gamificationAPI.getBadges();
      setBadges(data);
    } catch (error) {
      console.error('Failed to load badges:', error);
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
        <h1 className="dashboard-title">Badges & Achievements</h1>
        <p className="dashboard-subtitle">Your earned badges and milestones</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid-dashboard mb-4">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Badges</span>
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
          <div className="stat-card-value">{badges.length}</div>
          <div className="stat-card-description">Achievements earned</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Latest Badge</span>
            <div className="stat-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
          </div>
          <div className="stat-card-value" style={{ fontSize: '1.25rem' }}>
            {badges.length > 0 ? badges[0].badge_name : 'None'}
          </div>
          <div className="stat-card-description">
            {badges.length > 0 
              ? new Date(badges[0].earned_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'Start earning badges!'}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      {badges.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </div>
            <h3 className="empty-state-title">No badges yet</h3>
            <p className="empty-state-description">
              Keep tracking your habits to unlock achievements!
            </p>
          </div>
        </div>
      ) : (
        <div className="badge-grid">
          {badges.map((badge) => (
            <div key={badge.id} className="badge-card">
              <div className="badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
              <h3 className="badge-name">{badge.badge_name}</h3>
              <p className="badge-description">{badge.badge_description}</p>
              <div className="text-small text-muted" style={{ marginTop: '0.75rem' }}>
                Earned on {new Date(badge.earned_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BadgesPage;