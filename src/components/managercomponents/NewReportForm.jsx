import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';

// New Report Form Component
const NewReportForm = ({ newReport, setNewReport, onSubmit, onCancel }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Add New Damage Report</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={newReport.title}
            onChange={(e) => setNewReport({...newReport, title: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={newReport.description}
            onChange={(e) => setNewReport({...newReport, description: e.target.value})}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
          <select
            value={newReport.urgency}
            onChange={(e) => setNewReport({...newReport, urgency: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={onSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Submit Report
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};