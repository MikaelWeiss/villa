import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';

// Sidebar Item Component
const SidebarItem = ({ active, icon, label }) => {
  const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const PaymentIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  const iconMap = {
    home: <HomeIcon />,
    payment: <PaymentIcon />,
    wrench: <Wrench className="w-5 h-5" />
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
      active ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-600 hover:bg-gray-50'
    }`}>
      {iconMap[icon]}
      <span>{label}</span>
    </div>
  );
};