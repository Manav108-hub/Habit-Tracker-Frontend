// app/dashboard/layout.tsx - Fixed Dashboard Layout
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: number;
  email: string;
  role: string;
  total_points: number;
  level: number;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #f8fafc, #e0e7ff, #e0e7ff)'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid #e0e7ff',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    );
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #f8fafc, #ede9fe, #dbeafe)',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: '256px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRight: '1px solid #e0e7ff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        zIndex: 40
      }}>
        {/* Brand */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #6366f1, #4f46e5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px'
          }}>
            HabitFlow
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Level {user?.level} • {user?.total_points} pts
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              ...(isActive('/dashboard') ? {
                background: 'linear-gradient(to right, #6366f1, #4f46e5)',
                color: 'white',
                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
              } : {
                color: '#374151'
              })
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span style={{ fontWeight: 500 }}>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/habits"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              ...(isActive('/dashboard/habits') ? {
                background: 'linear-gradient(to right, #6366f1, #4f46e5)',
                color: 'white',
                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
              } : {
                color: '#374151'
              })
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span style={{ fontWeight: 500 }}>My Habits</span>
          </Link>

          <Link
            href="/dashboard/progress"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              ...(isActive('/dashboard/progress') ? {
                background: 'linear-gradient(to right, #6366f1, #4f46e5)',
                color: 'white',
                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
              } : {
                color: '#374151'
              })
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span style={{ fontWeight: 500 }}>Progress</span>
          </Link>

          <Link
            href="/dashboard/recommendations"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              ...(isActive('/dashboard/recommendations') ? {
                background: 'linear-gradient(to right, #6366f1, #4f46e5)',
                color: 'white',
                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
              } : {
                color: '#374151'
              })
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span style={{ fontWeight: 500 }}>AI Recommendations</span>
          </Link>

          {/* Admin Link */}
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <>
              <div style={{ margin: '16px 0', borderTop: '1px solid #e5e7eb' }}></div>
              <Link
                href="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  border: '2px solid',
                  ...(pathname?.startsWith('/admin') ? {
                    background: 'linear-gradient(to right, #dc2626, #db2777)',
                    color: 'white',
                    borderColor: 'transparent',
                    boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.3)'
                  } : {
                    color: '#dc2626',
                    borderColor: '#fecaca',
                    background: 'transparent'
                  })
                }}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span style={{ fontWeight: 500 }}>Admin Panel</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Footer */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{
            background: 'linear-gradient(to right, #ede9fe, #dbeafe)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '12px'
          }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>
              {user?.email}
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
              {user?.role} Account
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#dc2626',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: '256px',
        padding: '32px',
        width: 'calc(100% - 256px)',
        minHeight: '100vh'
      }}>
        {children}
      </main>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}