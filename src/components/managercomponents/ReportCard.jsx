import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';
import styles from './ReportCard.module.css';


// Report Card Component
function ReportCard({ report }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{report.title}</h3>
          {report.urgent && (
            <span className={`${styles.badge} ${styles.urgentBadge}`}>
              urgent
            </span>
          )}
          {report.isNew && (
            <span className={`${styles.badge} ${styles.newBadge}`}>
              New
            </span>
          )}
        </div>
      </div>
      <p className={styles.date}>{report.date}</p>
      <p className={styles.description}>{report.description}</p>
    </div>
  );
}

export default ReportCard;