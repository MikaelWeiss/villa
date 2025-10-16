import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';

// Action Buttons Component
const ActionButtons = ({ onMaterialClick, onDownloadClick, onNewReportClick }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <button
        onClick={onMaterialClick}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Report Material Needed
      </button>
      <button
        onClick={onDownloadClick}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Download className="w-5 h-5" />
        Download All Reports
      </button>
      <button
        onClick={onNewReportClick}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add New Report
      </button>
    </div>
  );
};