import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';
import styles from './Header.module.css';

// Header Component
function Header() {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Dashboard</h1>
      <button className={styles.signOutBtn}>Sign Out</button>
    </div>
  );
}

export default Header;