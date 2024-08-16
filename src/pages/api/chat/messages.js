import connectMongo from '../../../../lib/mongodb';
import ChatMessage from '../../../models/ChatMessage';
// import User from '../../../models/User';

export default async function handler(req, res) {
  await connectMongo();

  const { userId, friendId } = req.query;

  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
}
