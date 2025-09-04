import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardLayout from './components/DashboardLayout';
import { mockPools, mockUserData } from './data/mockData';

function App() {
  const [user, setUser] = useState(null);
  const [pools, setPools] = useState(mockPools);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser(mockUserData);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-accent mx-auto mb-4"></div>
          <h2 className="text-heading gradient-text">Loading StableSwap AI...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header user={user} />
      <DashboardLayout user={user} pools={pools} setPools={setPools} />
    </div>
  );
}

export default App;