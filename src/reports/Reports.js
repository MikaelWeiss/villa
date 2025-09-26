import React from 'react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth, db } from '../authentication';
import './Reports.css';

export default function Reports() {
  const { user } = useAuth();
  const [description, setDescription] = React.useState('');
  const [unit, setUnit] = React.useState('');
  const [items, setItems] = React.useState([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [showAddForm, setShowAddForm] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'reports'),
      where('tenantUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !unit) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reports'), {
        tenantUid: user.uid,
        tenantName: user.displayName || user.email,
        unit,
        description,
        status: 'open',
        createdAt: serverTimestamp(),
      });
      setDescription('');
      setUnit('');
      setShowAddForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#e53e3e';
      case 'in-progress': return '#ed8936';
      case 'resolved': return '#38a169';
      default: return '#718096';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return '🔴';
      case 'in-progress': return '🟡';
      case 'resolved': return '🟢';
      default: return '⚪';
    }
  };

  const stats = {
    total: items.length,
    open: items.filter(item => item.status === 'open').length,
    inProgress: items.filter(item => item.status === 'in-progress').length,
    resolved: items.filter(item => item.status === 'resolved').length
  };

  return (
    <div className="reports-container">
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Reports</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <div className="stat-number">{stats.open}</div>
            <div className="stat-label">Open</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟡</div>
          <div className="stat-content">
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <div className="stat-number">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="reports-header">
        <h2 className="reports-title">Your Damage Reports</h2>
        <button 
          className="add-report-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Report
        </button>
      </div>

      {/* Add Report Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Damage Report</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="add-form">
              <div className="form-group">
                <label htmlFor="unit">Unit Number</label>
                <input
                  id="unit"
                  type="text"
                  placeholder="e.g., A-203, B-105"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Damage Description</label>
                <textarea
                  id="description"
                  placeholder="Please describe the damage in detail..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submitting || !description || !unit}
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="reports-list">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No reports yet</h3>
            <p>Click "Add New Report" to create your first damage report</p>
          </div>
        ) : (
          items.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <div className="report-unit">{report.unit}</div>
                <div 
                  className="report-status"
                  style={{ color: getStatusColor(report.status) }}
                >
                  {getStatusIcon(report.status)} {report.status}
                </div>
              </div>
              <div className="report-description">{report.description}</div>
              <div className="report-footer">
                <div className="report-date">
                  Created: {formatDate(report.createdAt)}
                </div>
                <div className="report-actions">
                  <button className="action-btn">View Details</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


