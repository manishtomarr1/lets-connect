'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faComments, faUsers } from '@fortawesome/free-solid-svg-icons';

const BottomMenu = ({ activeComponent, setActiveComponent }) => {
  return (
    <div className="fixed bottom-0 w-full bg-blue-600 p-2 flex justify-around"> {/* Adjusted padding for size */}
      {/* All Users Icon */}
      <div className="flex flex-col items-center text-white" onClick={() => setActiveComponent('AllUsers')}>
        <FontAwesomeIcon icon={faUser} className={`h-6 w-6 ${activeComponent === 'AllUsers' ? 'text-blue-400' : 'text-white'}`} />
        <p className="text-xs text-center mt-1">All Users</p>
      </div>

      {/* Notifications Icon */}
      <div className="flex flex-col items-center text-white" onClick={() => setActiveComponent('Notifications')}>
        <FontAwesomeIcon icon={faBell} className={`h-6 w-6 ${activeComponent === 'Notifications' ? 'text-blue-400' : 'text-white'}`} />
        <p className="text-xs text-center mt-1">Notifications</p>
      </div>

      {/* Messages Icon */}
      <div className="flex flex-col items-center text-white" onClick={() => setActiveComponent('Messages')}>
        <FontAwesomeIcon icon={faComments} className={`h-6 w-6 ${activeComponent === 'Messages' ? 'text-blue-400' : 'text-white'}`} />
        <p className="text-xs text-center mt-1">Messages</p>
      </div>

      {/* Your Buddies Icon */}
      <div className="flex flex-col items-center text-white" onClick={() => setActiveComponent('Buddies')}>
        <FontAwesomeIcon icon={faUsers} className={`h-6 w-6 ${activeComponent === 'Buddies' ? 'text-blue-400' : 'text-white'}`} />
        <p className="text-xs text-center mt-1">Buddies</p>
      </div>
    </div>
  );
};

export default BottomMenu;
