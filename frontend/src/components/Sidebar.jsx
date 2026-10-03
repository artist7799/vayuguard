import React from 'react';
import { 
  LayoutDashboard, 
  Wind, 
  History, 
  User, 
  Globe, 
  MapPin, 
  Check, 
  BarChart2, 
  ShieldCheck 
} from 'lucide-react';
import { INITIAL_LOCATIONS } from './LocationSelector';

export default function Sidebar({ 
  selectedLocation, 
  onSelectLocation, 
  activeTab, 
  onSelectTab,
  isMobileMenuOpen,
  onCloseMobileMenu
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'air-quality', label: 'Air Quality', icon: Wind },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    if (onCloseMobileMenu) onCloseMobileMenu();

    // Scroll to appropriate section if on dashboard view
    if (tabId === 'air-quality') {
      const el = document.getElementById('air-quality-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tabId === 'history') {
      const el = document.getElementById('history-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLocationClick = (loc) => {
    onSelectLocation(loc);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      {/* Primary Navigation Menu */}
      <div className="sidebar-section">
        <h3 className="sidebar-heading">Navigation</h3>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Monitoring Locations Switcher */}
      <div className="sidebar-section">
        <h3 className="sidebar-heading">
          <Globe size={18} />
          <span>Monitoring Stations</span>
        </h3>
        <p className="sidebar-subtext">Select a station to filter telemetry:</p>

        <ul className="location-list">
          {INITIAL_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation === loc;
            return (
              <li key={loc}>
                <button
                  className={`location-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleLocationClick(loc)}
                >
                  <div className="location-item-left">
                    <MapPin size={16} className="loc-icon" />
                    <span>{loc}</span>
                  </div>
                  {isSelected && <Check size={16} className="check-icon" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer Info Card */}
      <div className="sidebar-footer-card">
        <ShieldCheck size={24} className="card-icon icon-emerald" />
        <h4>VayuGuard SaaS</h4>
        <p>Real-time telemetry continuous monitoring node connected.</p>
      </div>
    </aside>
  );
}
