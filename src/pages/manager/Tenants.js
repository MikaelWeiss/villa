import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Nav from '../../components/nav/Nav.js';
import { Wrench, LayoutDashboard, Users, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';

function ManagerTenantsPage() {
  const { profile, role } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('tenant_name');
  const [sortDirection, setSortDirection] = useState('asc');

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
      }
    ]}
    />)

  const fetchTenants = useCallback(async () => {
    if (role && !profile) return;
    try {
      // Get all unique tenants from reports
      let query = supabase
      .from('reports')
      .select('tenant_id, tenant_name, unit, status');

      if (role === 'manager' && profile?.organization_ids) {
        query = query.in('organization_id', profile.organization_ids);
      }

      query = query.order('tenant_name', { ascending: true });

      const { data: reports, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Group reports by tenant and aggregate data
      const tenantMap = new Map();

      reports.forEach(report => {
        if (!tenantMap.has(report.tenant_id)) {
          tenantMap.set(report.tenant_id, {
            tenant_id: report.tenant_id,
            tenant_name: report.tenant_name,
            units: new Set(),
            totalReports: 0,
            openReports: 0
          });
        }

        const tenant = tenantMap.get(report.tenant_id);
        tenant.units.add(report.unit);
        tenant.totalReports += 1;
        if (report.status === 'open') {
          tenant.openReports += 1;
        }
      });

      // Convert to array and format units
      const formattedTenants = Array.from(tenantMap.values()).map(tenant => ({
        ...tenant,
        units: Array.from(tenant.units).join(', ')
      }));

      setTenants(formattedTenants);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tenants');
      setLoading(false);
    }
  }, [profile, role]);

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

  const filteredAndSortedTenants = tenants
  .filter(tenant =>
    tenant.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    // Handle string comparison for tenant_name
    if (sortColumn === 'tenant_name') {
      aValue = (aValue || '').toLowerCase();
      bValue = (bValue || '').toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    document.title = 'Tenants - Villa';
    fetchTenants();

    // Set up real-time subscription to refresh when reports change
    const channel = supabase
    .channel('tenants-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'reports'
      },
      () => {
        // Refresh tenants list when reports change
        fetchTenants();
      }
    )
    .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTenants])

  const { loading: authLoading } = useAuth();

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen">
        {nav}
        <div className="ml-315 p-10 bg-background min-h-screen flex-1">
          <PageHeader
            title="Tenants"
          />
          <p className="text-secondary-600">Loading tenants...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        {nav}
        <div className="ml-315 p-10 bg-background min-h-screen flex-1">
          <PageHeader
            title="Tenants"
          />
          <p className="text-error-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {nav}
      <div className="ml-315 p-10 bg-background min-h-screen flex-1">
        <PageHeader
          title="Tenants"
        />
        {tenants.length === 0 ? (
          <EmptyState
            icon={<Users size={48} />}
            title="No tenants found"
            description="There are no tenants with maintenance requests at this time."
          />
        ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-secondary-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth bg-white"
                />
              </div>
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-secondary-50 border-b-2 border-secondary-200">
                    <th
                      className="p-4 text-left font-semibold text-secondary-800 cursor-pointer hover:bg-secondary-100 transition-smooth select-none"
                      onClick={() => handleSort('tenant_name')}
                    >
                      <div className="flex items-center gap-2">
                        Tenant Name
                        {getSortIcon('tenant_name')}
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-secondary-800">
                      Units
                    </th>
                    <th
                      className="p-4 text-center font-semibold text-secondary-800 cursor-pointer hover:bg-secondary-100 transition-smooth select-none"
                      onClick={() => handleSort('openReports')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Open Reports
                        {getSortIcon('openReports')}
                      </div>
                    </th>
                    <th
                      className="p-4 text-center font-semibold text-secondary-800 cursor-pointer hover:bg-secondary-100 transition-smooth select-none"
                      onClick={() => handleSort('totalReports')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Total Reports
                        {getSortIcon('totalReports')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedTenants.map((tenant, index) => (
                    <tr
                      key={tenant.tenant_id}
                      className={`border-b border-secondary-200 last:border-b-0 ${
index % 2 === 0 ? 'bg-white' : 'bg-secondary-25'
}`}
                    >
                      <td className="p-4 text-secondary-800">
                        {tenant.tenant_name || 'Unknown'}
                      </td>
                      <td className="p-4 text-secondary-600">
                        {tenant.units}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
tenant.openReports > 0
? 'bg-error-100 text-error-700'
: 'bg-success-100 text-success-700'
}`}>
                          {tenant.openReports}
                        </span>
                      </td>
                      <td className="p-4 text-center text-secondary-600">
                        {tenant.totalReports}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  )
}

export default ManagerTenantsPage;
