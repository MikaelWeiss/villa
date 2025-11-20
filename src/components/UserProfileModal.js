import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { User, Mail, Building2, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function UserProfileModal({ isOpen, onClose }) {
    const { user, profile, signOut } = useAuth();
    const [organizations, setOrganizations] = useState([]);
    const [loadingOrgs, setLoadingOrgs] = useState(true);

    useEffect(() => {
        if (isOpen && profile?.organization_ids) {
            fetchOrganizations();
        }
    }, [isOpen, profile]);

    const fetchOrganizations = async () => {
        setLoadingOrgs(true);
        try {
            const { data, error } = await supabase
                .from('organizations')
                .select('name')
                .in('id', profile.organization_ids);

            if (error) throw error;
            setOrganizations(data || []);
        } catch (error) {
            console.error('Error fetching organizations:', error);
            setOrganizations([]);
        } finally {
            setLoadingOrgs(false);
        }
    };

    const getUserInitials = () => {
        if (!user?.email) return 'U';
        const email = user.email;
        const namePart = email.split('@')[0];
        const parts = namePart.split(/[._-]/);

        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return namePart.substring(0, 2).toUpperCase();
    };

    const getUserName = () => {
        if (!user?.email) return 'User';
        return user.email.split('@')[0];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            onClose();
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Failed to sign out. Please try again.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <Modal.Header onClose={onClose}>
                <Modal.Title>Account Information</Modal.Title>
            </Modal.Header>

            <Modal.Content>
                <div className="space-y-6">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white font-semibold text-2xl shadow-lg mb-4">
                            {getUserInitials()}
                        </div>
                        <h3 className="text-xl font-semibold text-secondary-800">
                            {getUserName()}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-secondary-50 rounded-lg p-4">
                            <div className="flex items-center gap-3 text-secondary-700">
                                <Mail size={18} className="text-secondary-400 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-secondary-500 mb-1">Email</p>
                                    <p className="text-sm font-medium">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary-50 rounded-lg p-4">
                            <div className="flex items-center gap-3 text-secondary-700">
                                <Building2 size={18} className="text-secondary-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-secondary-500 mb-1">Organization</p>
                                    {loadingOrgs ? (
                                        <p className="text-sm text-secondary-400">Loading...</p>
                                    ) : organizations.length > 0 ? (
                                        <div className="space-y-1">
                                            {organizations.map((org, index) => (
                                                <p key={index} className="text-sm font-medium">{org.name}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-secondary-400">No organization</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {user?.created_at && (
                            <div className="bg-secondary-50 rounded-lg p-4">
                                <div className="flex items-center gap-3 text-secondary-700">
                                    <Calendar size={18} className="text-secondary-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-secondary-500 mb-1">Account Created</p>
                                        <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Content>

            <Modal.Footer>
                <Button
                    variant="danger"
                    onClick={handleSignOut}
                    className="w-full"
                >
                    Sign Out
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserProfileModal;
