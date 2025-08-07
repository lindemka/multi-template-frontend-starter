#!/usr/bin/env node

const bcrypt = require('bcryptjs');

// The encoded password from database
const hashedPassword = '$2a$10$JIucSyRqD5ymVa7/QMH9x.BHSoWkWOQGzQWQdDjvu8Gfc6bcMYR5.';

// Test password
const plainPassword = 'password123';

// Verify the password
bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log(`Password '${plainPassword}' matches hash: ${result}`);
  }
});

// Also generate a new hash for verification
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log(`New hash for '${plainPassword}': ${hash}`);
  }
});