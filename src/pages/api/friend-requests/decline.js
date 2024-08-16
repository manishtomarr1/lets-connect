import connectMongo from '../../../../lib/mongodb';
import FriendRequest from '../../../models/FriendRequest';
import Notification from '../../../models/Notification';
import User from '../../../models/User';

export default async function handler(req, res) {
  await connectMongo();

  const { requestId } = req.body;

  try {
    // Find the friend request by its ID
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Update the friend request status to declined
    friendRequest.status = 'declined';
    await friendRequest.save();

    // Fetch the sender's information
    const sender = await User.findById(friendRequest.sender);
    const receiver = await User.findById(friendRequest.receiver);

    // Update the corresponding notification's status and message
    await Notification.updateOne(
      { senderId: friendRequest.sender, receiverId: friendRequest.receiver, type: 'friendRequest' },
      { status: 'declined', message: `${receiver.username} declined your friend request.` }
    );

    // Emit the real-time notification back to the sender
    if (global.io) {
      global.io.to(sender._id.toString()).emit('receiveNotification', {
        type: 'friendRequestDeclined',
        message: `${receiver.username} declined your friend request.`,
        senderId: receiver._id,
        receiverId: sender._id,
        requestId: friendRequest._id,
      });
    }

    res.status(200).json({ message: 'Friend request declined' });
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ message: 'Error declining friend request' });
  }
}
