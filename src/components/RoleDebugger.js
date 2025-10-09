import React from 'react';
import { useAuth } from '../authentication';

/**
 * Debug component to display current user role information
 * This component can be temporarily added to any page for debugging
 */
export default function RoleDebugger() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading user role...</div>;
  }

  if (!user) {
    return <div>No user signed in</div>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 5px 0' }}>Role Debug Info</h4>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Role:</strong> {userRole || 'Not determined'}</div>
      <div><strong>User ID:</strong> {user.uid}</div>
      <div><strong>Expected Dashboard:</strong> {
        userRole === 'manager' ? 'Manager Dashboard' : 
        userRole === 'tenant' ? 'Tenant Dashboard' : 
        'Unknown'
      }</div>
    </div>
  );
}
