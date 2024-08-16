import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

const Buddies = () => {
  const [buddies, setBuddies] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch current user's data
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          console.log('Current user fetched:', user);

          // Fetch friends of the current user
          const friendsResponse = await fetch(`/api/friends?userId=${user._id}`);
          if (friendsResponse.ok) {
            const friendsData = await friendsResponse.json();
            setBuddies(friendsData);
          } else {
            console.error('Failed to fetch friends');
          }
        } else {
          console.error('Failed to fetch current user');
        }
      } catch (error) {
        console.error('Error fetching current user or friends:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Your Buddies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buddies.map((buddy) => (
          <div key={buddy._id} className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-gray-500">{buddy.username.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{buddy.username}</h3>
              </div>
            </div>
            <FontAwesomeIcon
              icon={faCommentDots}
              size="lg"
              className="text-blue-500 cursor-pointer"
              title="Send a message"
              onClick={() => console.log(`Start chat with ${buddy.username}`)} // Implement chat logic
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buddies;
