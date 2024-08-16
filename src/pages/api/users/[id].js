import connectMongo from '../../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  await connectMongo();

  const { id } = req.query;

  try {
    // Fetch the user by ID and select only the username field
    const user = await User.findById(id).select('username');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's username
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
}
