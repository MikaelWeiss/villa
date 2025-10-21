import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';
import styles from './ActionButtons.module.css';

// Action Buttons Component
function ActionButtons({ onMaterialClick, onDownloadClick, onNewReportClick }) {
  return (
    <div className={styles.container}>
      <button onClick={onMaterialClick} className={`${styles.btn} ${styles.btnBlue}`}>
        <Plus className={styles.icon} />
        Report Material Needed
      </button>
      <button onClick={onDownloadClick} className={`${styles.btn} ${styles.btnGreen}`}>
        <Download className={styles.icon} />
        Download All Reports
      </button>
      <button onClick={onNewReportClick} className={`${styles.btn} ${styles.btnBlue}`}>
        <Plus className={styles.icon} />
        Add New Report
      </button>
    </div>
  );
}
export default ActionButtons;