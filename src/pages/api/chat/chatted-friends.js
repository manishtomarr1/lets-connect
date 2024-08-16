// pages/api/chatted-friends.js
import connectMongo from '../../../../lib/mongodb';
import ChatMessage from '../../../models/ChatMessage';
import User from '../../../models/User';

export default async function handler(req, res) {
  await connectMongo();

  const { userId } = req.query;

  try {
    // Find the unique users the current user has chatted with
    const messages = await ChatMessage.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).exec();

    // Use a Set to keep unique friend IDs
    const friendIds = new Set();

    messages.forEach(message => {
      if (message.sender.toString() !== userId) {
        friendIds.add(message.sender);
      }
      if (message.receiver.toString() !== userId) {
        friendIds.add(message.receiver);
      }
    });

    // Convert Set to array and find user details
    const friends = await User.find({ _id: { $in: Array.from(friendIds) } }, 'username').exec();

    res.status(200).json(friends);
  } catch (error) {
    console.error('Error fetching chatted friends:', error);
    res.status(500).json({ message: 'Error fetching chatted friends' });
  }
}
