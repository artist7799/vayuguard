import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LocationSelector from '../components/LocationSelector';
import AQICard from '../components/AQICard';
import PollutantCard from '../components/PollutantCard';
import EnvironmentalCard from '../components/EnvironmentalCard';
import StatCard from '../components/StatCard';
import AQIHistoryChart from '../components/AQIHistoryChart';
import PollutantChart from '../components/PollutantChart';
import ProfileCard from '../components/ProfileCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { getCurrentAirQuality, getAirQualityHistory, getAirQualitySummary } from '../services/api';

// Auto-refresh interval constant (5 minutes)
const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState('New Delhi');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [currentReading, setCurrentReading] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  // Fetch telemetry data for selected location
  const fetchDashboardData = useCallback(async (location, isSilentRefresh = false) => {
    if (!isSilentRefresh) setIsLoading(true);
    else setIsRefreshing(true);

    setError(null);

    try {
      const [currentRes, historyRes, summaryRes] = await Promise.all([
        getCurrentAirQuality(location).catch(() => ({ reading: null })),
        getAirQualityHistory(location, null, 50).catch(() => ({ readings: [] })),
        getAirQualitySummary(location).catch(() => ({ summary: null })),
      ]);

      if (isMountedRef.current) {
        setCurrentReading(currentRes?.reading || null);
        setHistoryData(historyRes?.readings || []);
        setSummaryData(summaryRes?.summary || null);
      }
    } catch (err) {
      console.error('Failed to retrieve telemetry data:', err);
      if (isMountedRef.current) {
        setError(err.message || 'Unable to load air-quality data. Please check backend connection.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  // Effect for initial load and location changes
  useEffect(() => {
    isMountedRef.current = true;
    fetchDashboardData(selectedLocation);

    return () => {
      isMountedRef.current = false;
    };
  }, [selectedLocation, fetchDashboardData]);

  // Effect for 5-minute auto-refresh polling
  useEffect(() => {
    const timer = setInterval(() => {
      fetchDashboardData(selectedLocation, true);
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, [selectedLocation, fetchDashboardData]);

  const handleLocationChange = (newLocation) => {
    if (newLocation !== selectedLocation) {
      setSelectedLocation(newLocation);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(selectedLocation, true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const hasData = currentReading || (historyData && historyData.length > 0) || summaryData;

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <Navbar
        currentLocation={selectedLocation}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Main Layout Container */}
      <div className="dashboard-container">
        {/* Sidebar */}
        <Sidebar
          selectedLocation={selectedLocation}
          onSelectLocation={handleLocationChange}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={closeMobileMenu}
        />

        {/* Main Workspace Panel */}
        <main className="dashboard-main">
          {activeTab === 'profile' ? (
            <ProfileCard />
          ) : isLoading ? (
            <Loading message={`Fetching live telemetry metrics for ${selectedLocation}...`} />
          ) : error ? (
            <ErrorMessage message={error} onRetry={handleRefresh} />
          ) : !hasData ? (
            <EmptyState
              message={`No air-quality readings available for station: ${selectedLocation}`}
              onRefresh={handleRefresh}
            />
          ) : (
            <div className="dashboard-content">
              {/* Location Selector Component */}
              <LocationSelector
                selectedLocation={selectedLocation}
                onSelectLocation={handleLocationChange}
              />

              {/* Main AQI Overview Card */}
              <div id="air-quality-section" className="dashboard-top-grid">
                <AQICard reading={currentReading} />
              </div>

              {/* Pollutant Breakdown Cards */}
              <PollutantCard reading={currentReading} />

              {/* Environmental Metrics Card */}
              <EnvironmentalCard reading={currentReading} />

              {/* Station Statistics */}
              <StatCard summary={summaryData} />

              {/* Telemetry Charts */}
              <div id="history-section" className="charts-grid">
                <AQIHistoryChart history={historyData} isLoading={isRefreshing} />
                <PollutantChart history={historyData} isLoading={isRefreshing} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
