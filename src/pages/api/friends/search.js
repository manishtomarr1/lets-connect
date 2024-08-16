import connectMongo from '../../../../lib/mongodb';
import Friends from '../../../models/friends';
import User from '../../../models/User';

export default async function handler(req, res) {
  await connectMongo(); // Ensure the database is connected

  const { userId, query } = req.query;

  if (!userId || !query) {
    return res.status(400).json({ message: 'User ID and query are required' });
  }

  try {
    // Find friends where the logged-in user is either user1 or user2 and the friendship is accepted
    const friends = await Friends.find({
      $or: [
        { user1: userId, status: 'accepted' },
        { user2: userId, status: 'accepted' },
      ],
    })
    .populate('user1 user2', 'username')
    .exec();

    // Filter friends based on the search query
    const filteredFriends = friends
      .map(friend => (friend.user1._id.toString() === userId ? friend.user2 : friend.user1))
      .filter(friend => friend.username.toLowerCase().includes(query.toLowerCase()));

    res.status(200).json(filteredFriends);
  } catch (error) {
    console.error('Error searching friends:', error);
    res.status(500).json({ message: 'Error searching friends' });
  }
}
