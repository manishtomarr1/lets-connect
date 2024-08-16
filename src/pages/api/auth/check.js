// pages/api/auth/check.js

import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: 'Authenticated' });
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Not authenticated' });
  }
}
