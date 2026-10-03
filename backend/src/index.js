require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;

const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`[VayuGuard Backend] Server running on http://${HOST}:${PORT}`);
  console.log(`[VayuGuard Backend] Health Check: http://${HOST}:${PORT}/api/health`);
});
