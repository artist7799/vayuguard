const { PrismaClient } = require('@prisma/client');
const { getAqiCategory } = require('../src/utils/aqi');

const prisma = new PrismaClient();

const LOCATIONS = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'London', lat: 51.5074, lng: -0.1278 }
];

async function main() {
  console.log('🌱 Starting VayuGuard Air Quality Database Seeding...');

  // Optional cleanup of old seed data
  await prisma.airQualityReading.deleteMany({});
  console.log('Cleared existing AirQualityReading table.');

  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const seedReadings = [];

  // Generate 24 hourly readings for each location over the past day
  for (const loc of LOCATIONS) {
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now - i * ONE_HOUR);

      // Base variance depending on location
      let baseAqi = 40;
      if (loc.name === 'New Delhi') baseAqi = 180;
      if (loc.name === 'Los Angeles') baseAqi = 85;
      if (loc.name === 'Tokyo') baseAqi = 30;
      if (loc.name === 'London') baseAqi = 45;

      const randomDelta = Math.floor(Math.sin(i) * 20 + (Math.random() * 10 - 5));
      const aqi = Math.max(12, baseAqi + randomDelta);
      const pm25 = parseFloat((aqi * 0.4 + Math.random() * 5).toFixed(1));
      const pm10 = parseFloat((pm25 * 1.8 + Math.random() * 10).toFixed(1));
      const co = parseFloat((0.4 + Math.random() * 0.5).toFixed(2));
      const no2 = parseFloat((15 + Math.random() * 25).toFixed(1));
      const so2 = parseFloat((5 + Math.random() * 10).toFixed(1));
      const o3 = parseFloat((20 + Math.random() * 30).toFixed(1));
      const temperature = parseFloat((18 + Math.sin(i) * 5 + Math.random() * 2).toFixed(1));
      const humidity = parseFloat((50 + Math.cos(i) * 15 + Math.random() * 5).toFixed(1));

      seedReadings.push({
        location: loc.name,
        latitude: loc.lat,
        longitude: loc.lng,
        pm25,
        pm10,
        co,
        no2,
        so2,
        o3,
        aqi,
        aqiCategory: getAqiCategory(aqi),
        temperature,
        humidity,
        recordedAt: timestamp,
      });
    }
  }

  await prisma.airQualityReading.createMany({
    data: seedReadings,
  });

  console.log(`✅ Successfully seeded ${seedReadings.length} Air Quality Readings across ${LOCATIONS.length} locations.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
