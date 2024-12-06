"use client"

import React from 'react';
import { withAuth } from '@context/auth';


const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default withAuth(Dashboard);
