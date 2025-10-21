import { useState } from 'react';
import Select from './ui/Select';
import Button from './ui/Button';

function StatusSelector({ currentStatus, onStatusChange }) {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const statusOptions = [
        { value: 'open', label: 'Open' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'closed', label: 'Closed' },
        { value: 'cancelled', label: 'Cancelled' }
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

    return (
        <div className="flex items-end gap-4">
            <div className="flex-1">
                <Select
                    label="Status"
                    id="status"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </div>

            {selectedStatus !== currentStatus && (
                <Button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    loading={isUpdating}
                    variant="primary"
                >
                    Update Status
                </Button>
            )}
        </div>
    );
}

export default StatusSelector;
