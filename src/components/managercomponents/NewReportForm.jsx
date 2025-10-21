import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';
import styles from './NewReportForm.module.css';


// New Report Form Component
function NewReportForm({ newReport, setNewReport, onSubmit, onCancel }) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Add New Damage Report</h3>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            value={newReport.title}
            onChange={(e) => setNewReport({...newReport, title: e.target.value})}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            value={newReport.description}
            onChange={(e) => setNewReport({...newReport, description: e.target.value})}
            rows={4}
            className={styles.textarea}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Urgency</label>
          <select
            value={newReport.urgency}
            onChange={(e) => setNewReport({...newReport, urgency: e.target.value})}
            className={styles.select}
          >
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className={styles.buttons}>
          <button onClick={onSubmit} className={styles.submitBtn}>
            Submit Report
          </button>
          <button onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewReportForm;