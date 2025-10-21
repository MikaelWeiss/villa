import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';
import styles from './BalanceCard.module.css';

// Balance Card Component
function BalanceCard() {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 className={styles.title}>Balance</h2>
            <p className={styles.amount}>$0.00</p>
          </div>
        </div>
        <div className={styles.buttons}>
          <button className={styles.btn}>Pay Now</button>
          <button className={styles.btn}>History</button>
        </div>
      </div>
    </div>
  );
}
export default BalanceCard;