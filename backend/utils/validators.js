'use strict';

/**
 * Shared validation rules.
 * Keep in sync with frontend/js/validators.js
 */

/** Allows only letters, numbers and underscores */
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Requires: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char (@$!%*?&)
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

module.exports = { USERNAME_REGEX, PASSWORD_REGEX };
