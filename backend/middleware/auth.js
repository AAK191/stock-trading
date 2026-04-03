const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, tokenFromHeader] = authHeader.split(' '); // ← renamed to tokenFromHeader
  const tokenFromCookie = req.cookies?.access_token;

  const token = scheme === 'Bearer' && tokenFromHeader ? tokenFromHeader : tokenFromCookie; // ← no redeclaration now

  if (!token) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = auth;