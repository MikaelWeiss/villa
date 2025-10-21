import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';// Sidebar Component
import SidebarItem from './SidebarItem';
import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.nav}>
        <SidebarItem active icon="home" label="Dashboard" />
        <SidebarItem icon="payment" label="Payments" />
        <SidebarItem icon="wrench" label="Maintenance" />
      </div>
    </div>
  );

}

export default Sidebar;