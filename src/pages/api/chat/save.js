import connectMongo from '../../../../lib/mongodb';
import ChatMessage from '../../../models/ChatMessage';

export default async function handler(req, res) {
  await connectMongo();

  const { sender, receiver, message, timestamp } = req.body;

  try {
    // Create a new message instance
    const chatMessage = new ChatMessage({ sender, receiver, message, timestamp });

    // Save the message to the database
    await chatMessage.save();

    res.status(201).json({ message: 'Message saved successfully' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error saving message' });
  }
}
