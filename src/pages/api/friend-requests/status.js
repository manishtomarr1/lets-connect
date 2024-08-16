import connectMongo from '../../../../lib/mongodb';
import FriendRequest from '../../../models/FriendRequest';

export default async function handler(req, res) {
    await connectMongo();

    const { senderId, receiverId } = req.query;

    try {
        let requests;
        if (senderId) {
            requests = await FriendRequest.find({ sender: senderId, status: 'pending' }).populate('receiver', 'username');
        } else if (receiverId) {
            requests = await FriendRequest.find({ receiver: receiverId, status: 'pending' }).populate('sender', 'username');
        }

        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).json({ message: 'Error fetching friend requests' });
    }
}
