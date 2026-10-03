import React from 'react';
import { User, Mail, Shield, Calendar, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileCard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const formattedCreatedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="profile-section-card">
      <div className="profile-card-header">
        <div className="profile-avatar-large">
          <User size={36} />
        </div>
        <div>
          <h2>User Profile Details</h2>
          <p>Authenticated VayuGuard Security Profile</p>
        </div>
      </div>

      <div className="profile-details-grid">
        <div className="profile-detail-item">
          <div className="profile-detail-icon emerald-bg">
            <User size={20} className="icon-emerald" />
          </div>
          <div>
            <span className="profile-detail-label">Full Name</span>
            <span className="profile-detail-val">{user.name || 'N/A'}</span>
          </div>
        </div>

        <div className="profile-detail-item">
          <div className="profile-detail-icon blue-bg">
            <Mail size={20} className="icon-blue" />
          </div>
          <div>
            <span className="profile-detail-label">Email Address</span>
            <span className="profile-detail-val">{user.email || 'N/A'}</span>
          </div>
        </div>

        <div className="profile-detail-item">
          <div className="profile-detail-icon purple-bg">
            <Shield size={20} className="icon-purple" />
          </div>
          <div>
            <span className="profile-detail-label">Assigned Role</span>
            <span className="profile-detail-val role-badge">{user.role || 'USER'}</span>
          </div>
        </div>

        <div className="profile-detail-item">
          <div className="profile-detail-icon amber-bg">
            <Calendar size={20} className="icon-amber" />
          </div>
          <div>
            <span className="profile-detail-label">Account Creation Date</span>
            <span className="profile-detail-val">{formattedCreatedDate}</span>
          </div>
        </div>
      </div>

      <div className="profile-security-note">
        <KeyRound size={16} className="icon-emerald" />
        <span>JWT session token stored in local browser storage (`vayuguard_token`). Password protected by bcrypt hash.</span>
      </div>
    </div>
  );
}
