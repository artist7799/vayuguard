const authService = require('../services/auth.service');

// Helper email regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body || {};

      // Validate inputs
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Name is required and must be at least 2 characters long',
        });
      }

      if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'A valid email address is required',
        });
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Password is required and must be at least 6 characters long',
        });
      }

      const result = await authService.registerUser({ name, email, password, role });

      return res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: statusCode === 409 ? 'Conflict' : 'Server Error',
        message: error.message || 'An unexpected error occurred during registration',
      });
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Email and password are required',
        });
      }

      const result = await authService.loginUser({ email, password });

      return res.status(200).json({
        message: 'Login successful',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: statusCode === 401 ? 'Unauthorized' : 'Server Error',
        message: error.message || 'An unexpected error occurred during login',
      });
    }
  }

  /**
   * GET /api/auth/me
   */
  async getMe(req, res) {
    try {
      return res.status(200).json({
        user: req.user,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve user profile',
      });
    }
  }
}

module.exports = new AuthController();
