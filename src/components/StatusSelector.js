import { useState } from 'react';
import styles from './StatusSelector.module.css';

function StatusSelector({ currentStatus, onStatusChange }) {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const statusOptions = [
        { value: 'open', label: 'Open', color: '#1976d2' },
        { value: 'in_progress', label: 'In Progress', color: '#ff9800' },
        { value: 'closed', label: 'Closed', color: '#4caf50' },
        { value: 'cancelled', label: 'Cancelled', color: '#f44336' }
    ];

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleUpdate = async () => {
        if (selectedStatus === currentStatus) {
            return;
        }

        setIsUpdating(true);
        try {
            await onStatusChange(selectedStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getCurrentStatusColor = () => {
        const status = statusOptions.find(s => s.value === selectedStatus);
        return status ? status.color : '#1976d2';
    };

    return (
        <div className={styles.container}>
            <div className={styles.selectContainer}>
                <label htmlFor="status" className={styles.label}>
                    Status
                </label>
                <select
                    id="status"
                    className={styles.select}
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={{ borderColor: getCurrentStatusColor() }}
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {selectedStatus !== currentStatus && (
                <button
                    className={styles.updateButton}
                    onClick={handleUpdate}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
            )}
        </div>
    );
}

export default StatusSelector;
