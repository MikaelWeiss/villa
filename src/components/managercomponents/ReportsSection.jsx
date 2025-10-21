import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';
import ReportCard from './ReportCard';
import styles from './ReportsSection.module.css';

// Reports Section Component
function ReportsSection({ reports, showAll, onToggleShowAll, newReportsCount }) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Damage Reports</h2>
          {newReportsCount > 0 && (
            <span className={styles.badge}>
              <Clock className={styles.badgeIcon} />
              {newReportsCount} new in last 24 hours
            </span>
          )}
        </div>
      </div>

      <div className={styles.reportsList}>
        {reports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {!showAll && (
        <div className={styles.buttonContainer}>
          <button
            onClick={() => onToggleShowAll(true)}
            className={`${styles.btn} ${styles.seeMoreBtn}`}
          >
            See More Reports ({reports.length - 2} more)
          </button>
        </div>
      )}

      {showAll && (
        <div className={styles.buttonContainer}>
          <button
            onClick={() => onToggleShowAll(false)}
            className={`${styles.btn} ${styles.showLessBtn}`}
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportsSection;