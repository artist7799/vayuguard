/**
 * AQI Utility Functions
 * Isolated logic for AQI categorization and health advisories.
 */

/**
 * Converts a numeric AQI value into its standard EPA category.
 * @param {number} aqi - Air Quality Index integer value
 * @returns {string} AQI Category Name
 */
function getAqiCategory(aqi) {
  const numericAqi = Math.round(Number(aqi));

  if (isNaN(numericAqi) || numericAqi < 0) {
    return 'Unknown';
  }

  if (numericAqi <= 50) {
    return 'Good';
  } else if (numericAqi <= 100) {
    return 'Moderate';
  } else if (numericAqi <= 150) {
    return 'Unhealthy for Sensitive Groups';
  } else if (numericAqi <= 200) {
    return 'Unhealthy';
  } else if (numericAqi <= 300) {
    return 'Very Unhealthy';
  } else {
    return 'Hazardous';
  }
}

module.exports = {
  getAqiCategory,
};
