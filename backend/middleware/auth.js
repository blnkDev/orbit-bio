const jwt = require('jsonwebtoken');

/**
 * Auth middleware.
 * Reads the JWT from the HttpOnly cookie `access_token`.
 * Falls back to the Authorization header for API clients / Postman.
 * Returns 401 (not 400) for all auth failures.
 */
module.exports = (req, res, next) => {
  const cookieToken = req.cookies?.access_token;
  const headerToken = req.header('Authorization')?.replace('Bearer ', '');
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Faça login.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado. Faça login novamente.' });
  }
};
