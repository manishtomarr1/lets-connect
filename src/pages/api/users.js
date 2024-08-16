// pages/api/users.js
import connectMongo from '../../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  await connectMongo(); // Ensure the database is connected

  if (req.method === 'GET') {
    try {
      const users = await User.find({}, { password: 0 }); // Fetch users without their passwords
      res.status(200).json(users); // Return the users in the response
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' }); // Handle non-GET requests
  }
}
