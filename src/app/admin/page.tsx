// app/admin/page.tsx - Admin Panel with CSS Classes
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  role: string;
  total_points: number;
  level: number;
  created_at: string;
  is_active: boolean;
}

interface Analytics {
  total_users: number;
  total_habits: number;
  total_checkins: number;
  active_users_last_7_days: number;
  average_habits_per_user: number;
}

interface AdminInvite {
  id: number;
  email: string;
  is_used: boolean;
  expires_at: string;
  created_at: string;
  used_at: string | null;
}

export default function AdminPanel() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'invites'>('overview');
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const user = await response.json();
      
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        router.push('/dashboard');
        return;
      }

      setCurrentUser(user);
      loadAdminData();
    } catch (error) {
      console.error('Failed to check admin access:', error);
      router.push('/login');
    }
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      const analyticsRes = await fetch(`${API_URL}/admin/analytics`, {
        credentials: 'include',
      });
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      const usersRes = await fetch(`${API_URL}/admin/users`, {
        credentials: 'include',
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (currentUser?.role === 'super_admin') {
        const invitesRes = await fetch(`${API_URL}/admin/invites`, {
          credentials: 'include',
        });
        if (invitesRes.ok) {
          const invitesData = await invitesRes.json();
          setInvites(invitesData);
        }
      }

    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/admin/invite`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          admin_creation_secret: adminSecret,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Invitation sent to ${inviteEmail}` });
        setInviteEmail('');
        setAdminSecret('');
        loadAdminData();
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to send invitation' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send invitation' });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRevokeInvite = async (inviteId: number) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/invites/${inviteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Invitation revoked' });
        loadAdminData();
      } else {
        setMessage({ type: 'error', text: 'Failed to revoke invitation' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to revoke invitation' });
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1 className="admin-title">Admin Panel</h1>
            <p className="admin-subtitle">
              {currentUser?.email} • {currentUser?.role}
            </p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="admin-back-btn">
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="admin-main">
        {message && (
          <div className={`admin-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          >
            Users ({users.length})
          </button>
          {currentUser?.role === 'super_admin' && (
            <button
              onClick={() => setActiveTab('invites')}
              className={`admin-tab ${activeTab === 'invites' ? 'active' : ''}`}
            >
              Admin Invites
            </button>
          )}
        </div>

        {activeTab === 'overview' && analytics && (
          <div className="admin-analytics-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-card-content">
                <div className="admin-stat-icon violet">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="admin-stat-label">Total Users</p>
                  <p className="admin-stat-value">{analytics.total_users}</p>
                </div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-card-content">
                <div className="admin-stat-icon indigo">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="admin-stat-label">Total Habits</p>
                  <p className="admin-stat-value">{analytics.total_habits}</p>
                </div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-card-content">
                <div className="admin-stat-icon green">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="admin-stat-label">Total Check-ins</p>
                  <p className="admin-stat-value">{analytics.total_checkins}</p>
                </div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-card-content">
                <div className="admin-stat-icon pink">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="admin-stat-label">Active Users (7d)</p>
                  <p className="admin-stat-value">{analytics.active_users_last_7_days}</p>
                </div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-card-content">
                <div className="admin-stat-icon purple">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="admin-stat-label">Avg Habits/User</p>
                  <p className="admin-stat-value">{analytics.average_habits_per_user.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Level</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>
                      <span className={`admin-role-badge ${
                        user.role === 'super_admin' ? 'super-admin' :
                        user.role === 'admin' ? 'admin' : 'user'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.level}</td>
                    <td>{user.total_points}</td>
                    <td>
                      <span className={`admin-status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'invites' && currentUser?.role === 'super_admin' && (
          <div>
            <div className="admin-invite-form">
              <h2>Invite New Admin</h2>
              <form onSubmit={handleInviteAdmin}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="admin-form-input"
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Admin Creation Secret</label>
                  <input
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    required
                    className="admin-form-input"
                    placeholder="Enter admin secret"
                  />
                </div>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="admin-form-submit"
                >
                  {inviteLoading ? 'Sending...' : 'Send Invitation'}
                </button>
              </form>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Expires</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id}>
                      <td>{invite.email}</td>
                      <td>
                        <span className={`admin-status-badge ${
                          invite.is_used ? 'used' :
                          new Date(invite.expires_at) < new Date() ? 'expired' : 'pending'
                        }`}>
                          {invite.is_used ? 'Used' : 
                           new Date(invite.expires_at) < new Date() ? 'Expired' : 'Pending'}
                        </span>
                      </td>
                      <td>{new Date(invite.created_at).toLocaleDateString()}</td>
                      <td>{new Date(invite.expires_at).toLocaleDateString()}</td>
                      <td>
                        {!invite.is_used && new Date(invite.expires_at) > new Date() && (
                          <button
                            onClick={() => handleRevokeInvite(invite.id)}
                            className="admin-action-btn"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}