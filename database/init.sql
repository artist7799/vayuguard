-- VayuGuard PostgreSQL Database Initialization Script

CREATE DATABASE vayuguard_db;

\c vayuguard_db;

-- Initial tables definition placeholder for direct SQL initialization if needed
CREATE TABLE IF NOT EXISTS system_health (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'healthy',
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
