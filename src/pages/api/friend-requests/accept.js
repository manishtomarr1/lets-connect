import connectMongo from '../../../../lib/mongodb';
import FriendRequest from '../../../models/FriendRequest';
import Notification from '../../../models/Notification';
import User from '../../../models/User';
import Friends from '../../../models/friends';

export default async function handler(req, res) {
  await connectMongo();

  const { requestId } = req.body;

  try {
    // Find the friend request by its ID
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

     // Create a new entry in the Friends collection
     const newFriendship = new Friends({
      user1: friendRequest.sender._id,
      user2: friendRequest.receiver._id,
      status: 'accepted',
    });

    await newFriendship.save();

    // Update the friend request status to accepted
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Fetch the sender's information
    const sender = await User.findById(friendRequest.sender);
    const receiver = await User.findById(friendRequest.receiver);

    // Update the corresponding notification's status and message
    await Notification.updateOne(
      { senderId: friendRequest.sender, receiverId: friendRequest.receiver, type: 'friendRequest' },
      { status: 'accepted', message: `${receiver.username} is now your buddy.` }
    );

    // Emit the real-time notification back to the sender
    if (global.io) {
      global.io.to(sender._id.toString()).emit('receiveNotification', {
        type: 'friendRequestAccepted',
        message: `${receiver.username} accepted your friend request.`,
        senderId: receiver._id,
        receiverId: sender._id,
        requestId: friendRequest._id,
      });
    }

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Error accepting friend request' });
  }
}
