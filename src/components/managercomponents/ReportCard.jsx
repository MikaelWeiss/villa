import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';

// Report Card Component
const ReportCard = ({ report }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-semibold text-gray-900">{report.title}</h3>
          {report.urgent && (
            <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
              urgent
            </span>
          )}
          {report.isNew && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              New
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{report.date}</p>
      <p className="text-gray-700 leading-relaxed">{report.description}</p>
    </div>
  );
};