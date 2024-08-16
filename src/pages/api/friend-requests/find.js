import connectMongo from '../../../../lib/mongodb';
import FriendRequest from '../../../models/FriendRequest';

export default async function handler(req, res) {
  await connectMongo();

  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: 'Sender and receiver are required' });
  }

  try {
    // Find the friend request based on senderId and receiverId
    const friendRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    res.status(200).json({ requestId: friendRequest._id });
  } catch (error) {
    console.error('Error finding friend request:', error);
    res.status(500).json({ message: 'Error finding friend request' });
  }
}
