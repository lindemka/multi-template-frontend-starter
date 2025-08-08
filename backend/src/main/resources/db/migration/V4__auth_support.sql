-- Auth support tables and columns

-- Users: add email_verified and google_id
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_google_id ON users(google_id);

-- Refresh tokens: rotation and revocation
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_id VARCHAR(64) NOT NULL UNIQUE,
    replaced_by_token_id VARCHAR(64),
    revoked BOOLEAN NOT NULL DEFAULT false,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(128) NOT NULL UNIQUE,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_email_verification_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_expires_at ON email_verification_tokens(expires_at);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(128) NOT NULL UNIQUE,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_expires_at ON password_reset_tokens(expires_at);

-- Email change requests
CREATE TABLE IF NOT EXISTS email_change_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    new_email VARCHAR(255) NOT NULL,
    token VARCHAR(128) NOT NULL UNIQUE,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_email_change_user_id ON email_change_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_email_change_new_email ON email_change_requests(new_email);


