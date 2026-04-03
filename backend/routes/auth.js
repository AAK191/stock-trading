const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UsersModel } = require('../model/UsersModel');
const RefreshToken = require('../model/refreshToken');
const auth = require('../middleware/auth'); // make sure this exists


const {
  createJti,
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  setRefreshCookie
} = require('../utils/tokens');

const router = express.Router();
const { hashToken, rotateRefreshToken } = require('../utils/tokens');

router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const tokenHash = hashToken(token);
    const doc = await RefreshToken.findOne({ tokenHash, jti: decoded.jti }).populate('user');

    if (!doc) {
      return res.status(401).json({ message: 'Refresh token not recognized' });
    }
    if (doc.revokedAt) {
      return res.status(401).json({ message: 'Refresh token revoked' });
    }
    if (doc.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    const result = await rotateRefreshToken(doc, doc.user, req, res);
    return res.json({ accessToken: result.accessToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken(user);

    const jti = createJti();
    const refreshToken = signRefreshToken(user, jti);

    await persistRefreshToken({
      user,
      refreshToken,
      jti,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || ''
    });

    setRefreshCookie(res, refreshToken);

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (token) {
      const tokenHash = hashToken(token);
      const doc = await RefreshToken.findOne({ tokenHash });
      if (doc && !doc.revokedAt) {
        doc.revokedAt = new Date();
        await doc.save();
      }
    }
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existing = await UsersModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save user
    const user = await UsersModel.create({ name, email, password: hashedPassword });

    // 4. Issue tokens (same as login)
    const accessToken = signAccessToken(user);
    const jti = createJti();
    const refreshToken = signRefreshToken(user, jti);

    await persistRefreshToken({
      user,
      refreshToken,
      jti,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || ''
    });

    setRefreshCookie(res, refreshToken);
    res.status(201).json({ accessToken });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/delete', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔥 Delete user
    await UsersModel.findByIdAndDelete(userId);

    // 🔥 Delete all refresh tokens of user
    await RefreshToken.deleteMany({ user: userId });

    // 🔥 Clear cookie
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });

    res.json({ message: 'Account deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;