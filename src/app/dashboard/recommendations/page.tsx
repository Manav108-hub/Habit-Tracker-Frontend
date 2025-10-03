// src/app/dashboard/recommendations/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { recommendationAPI } from '@/lib/api';
import type { AIRecommendation } from '@/lib/types';

function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await recommendationAPI.getDailyRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNew = async (type: 'motivation' | 'improvement' | 'habit_suggestion') => {
    setGenerating(true);
    try {
      await recommendationAPI.generateRecommendation(type);
      loadRecommendations();
    } catch (error) {
      console.error('Failed to generate recommendation:', error);
    } finally {
      setGenerating(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await recommendationAPI.markAsRead(id);
      setRecommendations(recommendations.map(rec => 
        rec.id === id ? { ...rec, is_read: true } : rec
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
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
        <h1 className="dashboard-title">AI Recommendations</h1>
        <p className="dashboard-subtitle">Personalized insights powered by AI</p>
      </div>

      {/* Generate New Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">Generate New Recommendation</h2>
          <p className="card-description">Get AI-powered suggestions for your habits</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-3">
            <button 
              onClick={() => generateNew('motivation')}
              disabled={generating}
              className="btn btn-outline"
            >
              {generating ? 'Generating...' : '💪 Motivation'}
            </button>
            <button 
              onClick={() => generateNew('improvement')}
              disabled={generating}
              className="btn btn-outline"
            >
              {generating ? 'Generating...' : '📈 Improvement'}
            </button>
            <button 
              onClick={() => generateNew('habit_suggestion')}
              disabled={generating}
              className="btn btn-outline"
            >
              {generating ? 'Generating...' : '💡 New Habit'}
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      {recommendations.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
            </div>
            <h3 className="empty-state-title">No recommendations yet</h3>
            <p className="empty-state-description">
              Generate your first AI-powered recommendation using the buttons above
            </p>
          </div>
        </div>
      ) : (
        <div>
          {recommendations.map((rec) => (
            <div 
              key={rec.id} 
              className={`recommendation-card ${!rec.is_read ? 'unread' : ''}`}
            >
              <div className="recommendation-header">
                <div>
                  <h3 className="recommendation-title">{rec.title}</h3>
                  <span className="badge" style={{ marginTop: '0.5rem' }}>
                    {rec.recommendation_type.replace('_', ' ')}
                  </span>
                </div>
                {!rec.is_read && (
                  <button 
                    onClick={() => markAsRead(rec.id)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
              <p className="recommendation-content">{rec.content}</p>
              <div className="recommendation-footer">
                <span className="text-small text-muted">
                  {new Date(rec.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                {rec.source_ai && (
                  <span className="text-small text-muted">
                    Powered by {rec.source_ai}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendationsPage;