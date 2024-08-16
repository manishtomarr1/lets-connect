import connectMongo from '../../../lib/mongodb';
import Notification from '../../models/Notification';

export default async function handler(req, res) {
  await connectMongo();

  const { userId } = req.query;

  try {
    // Fetch notifications where the user is either the receiver or the sender
    const notifications = await Notification.find({
      $or: [
        { receiverId: userId, status: 'pending' },
        { senderId: userId, status: { $in: ['accepted', 'declined'] } }
      ]
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
}
