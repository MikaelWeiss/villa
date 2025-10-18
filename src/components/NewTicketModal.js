import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import styles from './NewTicketModal.module.css';

function NewTicketModal({ setIsOpen, onReportCreated }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        unit: '',
        title: '',
        description: '',
        severity: 'medium'
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        setError(''); // Clear error when user modifies form
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);

        // Validate file count (max 5 images)
        if (files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        // Validate file sizes (max 5MB each)
        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                setError(`File ${file.name} exceeds 5MB limit`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setSelectedFiles(validFiles);

        // Create previews
        const previews = validFiles.map(file => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    const uploadImages = async (reportId) => {
        if (selectedFiles.length === 0) return [];

        try {
            const uploadedUrls = [];

            for (const file of selectedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${reportId}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                // Upload to Storage
                const { data, error: uploadError } = await supabase.storage
                    .from('damage-reports')
                    .upload(filePath, file);

                if (uploadError) {
                    throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('damage-reports')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            }

            return uploadedUrls;
        } catch (err) {
            throw new Error(`Image upload failed: ${err.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.unit || !formData.title || !formData.description) {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create report record first
            const { data: reportData, error: insertError } = await supabase
                .from('reports')
                .insert([{
                    tenant_id: user.id,
                    tenant_name: user.email || 'Unknown',
                    unit: formData.unit,
                    description: formData.title + '\n\n' + formData.description,
                    severity: formData.severity,
                    status: 'open',
                    image_urls: []
                }])
                .select();

            if (insertError) {
                throw new Error(`Failed to create report: ${insertError.message}`);
            }

            const reportId = reportData[0].id;

            // Upload images and get URLs
            let imageUrls = [];
            if (selectedFiles.length > 0) {
                imageUrls = await uploadImages(reportId);

                // Update report with image URLs
                const { error: updateError } = await supabase
                    .from('reports')
                    .update({ image_urls: imageUrls })
                    .eq('id', reportId);

                if (updateError) {
                    // Report created but image URLs not saved
                    // Continue since main report was created successfully
                }
            }

            // Call parent callback to refresh list
            if (onReportCreated) {
                onReportCreated();
            }

            // Close modal
            setIsOpen(false);
        } catch (err) {
            setError(err.message || 'Failed to create report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setFilePreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    return (
        <div className={styles.modalContainer}>
            <form className={styles.addForm} onSubmit={handleSubmit}>
                <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>New Maintenance Report</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="unit">Unit Number *</label>
                    <input
                        id="unit"
                        placeholder="e.g., A-203, B-105"
                        type="text"
                        value={formData.unit}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="title">What's Broken? *</label>
                    <textarea
                        id="title"
                        placeholder="Brief summary of the issue..."
                        rows="3"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Damage Description *</label>
                    <textarea
                        id="description"
                        placeholder="Please describe the damage in detail..."
                        rows="4"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="severity">Severity Level</label>
                    <select
                        id="severity"
                        value={formData.severity}
                        onChange={handleInputChange}
                        disabled={loading}
                        style={{
                            border: '1px solid transparent',
                            borderRadius: '6px',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="low">Low - Can wait</option>
                        <option value="medium">Medium - Normal priority</option>
                        <option value="high">High - Urgent</option>
                        <option value="urgent">Urgent - Safety concern</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="images">Add Photos (Optional)</label>
                    <p style={{ fontSize: '0.85rem', margin: '0', color: '#666' }}>
                        Max 5 images, 5MB each
                    </p>
                    <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={loading}
                        style={{
                            border: '1px solid transparent',
                            borderRadius: '6px',
                            padding: '0.75rem',
                            backgroundColor: 'white'
                        }}
                    />
                </div>

                {filePreviews.length > 0 && (
                    <div className={styles.formGroup}>
                        <label>Selected Images ({filePreviews.length})</label>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                            gap: '0.5rem'
                        }}>
                            {filePreviews.map((preview, index) => (
                                <div key={index} style={{
                                    position: 'relative',
                                    width: '100%',
                                    paddingBottom: '100%',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className={styles.cancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submit}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewTicketModal;
