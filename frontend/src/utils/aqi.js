/**
 * AQI Utility & Helper Functions for Frontend Visualization
 */

export function getAqiCategory(aqi) {
  const numericAqi = Math.round(Number(aqi));
  if (isNaN(numericAqi) || numericAqi < 0) return 'Unknown';
  if (numericAqi <= 50) return 'Good';
  if (numericAqi <= 100) return 'Moderate';
  if (numericAqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (numericAqi <= 200) return 'Unhealthy';
  if (numericAqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getAqiCategoryColor(category) {
  switch (category) {
    case 'Good':
      return '#10b981'; // Emerald Green
    case 'Moderate':
      return '#f59e0b'; // Amber / Yellow
    case 'Unhealthy for Sensitive Groups':
      return '#f97316'; // Orange
    case 'Unhealthy':
      return '#ef4444'; // Red
    case 'Very Unhealthy':
      return '#8b5cf6'; // Purple
    case 'Hazardous':
      return '#b91c1c'; // Dark Red
    default:
      return '#6b7280'; // Gray
  }
}

export function getAqiCategoryBg(category) {
  switch (category) {
    case 'Good':
      return 'rgba(16, 185, 129, 0.15)';
    case 'Moderate':
      return 'rgba(245, 158, 11, 0.15)';
    case 'Unhealthy for Sensitive Groups':
      return 'rgba(249, 115, 22, 0.15)';
    case 'Unhealthy':
      return 'rgba(239, 68, 68, 0.15)';
    case 'Very Unhealthy':
      return 'rgba(139, 92, 246, 0.15)';
    case 'Hazardous':
      return 'rgba(185, 28, 28, 0.2)';
    default:
      return 'rgba(107, 114, 128, 0.15)';
  }
}

export function getAqiDescription(category) {
  switch (category) {
    case 'Good':
      return 'Air quality is satisfactory, and air pollution poses little or no risk.';
    case 'Moderate':
      return 'Air quality is acceptable; however, some pollutants may pose moderate concern.';
    case 'Unhealthy for Sensitive Groups':
      return 'Members of sensitive groups may experience health effects. General public unlikely affected.';
    case 'Unhealthy':
      return 'Everyone may begin to experience health effects; sensitive groups may experience serious effects.';
    case 'Very Unhealthy':
      return 'Health alert: everyone may experience more serious health effects.';
    case 'Hazardous':
      return 'Health warning of emergency conditions. The entire population is likely affected.';
    default:
      return 'No air quality advisory available.';
  }
}

/**
 * Formats a timestamp into a human-readable relative time string (e.g., "10 minutes ago")
 */
export function getRelativeTime(timestamp) {
  if (!timestamp) return 'Recently';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
}
