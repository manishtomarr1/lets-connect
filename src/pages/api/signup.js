import connectMongo from '../../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connectMongo();

    const { username, email, password } = req.body;

    // Check if the user or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already registered' });
      } else if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
