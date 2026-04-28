/**
 * Shared validation rules — browser compatible (no require/module.exports).
 * Keep in sync with backend/utils/validators.js
 */

/** Allows only letters, numbers and underscores */
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Requires: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char (@$!%*?&)
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
