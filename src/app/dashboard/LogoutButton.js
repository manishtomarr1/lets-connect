'use client'; // This makes this component a Client Component

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');  // Redirect after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
}
