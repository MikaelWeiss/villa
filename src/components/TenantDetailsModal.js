import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { supabase } from '../lib/supabase';

function TenantDetailsModal({ isOpen, onClose, tenant }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <Modal.Header onClose={onClose}>
          <Modal.Title>Tenant Details</Modal.Title>
        </Modal.Header>
      </Modal>
    </>
  )
}

export default TenantDetailsModal;
