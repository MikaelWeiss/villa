import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Modal from './ui/Modal';
import Input from './ui/Input';
import TextArea from './ui/TextArea';
import Select from './ui/Select';
import Button from './ui/Button';
import SvgReportWizard from './SvgReportWizard';

const useSvgForm = true;

function NewTicketModal({ setIsOpen, onReportCreated }) {
        const { user, profile } = useAuth();
    const [formData, setFormData] = useState({
        unit: '',
        title: '',
        description: '',
        severity: 'medium'
    });
    const [wizardCompleted, setWizardCompleted] = useState(false);
    const [showBackButton, setShowBackButton] = useState(false);
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

        if (files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                setError(`File ${file.name} exceeds 5MB limit`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setSelectedFiles(validFiles);

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

                const { data, error: uploadError } = await supabase.storage
                    .from('damage-reports')
                    .upload(filePath, file);

                if (uploadError) {
                    throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
                }

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

        if (!formData.unit || !formData.title) {
            setError('Unit number and issue are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
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

            let imageUrls = [];
            if (selectedFiles.length > 0) {
                imageUrls = await uploadImages(reportId);

                const { error: updateError } = await supabase
                    .from('reports')
                    .update({ image_urls: imageUrls })
                    .eq('id', reportId);

                if (updateError) {
                    // Non-critical error
                }
            }

            if (onReportCreated) {
                onReportCreated();
            }

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

    const handleWizardComplete = (wizardData) => {
        setFormData(prev => ({
            ...prev,
            title: `${wizardData.room}/${wizardData.item}`,
            description: wizardData.description
        }));
        setWizardCompleted(true);
    };

    return (
        <Modal isOpen={true} onClose={() => setIsOpen(false)} size="lg">
            <Modal.Header onClose={() => setIsOpen(false)}>
                <Modal.Title>New Maintenance Report</Modal.Title>
            </Modal.Header>

            <form onSubmit={handleSubmit}>
                <Modal.Content>
                    {error && (
                        <div className="bg-error-50 text-error-700 p-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <Input
                            label="Unit Number *"
                            id="unit"
                            placeholder="e.g., A-203, B-105"
                            type="text"
                            value={formData.unit}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />

                        {useSvgForm ? (
                                                                                                    <div className={`py-12 ${wizardCompleted ? 'border-2 border-success-500 rounded-lg p-4' : ''}`}>
                                                                                                        {wizardCompleted ? (                                    <div>
                                        <h3 className='text-lg font-semibold text-success-700'>Issue Selected:</h3>
                                        <p className='text-secondary-800 font-medium'>{formData.title}</p>
                                        <p className='text-secondary-600'>{formData.description}</p>
                                        <Button variant="outline" size="sm" onClick={() => setWizardCompleted(false)} className="mt-2">Change</Button>
                                    </div>
                                ) : (
                                    <SvgReportWizard onComplete={handleWizardComplete} onPanelChange={setShowBackButton} />
                                )}
                            </div>
                        ) : (
                            <>
                                <TextArea
                                    label="What's Broken? *"
                                    id="title"
                                    placeholder="Brief summary of the issue..."
                                    rows={3}
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />

                                <TextArea
                                    label="Damage Description *"
                                    id="description"
                                    placeholder="Please describe the damage in detail..."
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                            </>
                        )}

                        <Select
                            label="Severity Level"
                            id="severity"
                            value={formData.severity}
                            onChange={handleInputChange}
                            disabled={loading}
                        >
                            <option value="low">Low - Can wait</option>
                            <option value="medium">Medium - Normal priority</option>
                            <option value="high">High - Urgent</option>
                            <option value="urgent">Urgent - Safety concern</option>
                        </Select>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-secondary-700">
                                Add Photos (Optional)
                            </label>
                            <p className="text-xs text-secondary-500">
                                Max 5 images, 5MB each
                            </p>
                            <input
                                id="images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-secondary-300 rounded-lg transition-smooth focus-ring bg-white"
                            />
                        </div>

                        {filePreviews.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-secondary-700">
                                    Selected Images ({filePreviews.length})
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {filePreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square bg-secondary-200 rounded-lg overflow-hidden">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-error text-white border-none cursor-pointer flex items-center justify-center text-base font-bold hover:bg-error-600 transition-smooth"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Content>

                <Modal.Footer>
                    <Button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        variant="secondary"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        loading={loading}
                    >
                        Submit Report
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export default NewTicketModal;
