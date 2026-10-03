require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
  console.log(`[VayuGuard Backend] Server running on http://localhost:${PORT}`);
  console.log(`[VayuGuard Backend] Health Check: http://localhost:${PORT}/api/health`);
});
