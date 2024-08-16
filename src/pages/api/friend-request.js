import connectMongo from '../../../lib/mongodb';
import FriendRequest from '../../models/FriendRequest';

export default async function handler(req, res) {
  await connectMongo(); // Ensure the database is connected

  if (req.method === 'POST') {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'Sender and receiver are required' });
    }

    try {
      // Check if a request already exists
      const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
      if (existingRequest) {
        return res.status(400).json({ message: 'Friend request already sent' });
      }

      // Create a new friend request
      const friendRequest = new FriendRequest({ sender: senderId, receiver: receiverId });
      await friendRequest.save();

      res.status(201).json({ message: 'Friend request sent successfully', friendRequest });
    } catch (error) {
      console.error('Error sending friend request:', error);
      res.status(500).json({ message: 'Error sending friend request' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' }); // Handle non-POST requests
  }
}
