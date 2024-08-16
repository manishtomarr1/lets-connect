import connectMongo from '../../../../lib/mongodb';
import ChatMessage from '../../../models/ChatMessage';
// import User from '../../../models/User';

export default async function handler(req, res) {
  await connectMongo();

  const { senderId, receiverId, message } = req.body;

  try {
    const chatMessage = new ChatMessage({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    await chatMessage.save();

    // Emit the message via socket.io
    if (global.io) {
      global.io.to(receiverId).emit('receiveMessage', chatMessage);
    }

    res.status(201).json({ message: 'Message sent', chatMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
}
