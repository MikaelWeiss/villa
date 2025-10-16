// utils/downloadReports.js

export const downloadReports = (reports) => {
  // Convert all reports into formatted text
  const reportText = reports.map(r => 
    `${r.title}\nDate: ${r.date}\nUrgency: ${r.urgent ? 'URGENT' : 'Normal'}\nStatus: ${r.isNew ? 'New' : 'Existing'}\n\n${r.description}\n\n-------------------\n\n`
  ).join('');
  
  // Create a file blob
  const blob = new Blob([reportText], { type: 'text/plain' });
  
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create an invisible download link
  const a = document.createElement('a');
  a.href = url;
  a.download = `damage-reports-${new Date().toISOString().split('T')[0]}.txt`;
  
  // Trigger the download
  a.click();
  
  // Clean up the temporary URL
  URL.revokeObjectURL(url);
};