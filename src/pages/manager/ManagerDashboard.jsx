import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';

// Main Dashboard Component
export default function ManagerDashboard() {
  const [showAllReports, setShowAllReports] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showNewReportForm, setShowNewReportForm] = useState(false);
  const [materialRequest, setMaterialRequest] = useState({ item: '', quantity: '', urgency: 'normal' });
  const [newReport, setNewReport] = useState({ title: '', description: '', urgency: 'normal' });

  const allReports = [
    {
      id: 1,
      title: 'Dishwasher',
      date: 'Oct 9, 2025',
      isNew: true,
      urgent: true,
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculus massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.'
    },
    {
      id: 2,
      title: 'Screen Door',
      date: 'Oct 9, 2025',
      isNew: true,
      urgent: false,
      description: 'Screen door hinge is loose and needs replacement. The bottom hinge has completely detached from the frame.'
    },
    {
      id: 3,
      title: 'Kitchen Faucet',
      date: 'Oct 8, 2025',
      isNew: false,
      urgent: true,
      description: 'Faucet is leaking continuously. Water damage visible under sink cabinet.'
    },
    {
      id: 4,
      title: 'Living Room Window',
      date: 'Oct 7, 2025',
      isNew: false,
      urgent: false,
      description: 'Window seal is broken causing drafts. Needs resealing or replacement.'
    },
    {
      id: 5,
      title: 'Garage Door',
      date: 'Oct 6, 2025',
      isNew: false,
      urgent: false,
      description: 'Automatic opener making unusual grinding noise. May need motor inspection.'
    }
  ];

  const reportsToShow = showAllReports ? allReports : allReports.slice(0, 2);
  const newReportsCount = allReports.filter(r => r.isNew).length;

  const downloadReports = () => {
    const reportText = allReports.map(r => 
      `${r.title}\nDate: ${r.date}\nUrgency: ${r.urgent ? 'URGENT' : 'Normal'}\nStatus: ${r.isNew ? 'New' : 'Existing'}\n\n${r.description}\n\n-------------------\n\n`
    ).join('');
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `damage-reports-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const submitMaterialRequest = () => {
    if (materialRequest.item && materialRequest.quantity) {
      alert(`Material request submitted:\n${materialRequest.item} - Quantity: ${materialRequest.quantity}`);
      setMaterialRequest({ item: '', quantity: '', urgency: 'normal' });
      setShowMaterialForm(false);
    }
  };

  const submitNewReport = () => {
    if (newReport.title && newReport.description) {
      alert(`New report submitted:\n${newReport.title}`);
      setNewReport({ title: '', description: '', urgency: 'normal' });
      setShowNewReportForm(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <Header />
          <BalanceCard />
          
          <ActionButtons 
            onMaterialClick={() => setShowMaterialForm(!showMaterialForm)}
            onDownloadClick={downloadReports}
            onNewReportClick={() => setShowNewReportForm(!showNewReportForm)}
          />

          {showMaterialForm && (
            <MaterialRequestForm
              materialRequest={materialRequest}
              setMaterialRequest={setMaterialRequest}
              onSubmit={submitMaterialRequest}
              onCancel={() => setShowMaterialForm(false)}
            />
          )}

          {showNewReportForm && (
            <NewReportForm
              newReport={newReport}
              setNewReport={setNewReport}
              onSubmit={submitNewReport}
              onCancel={() => setShowNewReportForm(false)}
            />
          )}

          <ReportsSection
            reports={reportsToShow}
            showAll={showAllReports}
            onToggleShowAll={setShowAllReports}
            newReportsCount={newReportsCount}
          />
        </div>
      </div>
    </div>
  );
}