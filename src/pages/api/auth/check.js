import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.cookies.token;

  console.log('Token:', token); // Debugging: Log the token

  if (!token) {
    console.log('No token found.'); // Debugging: Log if no token is found
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token is valid:', decoded); // Debugging: Log if the token is valid
    return res.status(200).json({ message: 'Authenticated' });
  } catch (err) {
    console.error('Token verification failed:', err); // Debugging: Log verification failure
    return res.status(401).json({ message: 'Not authenticated' });
  }
}
