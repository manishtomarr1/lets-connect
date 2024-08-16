import connectMongo from '../../../../lib/mongodb';
import FriendRequest from '../../../models/FriendRequest';
import Notification from '../../../models/Notification';
import User from '../../../models/User'; // Import User model
import mongoose from 'mongoose';

export default async function handler(req, res) {
    await connectMongo(); // Ensure the database is connected

    if (req.method === 'POST') {
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: 'Sender and receiver are required' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            console.log('api hit>>>>>>>>>')
            // Fetch the sender's information
            const sender = await User.findById(senderId).session(session);
            if (!sender) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Sender not found' });
            }

            // Check if a request already exists
            const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId }).session(session);
            if (existingRequest) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Friend request already sent' });
            }

            // Create a new friend request
            const friendRequest = new FriendRequest({ sender: senderId, receiver: receiverId });
            await friendRequest.save({ session });

            console.log('Friend request saved:', friendRequest);

            if (!friendRequest._id) {
                await session.abortTransaction();
                session.endSession();
                console.error('Friend request ID is missing!');
                return res.status(500).json({ message: 'Failed to create friend request.' });
            }

            // Create a notification linked to the friend request
            const notification = new Notification({
                type: 'friendRequest',
                message: `${sender.username} sent you a friend request`, // Use the sender's username
                senderId,
                senderName: sender.username, // Store senderName in the notification
                receiverId,
                requestId: friendRequest._id // Link the notification to the friend request
            });

            await notification.save({ session });

            console.log('Notification created:', notification._id);

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            // Emit the real-time notification using the global io instance
            if (global.io) {
                global.io.to(receiverId).emit('receiveNotification', {
                    type: 'friendRequest',
                    message: `${sender.username} sent you a friend request`, 
                    senderId,
                    senderName: sender.username, 
                    receiverId,
                    requestId: friendRequest._id,
                });
            }

            res.status(201).json({ message: 'Friend request sent successfully', friendRequest });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Error sending friend request:', error);
            res.status(500).json({ message: 'Error sending friend request' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' }); // Handle non-POST requests
    }
}
