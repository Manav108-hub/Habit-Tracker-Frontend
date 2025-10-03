// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <Link href="/" className="nav-brand">
            <div className="nav-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span className="nav-title">HabitFlow</span>
          </Link>
          
          <div className="nav-actions">
            <Link href="/login" className="btn btn-outline">
              Sign In
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <span className="badge">AI-Powered Habit Tracking</span>
          </div>
          
          <h1 className="hero-title">
            Build Better Habits,<br />
            Transform Your Life
          </h1>
          
          <p className="hero-subtitle">
            Discover personalized habit recommendations powered by AI. Track progress, 
            earn rewards, and build lasting routines that stick.
          </p>

          <div className="hero-actions">
            <Link href="/signup" className="btn btn-primary btn-large">
              Start Your Journey
            </Link>
            <Link href="/login" className="btn btn-outline btn-large">
              Sign In
            </Link>
          </div>

          <div className="hero-features">
            <div className="flex gap-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Free to start</span>
            </div>
            <div className="flex gap-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>AI-powered insights</span>
            </div>
            <div className="flex gap-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Track unlimited habits</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-3">
            <div className="card feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </div>
              <h3 className="feature-title">Smart Recommendations</h3>
              <p className="feature-description">
                AI analyzes your lifestyle and suggests personalized habits that fit seamlessly into your routine
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 className="feature-title">Progress Tracking</h3>
              <p className="feature-description">
                Visual insights into your habit streaks, completion rates, and overall growth journey
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
              <h3 className="feature-title">Gamification & Rewards</h3>
              <p className="feature-description">
                Earn points, unlock badges, and level up as you build consistency and achieve milestones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="container">
          <div className="stats">
            <div className="stats-grid">
              <div>
                <div className="stat-value">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div>
                <div className="stat-value">50K+</div>
                <div className="stat-label">Habits Tracked</div>
              </div>
              <div>
                <div className="stat-value">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container">
          <div className="card" style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <div className="card-header text-center">
              <h2 className="card-title">Ready to Transform Your Life?</h2>
              <p className="card-description">
                Join thousands of people who are building better habits and achieving 
                their goals with HabitFlow.
              </p>
            </div>
            <div className="card-content text-center">
              <Link href="/signup" className="btn btn-primary btn-large">
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo"></div>
            <span className="footer-text">HabitFlow</span>
          </div>
          <div className="footer-text">
            © 2025 HabitFlow. Building better habits, one day at a time.
          </div>
        </div>
      </footer>
    </>
  );
}