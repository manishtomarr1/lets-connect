import connectMongo from '../../../../lib/mongodb';
import ChatMessage from '../../../models/ChatMessage';
export default async function handler(req, res) {
  await connectMongo();

  const { senderId, receiverId } = req.query;

  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 }); // Sort by timestamp

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
}
