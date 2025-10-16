import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';

// Balance Card Component
const BalanceCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Balance</h2>
            <p className="text-xl text-gray-700">$0.00</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            Pay Now
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            History
          </button>
        </div>
      </div>
    </div>
  );
};