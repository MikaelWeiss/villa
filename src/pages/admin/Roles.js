import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { Users, Search, ArrowUpDown, ArrowUp, ArrowDown, Wrench, LayoutDashboard, Shield } from 'lucide-react';
import Nav from '../../components/nav/Nav.js';

const Roles = () => {
    const { user, profile, role, loading: authLoading } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('email');
    const [sortDirection, setSortDirection] = useState('asc');
    const [updatingUserId, setUpdatingUserId] = useState(null); // To track which user's role is being updated

    const nav = (
      <Nav navElements={[
        {
          name: "Dashboard",
          id: crypto.randomUUID(),
          icon: <LayoutDashboard size={20} />,
          path: "/manager/dashboard",
        },
        {
          name: "Tenants",
          id: crypto.randomUUID(),
          icon: <Users size={20} />,
          path: "/manager/tenants",
        },
        {
          name: "Maintenance",
          id: crypto.randomUUID(),
          icon: <Wrench size={20} />,
          path: "/manager/reports"
        },
        ...(role === 'admin' ? [{
            name: "Admin Roles",
            id: crypto.randomUUID(),
            icon: <Shield size={20} />,
            path: "/admin/roles"
        }] : [])
      ]}
      />);

    const fetchUsers = useCallback(async () => {
        if (!role) {
          setLoading(false);
          return;
        }

        setLoading(true);
        try {
            if (role !== 'admin' && role !== 'manager') {
                setError('You do not have permission to view this page.');
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('users') // Assuming 'users' is the table storing user profiles
                .select('id, role'); // Select necessary fields

            if (error) throw error;

            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [role]);

    useEffect(() => {
        document.title = 'Admin Roles - Villa';
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            return;
        }

        setUpdatingUserId(userId);
        try {
            const { error } = await supabase
                .from('users') // Table where user roles are stored
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            setUsers(prevUsers =>
                prevUsers.map(u => (u.id === userId ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            console.error('Error updating role:', err);
            alert('Failed to update role. Please try again.');
        } finally {
            setUpdatingUserId(null);
        }
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (column) => {
        if (sortColumn !== column) {
            return <ArrowUpDown size={16} className="text-secondary-400" />;
        }
        return sortDirection === 'asc'
            ? <ArrowUp size={16} className="text-primary" />
            : <ArrowDown size={16} className="text-primary" />;
    };

    const filteredAndSortedUsers = users
        .filter(u =>
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let aValue = a[sortColumn];
            let bValue = b[sortColumn];

            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    if (loading || authLoading) {
        return (
            <div className="flex min-h-screen">
                {nav}
                <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                    <PageHeader
                        title="Roles Management"
                        subtitle="Manage user roles (tenant, manager, admin)"
                    />
                    <div className="flex items-center justify-center pt-20">
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen">
                {nav}
                <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                    <PageHeader title="Roles Management" />
                    <p className="text-error-600">{error}</p>
                </div>
            </div>
        );
    }

    if (role !== 'admin' && role !== 'manager') {
      return (
          <div className="flex min-h-screen">
              {nav}
              <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                  <PageHeader title="Admin Roles" />
                  <p className="text-error-600">You do not have permission to view this page.</p>
              </div>
          </div>
      );
    }

    return (
        <div className="flex min-h-screen">
            {nav}
            <div className="ml-315 p-10 bg-background flex-1">
                <PageHeader
                    title="Roles Management"
                    subtitle="Manage user roles (tenant, manager, admin)"
                />

                <div className="w-full flex flex-col gap-4">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search size={20} className="text-secondary-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search by email or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {filteredAndSortedUsers.length === 0 ? (
                        <EmptyState
                            icon={<Users size={48} />}
                            title="No users found"
                            description="No users match your search criteria."
                        />
                    ) : (
                        <Card variant="elevated">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-secondary-50 border-b-2 border-secondary-200">
                                            <th
                                                className="p-4 text-left font-semibold text-secondary-800 cursor-pointer hover:bg-secondary-100 transition-smooth select-none"
                                                onClick={() => handleSort('email')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Email
                                                    {getSortIcon('email')}
                                                </div>
                                            </th>
                                            <th
                                                className="p-4 text-left font-semibold text-secondary-800 cursor-pointer hover:bg-secondary-100 transition-smooth select-none"
                                                onClick={() => handleSort('role')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Role
                                                    {getSortIcon('role')}
                                                </div>
                                            </th>
                                            <th className="p-4 text-right font-semibold text-secondary-800">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAndSortedUsers.map((u, index) => (
                                            <tr key={u.id} className={`border-b border-secondary-200 last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-secondary-25'}`}>
                                                <td className="p-4 text-secondary-800">
                                                    {u.email}
                                                </td>
                                                <td className="p-4">
                                                    <Select
                                                        value={u.role || 'tenant'}
                                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                        disabled={u.id === user.id || updatingUserId === u.id} // Disable changing own role or if currently updating
                                                        className="min-w-[120px]"
                                                    >
                                                        <option value="tenant">Tenant</option>
                                                        <option value="manager">Manager</option>
                                                        <option value="admin">Admin</option>
                                                    </Select>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {updatingUserId === u.id && <LoadingSpinner size="sm" />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Roles;