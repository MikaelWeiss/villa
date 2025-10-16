import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';

// Header Component
const Header = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-5xl font-bold text-gray-900">Dashboard</h1>
      <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
        Sign Out
      </button>
    </div>
  );
};