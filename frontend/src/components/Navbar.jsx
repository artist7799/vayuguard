import React from 'react';
import { ShieldCheck, RefreshCw, User, LogOut, MapPin, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  currentLocation, 
  onRefresh, 
  isRefreshing, 
  isMobileMenuOpen, 
  onToggleMobileMenu 
}) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button 
          className="mobile-toggle-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="navbar-brand">
          <div className="navbar-logo">
            <ShieldCheck size={26} className="logo-icon" />
          </div>
          <div>
            <h1 className="navbar-title">VayuGuard</h1>
            <p className="navbar-subtitle">Environmental Monitoring Platform</p>
          </div>
        </div>
      </div>

      {currentLocation && (
        <div className="location-badge">
          <MapPin size={16} className="pin-icon" />
          <span>{currentLocation}</span>
        </div>
      )}

      <div className="navbar-actions">
        <button 
          className={`action-btn refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh telemetry data"
        >
          <RefreshCw size={18} />
          <span className="btn-text">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>

        {user ? (
          <div className="user-profile-menu">
            <div className="user-avatar" title={user.name}>
              <User size={18} />
            </div>
            <div className="user-info-text">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role || 'USER'}</span>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign Out">
              <LogOut size={16} />
              <span className="btn-text">Logout</span>
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
