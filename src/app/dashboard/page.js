'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AllUsers from '@/components/AllUsers';
import Notifications from '@/components/Notifications';
import Messages from '@/components/Messages';
import Buddies from '@/components/Buddies';
import BottomMenu from '@/components/BottomMenu';

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('AllUsers');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          method: 'GET',
        });

        if (res.status !== 200) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'AllUsers':
        return <AllUsers />;
      case 'Notifications':
        return <Notifications />;
      case 'Messages':
        return <Messages />;
      case 'Buddies':
        return <Buddies />;
      default:
        return <AllUsers />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <div className="mt-16 w-full">{renderComponent()}</div>
      <BottomMenu activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
    </div>
  );
}
