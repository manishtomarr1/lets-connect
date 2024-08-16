import mongoose from 'mongoose';

const FriendsSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['accepted', 'pending', 'blocked'], // You can add more statuses as needed
    default: 'accepted',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Friends = mongoose.models.Friends || mongoose.model('Friends', FriendsSchema);

export default Friends;
