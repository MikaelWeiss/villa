import React, { useState } from 'react';
import { Wrench, Download, Plus, Clock } from 'lucide-react';
import styles from './MaterialRequestForm.module.css';


// Material Request Form Component
function MaterialRequestForm({ materialRequest, setMaterialRequest, onSubmit, onCancel }) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Report Material Needed</h3>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Material/Item</label>
          <input
            type="text"
            value={materialRequest.item}
            onChange={(e) => setMaterialRequest({...materialRequest, item: e.target.value})}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Quantity</label>
          <input
            type="text"
            value={materialRequest.quantity}
            onChange={(e) => setMaterialRequest({...materialRequest, quantity: e.target.value})}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Urgency</label>
          <select
            value={materialRequest.urgency}
            onChange={(e) => setMaterialRequest({...materialRequest, urgency: e.target.value})}
            className={styles.select}
          >
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className={styles.buttons}>
          <button onClick={onSubmit} className={styles.submitBtn}>
            Submit Request
          </button>
          <button onClick={onCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaterialRequestForm;