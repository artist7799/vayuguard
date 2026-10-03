/**
 * VayuGuard End-to-End Health Checks
 * Validates backend API health and ML service health endpoints.
 */

const http = require('http');

function checkEndpoint(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', err => reject(err));
  });
}

async function runHealthCheckTests() {
  console.log('--- Running VayuGuard Service Health Tests ---');
  let passed = true;

  try {
    const backendHealth = await checkEndpoint('http://localhost:5000/api/health');
    console.log('✅ Backend API Health (/api/health): PASSED', backendHealth);
  } catch (err) {
    console.error('❌ Backend API Health Test Failed:', err.message);
    passed = false;
  }

  try {
    const mlHealth = await checkEndpoint('http://localhost:8001/health');
    console.log('✅ ML Service Health (/health): PASSED', mlHealth);
  } catch (err) {
    console.error('❌ ML Service Health Test Failed:', err.message);
    passed = false;
  }

  if (passed) {
    console.log('\n🎉 ALL HEALTH CHECKS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('\n⚠️ SOME HEALTH CHECKS FAILED');
    process.exit(1);
  }
}

if (require.main === module) {
  runHealthCheckTests();
}

module.exports = { checkEndpoint, runHealthCheckTests };
