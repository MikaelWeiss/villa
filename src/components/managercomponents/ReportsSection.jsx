import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';

// Reports Section Component
const ReportsSection = ({ reports, showAll, onToggleShowAll, newReportsCount }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-semibold text-gray-900">Damage Reports</h2>
          {newReportsCount > 0 && (
            <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              <Clock className="w-4 h-4" />
              {newReportsCount} new in last 24 hours
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {reports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {!showAll && (
        <div className="mt-6 text-center">
          <button
            onClick={() => onToggleShowAll(true)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            See More Reports ({reports.length - 2} more)
          </button>
        </div>
      )}

      {showAll && (
        <div className="mt-6 text-center">
          <button
            onClick={() => onToggleShowAll(false)}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  );
};