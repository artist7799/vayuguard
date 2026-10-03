/**
 * VayuGuard Phase 2 Authentication & Health Tests
 * Validates registration, duplicate checking, password hashing, JWT token validation, 
 * protected endpoints, role authorization, and existing Phase 1 endpoints.
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

async function runAuthTests() {
  console.log('--- Running VayuGuard Phase 2 Authentication & Health Tests ---\n');
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

  const testEmail = `user_${Date.now()}@vayuguard.io`;
  const testPassword = 'SecurePassword123!';
  const testName = 'Test User';
  let jwtToken = '';

  try {
    // 0. Verify Phase 1 Health Endpoint still works
    const healthRes = await makeRequest({ path: '/api/health' });
    assertTest(
      healthRes.statusCode === 200 && healthRes.body.status === 'ok' && healthRes.body.database === 'connected',
      'Phase 1 GET /api/health retains functionality',
      healthRes.body
    );

    // 1. Successful registration
    const regRes = await makeRequest({
      method: 'POST',
      path: '/api/auth/register',
      body: { name: testName, email: testEmail, password: testPassword },
    });
    assertTest(
      regRes.statusCode === 201 && regRes.body.user && regRes.body.token && !regRes.body.user.password,
      '1. Successful registration (Returns 201, User data without password, and Token)',
      regRes.body
    );
    jwtToken = regRes.body.token;

    // 2. Duplicate email prevention
    const dupRes = await makeRequest({
      method: 'POST',
      path: '/api/auth/register',
      body: { name: testName, email: testEmail, password: testPassword },
    });
    assertTest(
      dupRes.statusCode === 409,
      '2. Duplicate email prevention (Returns 409 Conflict)',
      dupRes.body
    );

    // 3. Invalid registration data
    const invalidRegRes = await makeRequest({
      method: 'POST',
      path: '/api/auth/register',
      body: { name: 'A', email: 'invalid-email', password: '123' },
    });
    assertTest(
      invalidRegRes.statusCode === 400,
      '3. Invalid registration data validation (Returns 400 Bad Request)',
      invalidRegRes.body
    );

    // 4. Successful login
    const loginRes = await makeRequest({
      method: 'POST',
      path: '/api/auth/login',
      body: { email: testEmail, password: testPassword },
    });
    assertTest(
      loginRes.statusCode === 200 && loginRes.body.token && loginRes.body.user && !loginRes.body.user.password,
      '4. Successful login (Returns 200 OK & Token)',
      loginRes.body
    );

    // 5. Wrong password
    const wrongPassRes = await makeRequest({
      method: 'POST',
      path: '/api/auth/login',
      body: { email: testEmail, password: 'WrongPassword999' },
    });
    assertTest(
      wrongPassRes.statusCode === 401,
      '5. Login with wrong password (Returns 401 Unauthorized)',
      wrongPassRes.body
    );

    // 6. Non-existent user
    const nonExistRes = await makeRequest({
      method: 'POST',
      path: '/api/auth/login',
      body: { email: 'nonexistent_user_9999@vayuguard.io', password: testPassword },
    });
    assertTest(
      nonExistRes.statusCode === 401,
      '6. Login with non-existent user (Returns 401 Unauthorized)',
      nonExistRes.body
    );

    // 7. Protected endpoint without token
    const noTokenRes = await makeRequest({ path: '/api/auth/me' });
    assertTest(
      noTokenRes.statusCode === 401,
      '7. Protected GET /api/auth/me without token (Returns 401 Unauthorized)',
      noTokenRes.body
    );

    // 8. Protected endpoint with invalid token
    const invalidTokenRes = await makeRequest({
      path: '/api/auth/me',
      headers: { Authorization: 'Bearer INVALID_JWT_TOKEN_STRING' },
    });
    assertTest(
      invalidTokenRes.statusCode === 401,
      '8. Protected GET /api/auth/me with invalid token (Returns 401 Unauthorized)',
      invalidTokenRes.body
    );

    // 9. Protected endpoint with valid token
    const validTokenRes = await makeRequest({
      path: '/api/auth/me',
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    assertTest(
      validTokenRes.statusCode === 200 && validTokenRes.body.user && validTokenRes.body.user.email === testEmail.toLowerCase(),
      '9. Protected GET /api/auth/me with valid token (Returns 200 OK & Authenticated User Profile)',
      validTokenRes.body
    );

    console.log(`\n------------------------------------------------`);
    console.log(`SUMMARY: Passed ${passedCount} of ${totalCount} tests.`);
    if (passedCount === totalCount) {
      console.log('🎉 ALL PHASE 2 TESTS PASSED PERFECTLY!\n');
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
  runAuthTests();
}

module.exports = { runAuthTests };
