const airQualityService = require('../services/airQuality.service');

class AirQualityController {
  /**
   * POST /api/air-quality
   * Create a new environmental reading (Requires Authentication)
   */
  async create(req, res) {
    try {
      const {
        location,
        latitude,
        longitude,
        pm25,
        pm10,
        co,
        no2,
        so2,
        o3,
        aqi,
        temperature,
        humidity,
        recordedAt,
      } = req.body || {};

      // 1. Location Validation
      if (!location || typeof location !== 'string' || location.trim().length === 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Location is required and must be a non-empty string',
        });
      }

      // 2. Latitude Validation (-90 to 90)
      const numLat = Number(latitude);
      if (latitude === undefined || latitude === null || isNaN(numLat) || numLat < -90 || numLat > 90) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Latitude is required and must be a number between -90 and 90',
        });
      }

      // 3. Longitude Validation (-180 to 180)
      const numLng = Number(longitude);
      if (longitude === undefined || longitude === null || isNaN(numLng) || numLng < -180 || numLng > 180) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Longitude is required and must be a number between -180 and 180',
        });
      }

      // 4. Pollutants Validation (non-negative numbers)
      const numPm25 = Number(pm25);
      if (pm25 === undefined || pm25 === null || isNaN(numPm25) || numPm25 < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'pm25 is required and must be a non-negative number',
        });
      }

      const numPm10 = Number(pm10);
      if (pm10 === undefined || pm10 === null || isNaN(numPm10) || numPm10 < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'pm10 is required and must be a non-negative number',
        });
      }

      const numCo = Number(co);
      if (co === undefined || co === null || isNaN(numCo) || numCo < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'co is required and must be a non-negative number',
        });
      }

      const numNo2 = Number(no2);
      if (no2 === undefined || no2 === null || isNaN(numNo2) || numNo2 < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'no2 is required and must be a non-negative number',
        });
      }

      const numSo2 = Number(so2);
      if (so2 === undefined || so2 === null || isNaN(numSo2) || numSo2 < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'so2 is required and must be a non-negative number',
        });
      }

      const numO3 = Number(o3);
      if (o3 === undefined || o3 === null || isNaN(numO3) || numO3 < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'o3 is required and must be a non-negative number',
        });
      }

      // 5. AQI Validation (non-negative integer)
      const numAqi = Number(aqi);
      if (aqi === undefined || aqi === null || isNaN(numAqi) || numAqi < 0 || !Number.isInteger(numAqi)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'aqi is required and must be a non-negative integer',
        });
      }

      // 6. Weather metrics Validation (temperature & humidity)
      const numTemp = Number(temperature);
      if (temperature === undefined || temperature === null || isNaN(numTemp) || numTemp < -100 || numTemp > 100) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'temperature is required and must be a number between -100 and 100',
        });
      }

      const numHum = Number(humidity);
      if (humidity === undefined || humidity === null || isNaN(numHum) || numHum < 0 || numHum > 100) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'humidity is required and must be a percentage number between 0 and 100',
        });
      }

      // 7. RecordedAt validation
      if (recordedAt && isNaN(Date.parse(recordedAt))) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'recordedAt must be a valid ISO date timestamp',
        });
      }

      const newReading = await airQualityService.createReading({
        location,
        latitude: numLat,
        longitude: numLng,
        pm25: numPm25,
        pm10: numPm10,
        co: numCo,
        no2: numNo2,
        so2: numSo2,
        o3: numO3,
        aqi: numAqi,
        temperature: numTemp,
        humidity: numHum,
        recordedAt,
      });

      return res.status(201).json({
        message: 'Air quality reading created successfully',
        reading: newReading,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message || 'Failed to create air quality reading',
      });
    }
  }

  /**
   * GET /api/air-quality/current
   */
  async getCurrent(req, res) {
    try {
      const { location } = req.query;
      const reading = await airQualityService.getCurrentReading(location);

      if (!reading) {
        return res.status(404).json({
          error: 'Not Found',
          message: location ? `No readings found for location: ${location}` : 'No air quality readings available',
        });
      }

      return res.status(200).json({
        reading,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve current air quality reading',
      });
    }
  }

  /**
   * GET /api/air-quality/history
   */
  async getHistory(req, res) {
    try {
      const { location, limit, offset, startDate, endDate } = req.query;
      const result = await airQualityService.getHistory({ location, limit, offset, startDate, endDate });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve historical readings',
      });
    }
  }

  /**
   * GET /api/air-quality/summary
   */
  async getSummary(req, res) {
    try {
      const { location } = req.query;
      const summary = await airQualityService.getSummary(location);

      return res.status(200).json({
        summary,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve air quality summary',
      });
    }
  }

  /**
   * GET /api/air-quality/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const reading = await airQualityService.getReadingById(id);

      if (!reading) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Air quality reading with ID '${id}' not found`,
        });
      }

      return res.status(200).json({
        reading,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve reading',
      });
    }
  }
}

module.exports = new AirQualityController();
