const { PrismaClient } = require('@prisma/client');
const { getAqiCategory } = require('../utils/aqi');

const prisma = new PrismaClient();

class AirQualityService {
  /**
   * Create a new Air Quality Reading
   */
  async createReading(data) {
    const aqiCategory = data.aqiCategory || getAqiCategory(data.aqi);

    const reading = await prisma.airQualityReading.create({
      data: {
        location: data.location.trim(),
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        pm25: parseFloat(data.pm25),
        pm10: parseFloat(data.pm10),
        co: parseFloat(data.co),
        no2: parseFloat(data.no2),
        so2: parseFloat(data.so2),
        o3: parseFloat(data.o3),
        aqi: parseInt(data.aqi, 10),
        aqiCategory,
        temperature: parseFloat(data.temperature),
        humidity: parseFloat(data.humidity),
        recordedAt: data.recordedAt ? new Date(data.recordedAt) : new Date(),
      },
    });

    return reading;
  }

  /**
   * Get latest/current reading for a location or overall
   */
  async getCurrentReading(location) {
    const where = {};
    if (location && typeof location === 'string' && location.trim().length > 0) {
      where.location = { equals: location.trim(), mode: 'insensitive' };
    }

    const latestReading = await prisma.airQualityReading.findFirst({
      where,
      orderBy: { recordedAt: 'desc' },
    });

    return latestReading;
  }

  /**
   * Get historical readings
   */
  async getHistory({ location, limit = 50, offset = 0, startDate, endDate }) {
    const where = {};

    if (location && typeof location === 'string' && location.trim().length > 0) {
      where.location = { equals: location.trim(), mode: 'insensitive' };
    }

    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt.gte = new Date(startDate);
      if (endDate) where.recordedAt.lte = new Date(endDate);
    }

    const take = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 500);
    const skip = Math.max(parseInt(offset, 10) || 0, 0);

    const [readings, total] = await Promise.all([
      prisma.airQualityReading.findMany({
        where,
        orderBy: { recordedAt: 'desc' },
        take,
        skip,
      }),
      prisma.airQualityReading.count({ where }),
    ]);

    return { readings, total, limit: take, offset: skip };
  }

  /**
   * Get single reading by ID
   */
  async getReadingById(id) {
    return prisma.airQualityReading.findUnique({
      where: { id },
    });
  }

  /**
   * Get summary metrics (current, avg, min, max AQI, avg PM2.5, avg PM10, count)
   */
  async getSummary(location) {
    const where = {};
    if (location && typeof location === 'string' && location.trim().length > 0) {
      where.location = { equals: location.trim(), mode: 'insensitive' };
    }

    const [aggregations, latestReading] = await Promise.all([
      prisma.airQualityReading.aggregate({
        where,
        _avg: {
          aqi: true,
          pm25: true,
          pm10: true,
        },
        _min: {
          aqi: true,
        },
        _max: {
          aqi: true,
        },
        _count: {
          id: true,
        },
      }),
      prisma.airQualityReading.findFirst({
        where,
        orderBy: { recordedAt: 'desc' },
      }),
    ]);

    const count = aggregations._count.id || 0;

    return {
      location: location ? location.trim() : 'All Locations',
      currentAqi: latestReading ? latestReading.aqi : null,
      currentCategory: latestReading ? latestReading.aqiCategory : null,
      averageAqi: count > 0 ? parseFloat(aggregations._avg.aqi.toFixed(2)) : 0,
      minimumAqi: count > 0 ? aggregations._min.aqi : 0,
      maximumAqi: count > 0 ? aggregations._max.aqi : 0,
      averagePm25: count > 0 ? parseFloat(aggregations._avg.pm25.toFixed(2)) : 0,
      averagePm10: count > 0 ? parseFloat(aggregations._avg.pm10.toFixed(2)) : 0,
      numberOfReadings: count,
    };
  }
}

module.exports = new AirQualityService();
