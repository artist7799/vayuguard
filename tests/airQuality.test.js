/**
 * VayuGuard Phase 3 End-to-End Air Quality & System Tests
 * Validates:
 * 1. Authenticated POST /api/air-quality
 * 2. Unauthenticated POST rejection
 * 3. Invalid AQI rejection
 * 4. Invalid environmental data rejection
 * 5. GET current reading
 * 6. GET history
 * 7. GET reading by ID
 * 8. GET summary
 * 9. Location filtering
 * 10. Database persistence
 * 11. Phase 1 /api/health
 * 12. Phase 2 authentication (Register & Login)
 * 13. Phase 2 /api/auth/me
 */

const http = require('http');

function makeRequest({ method = 'GET', path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:5000${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(responseBody);
        } catch (e) {
          parsed = responseBody;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: parsed,
        });
      });
    });

    req.on('error', err => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runPhase3Tests() {
  console.log('--- Running VayuGuard Phase 3 Air Quality & System Integration Tests ---\n');
  let passedCount = 0;
  let totalCount = 0;

  function assertTest(condition, testName, details = '') {
    totalCount++;
    if (condition) {
      passedCount++;
      console.log(`✅ [TEST ${totalCount}] PASSED: ${testName}`);
    } else {
      console.error(`❌ [TEST ${totalCount}] FAILED: ${testName}`, details);
    }
  }

  const testEmail = `aqi_tester_${Date.now()}@vayuguard.io`;
  const testPassword = 'SecurePassword123!';
  let jwtToken = '';
  let createdReadingId = '';

  try {
    // 11. Phase 1 /api/health check
    const healthRes = await makeRequest({ path: '/api/health' });
    assertTest(
      healthRes.statusCode === 200 && healthRes.body.status === 'ok' && healthRes.body.database === 'connected',
      'Phase 1 GET /api/health is fully functional',
      healthRes.body
    );

    // 12. Phase 2 authentication (Register & Login)
    const regRes = await makeRequest({
      method: 'POST',
      path: '/api/auth/register',
      body: { name: 'AQI Inspector', email: testEmail, password: testPassword },
    });
    assertTest(
      regRes.statusCode === 201 && regRes.body.token,
      'Phase 2 Registration works',
      regRes.body
    );
    jwtToken = regRes.body.token;

    const loginRes = await makeRequest({
      method: 'POST',
      path: '/api/auth/login',
      body: { email: testEmail, password: testPassword },
    });
    assertTest(
      loginRes.statusCode === 200 && loginRes.body.token,
      'Phase 2 Login works',
      loginRes.body
    );

    // 13. Phase 2 /api/auth/me
    const meRes = await makeRequest({
      path: '/api/auth/me',
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    assertTest(
      meRes.statusCode === 200 && meRes.body.user && meRes.body.user.email === testEmail.toLowerCase(),
      'Phase 2 GET /api/auth/me works',
      meRes.body
    );

    // 1. Authenticated POST /api/air-quality
    const validPostData = {
      location: 'San Francisco',
      latitude: 37.7749,
      longitude: -122.4194,
      pm25: 14.5,
      pm10: 28.2,
      co: 0.4,
      no2: 12.1,
      so2: 3.5,
      o3: 25.0,
      aqi: 55,
      temperature: 21.5,
      humidity: 62.0,
    };

    const postRes = await makeRequest({
      method: 'POST',
      path: '/api/air-quality',
      headers: { Authorization: `Bearer ${jwtToken}` },
      body: validPostData,
    });

    assertTest(
      postRes.statusCode === 201 && postRes.body.reading && postRes.body.reading.id && postRes.body.reading.aqiCategory === 'Moderate',
      '1. Authenticated POST /api/air-quality creates reading with correct AQI category',
      postRes.body
    );
    if (postRes.body.reading) {
      createdReadingId = postRes.body.reading.id;
    }

    // 2. Unauthenticated POST rejection
    const unauthPostRes = await makeRequest({
      method: 'POST',
      path: '/api/air-quality',
      body: validPostData,
    });
    assertTest(
      unauthPostRes.statusCode === 401,
      '2. Unauthenticated POST /api/air-quality rejected with 401 Unauthorized',
      unauthPostRes.body
    );

    // 3. Invalid AQI rejection
    const invalidAqiRes = await makeRequest({
      method: 'POST',
      path: '/api/air-quality',
      headers: { Authorization: `Bearer ${jwtToken}` },
      body: { ...validPostData, aqi: -10 },
    });
    assertTest(
      invalidAqiRes.statusCode === 400,
      '3. Invalid AQI (-10) rejected with 400 Bad Request',
      invalidAqiRes.body
    );

    // 4. Invalid environmental data rejection
    const invalidEnvRes = await makeRequest({
      method: 'POST',
      path: '/api/air-quality',
      headers: { Authorization: `Bearer ${jwtToken}` },
      body: { ...validPostData, latitude: 195.0 }, // Invalid latitude
    });
    assertTest(
      invalidEnvRes.statusCode === 400,
      '4. Invalid environmental data (latitude > 90) rejected with 400 Bad Request',
      invalidEnvRes.body
    );

    // 5. GET current reading
    const currentRes = await makeRequest({ path: '/api/air-quality/current' });
    assertTest(
      currentRes.statusCode === 200 && currentRes.body.reading && currentRes.body.reading.location,
      '5. GET /api/air-quality/current returns latest reading',
      currentRes.body
    );

    // 6. GET history
    const historyRes = await makeRequest({ path: '/api/air-quality/history?limit=10' });
    assertTest(
      historyRes.statusCode === 200 && Array.isArray(historyRes.body.readings) && historyRes.body.readings.length > 0,
      '6. GET /api/air-quality/history returns readings list',
      historyRes.body
    );

    // 7. GET reading by ID
    const getByIdRes = await makeRequest({ path: `/api/air-quality/${createdReadingId}` });
    assertTest(
      getByIdRes.statusCode === 200 && getByIdRes.body.reading && getByIdRes.body.reading.id === createdReadingId,
      '7. GET /api/air-quality/:id returns specific reading',
      getByIdRes.body
    );

    // 8. GET summary
    const summaryRes = await makeRequest({ path: '/api/air-quality/summary' });
    assertTest(
      summaryRes.statusCode === 200 && summaryRes.body.summary && typeof summaryRes.body.summary.averageAqi === 'number' && summaryRes.body.summary.numberOfReadings > 0,
      '8. GET /api/air-quality/summary returns aggregate environmental statistics',
      summaryRes.body
    );

    // 9. Location filtering
    const locFilterRes = await makeRequest({ path: '/api/air-quality/current?location=San%20Francisco' });
    assertTest(
      locFilterRes.statusCode === 200 && locFilterRes.body.reading && locFilterRes.body.reading.location === 'San Francisco',
      '9. Location filtering (/api/air-quality/current?location=San Francisco) works correctly',
      locFilterRes.body
    );

    // 10. Database persistence
    const locHistoryRes = await makeRequest({ path: '/api/air-quality/history?location=San%20Francisco' });
    assertTest(
      locHistoryRes.statusCode === 200 && locHistoryRes.body.readings.some(r => r.id === createdReadingId),
      '10. Database persistence confirmed across requests',
      locHistoryRes.body
    );

    console.log(`\n------------------------------------------------`);
    console.log(`SUMMARY: Passed ${passedCount} of ${totalCount} tests.`);
    if (passedCount === totalCount) {
      console.log('🎉 ALL PHASE 3 TESTS PASSED PERFECTLY!\n');
      process.exit(0);
    } else {
      console.error('⚠️ SOME TESTS FAILED.\n');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Test Execution Exception:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runPhase3Tests();
}

module.exports = { runPhase3Tests };
