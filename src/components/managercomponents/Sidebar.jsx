import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';// Sidebar Component
const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="space-y-2">
        <SidebarItem active icon="home" label="Dashboard" />
        <SidebarItem icon="payment" label="Payments" />
        <SidebarItem icon="wrench" label="Maintenance" />
      </div>
    </div>
  );
};