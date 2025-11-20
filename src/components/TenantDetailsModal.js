import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import Button from './ui/Button';
import TicketDetailModal from './TicketDetailModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Building2, Calendar, FileText, AlertCircle, CheckCircle, Clock, XCircle, Home, ChevronDown, ChevronUp } from 'lucide-react';

function TenantDetailsModal({ isOpen, onClose, tenant }) {
  const { profile, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tenantData, setTenantData] = useState(null);
  const [reports, setReports] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [openReportsExpanded, setOpenReportsExpanded] = useState(true);
  const [closedReportsExpanded, setClosedReportsExpanded] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && tenant?.tenant_id) {
      fetchTenantDetails();
    }
  }, [isOpen, tenant]);

  const fetchTenantDetails = async () => {
    if (!tenant?.tenant_id) return;

    setLoading(true);
    try {
      // Fetch all reports for this tenant
      let query = supabase
        .from('reports')
        .select('*')
        .eq('tenant_id', tenant.tenant_id)
        .order('created_at', { ascending: false });

      if (role === 'manager' && profile?.organization_ids) {
        query = query.in('organization_id', profile.organization_ids);
      }

      const { data: tenantReports, error: reportsError } = await query;

      if (reportsError) throw reportsError;

      // Try to get user info from users table
      let userData = null;
      try {
        const { data: userRecord, error: userError } = await supabase
          .from('users')
          .select('*, unit:unit(unit_number)')
          .eq('id', tenant.tenant_id)
          .single();

        if (!userError && userRecord) {
          userData = {
            unit_number: userRecord.unit?.unit_number,
            role: userRecord.role
          };
        }
      } catch (e) {
        // User might not exist in users table, that's okay
        console.log('Could not fetch user details:', e);
      }

      // Get unique units
      const uniqueUnits = [...new Set(tenantReports?.map(r => r.unit).filter(Boolean))];

      setTenantData({
        ...tenant,
        units: uniqueUnits,
        userInfo: userData
      });
      setReports(tenantReports || []);
      setUserInfo(userData);
    } catch (error) {
      console.error('Error fetching tenant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={16} className="text-error-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-warning-500" />;
      case 'resolved':
        return <CheckCircle size={16} className="text-success-500" />;
      case 'closed':
      case 'cancelled':
        return <XCircle size={16} className="text-secondary-500" />;
      default:
        return <FileText size={16} className="text-secondary-500" />;
    }
  };

  const openReports = reports.filter(r => r.status === 'open' || r.status === 'in-progress');
  const closedReports = reports.filter(r => r.status === 'closed' || r.status === 'cancelled' || r.status === 'resolved');

  const CollapsibleSection = ({ title, count, isExpanded, onToggle, children }) => (
    <div className="border border-secondary-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-secondary-50 hover:bg-secondary-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-secondary-800">{title}</span>
          <Badge variant="secondary">{count}</Badge>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-secondary-500" />
        ) : (
          <ChevronDown size={20} className="text-secondary-500" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );

  const formatTicketDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const transformReportToTicket = (report) => {
    return {
      id: report.id,
      title: report.title || 'No Title',
      date: formatTicketDate(report.created_at),
      unit: report.unit,
      severity: report.severity,
      status: report.status || 'open',
      description: report.description,
      image_urls: report.image_urls || [],
      created_at: report.created_at,
      updated_at: report.updated_at,
      closing_comment: report.closing_comment,
      closed_at: report.closed_at
    };
  };

  const handleReportClick = (report) => {
    const ticket = transformReportToTicket(report);
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const ReportItem = ({ report }) => (
    <div 
      className="border-b border-secondary-100 last:border-b-0 pb-3 last:pb-0 mb-3 last:mb-0 cursor-pointer hover:bg-secondary-50 transition-colors rounded px-2 -mx-2"
      onClick={() => handleReportClick(report)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h5 className="font-medium text-secondary-800 truncate">
              {report.title || 'No Title'}
            </h5>
            <Badge variant={report.status || 'open'} size="sm">
              {report.status || 'open'}
            </Badge>
            {report.severity && (
              <Badge variant={report.severity} size="sm">
                {report.severity}
              </Badge>
            )}
          </div>
          {report.description && (
            <p className="text-sm text-secondary-600 mb-1 line-clamp-1">
              {report.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-secondary-500 flex-wrap">
            {report.unit && (
              <span className="flex items-center gap-1">
                <Home size={12} />
                Unit {report.unit}
              </span>
            )}
            {report.created_at && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDateTime(report.created_at)}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          {getStatusIcon(report.status)}
        </div>
      </div>
    </div>
  );

  if (!tenant) return null;

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <Modal.Header onClose={onClose}>
        <Modal.Title>Tenant Details</Modal.Title>
      </Modal.Header>

      <Modal.Content>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-secondary-600">Loading tenant details...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tenant Information Section */}
            <div className="bg-secondary-50 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold text-xl shadow-lg">
                  {tenant.tenant_name?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-secondary-800 mb-2">
                    {tenant.tenant_name || 'Unknown Tenant'}
                  </h3>
                  <div className="space-y-2">
                    {/* tenant_name is often an email */}
                    {tenant.tenant_name && tenant.tenant_name.includes('@') && (
                      <div className="flex items-center gap-2 text-secondary-600">
                        <Mail size={16} className="text-secondary-400" />
                        <span className="text-sm">{tenant.tenant_name}</span>
                      </div>
                    )}
                    {tenantData?.units && tenantData.units.length > 0 && (
                      <div className="flex items-center gap-2 text-secondary-600">
                        <Home size={16} className="text-secondary-400" />
                        <span className="text-sm">
                          Units: {tenantData.units.join(', ')}
                        </span>
                      </div>
                    )}
                    {userInfo?.unit_number && (
                      <div className="flex items-center gap-2 text-secondary-600">
                        <Building2 size={16} className="text-secondary-400" />
                        <span className="text-sm">
                          Primary Unit: {userInfo.unit_number}
                        </span>
                      </div>
                    )}
                    {userInfo?.role && (
                      <div className="flex items-center gap-2 text-secondary-600">
                        <User size={16} className="text-secondary-400" />
                        <span className="text-sm">
                          Role: {userInfo.role}
                        </span>
                      </div>
                    )}
                    {reports.length > 0 && reports[reports.length - 1]?.created_at && (
                      <div className="flex items-center gap-2 text-secondary-600">
                        <Calendar size={16} className="text-secondary-400" />
                        <span className="text-sm">
                          First report: {formatDate(reports[reports.length - 1]?.created_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Reports Sections */}
            <div>
              <h4 className="text-lg font-semibold text-secondary-800 mb-4">Reports</h4>
              {reports.length === 0 ? (
                <div className="bg-secondary-50 rounded-lg p-8 text-center">
                  <FileText size={48} className="mx-auto text-secondary-400 mb-3" />
                  <p className="text-secondary-600">No reports found for this tenant</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {openReports.length > 0 && (
                    <CollapsibleSection
                      title="Open Reports"
                      count={openReports.length}
                      isExpanded={openReportsExpanded}
                      onToggle={() => setOpenReportsExpanded(!openReportsExpanded)}
                    >
                      <div className="space-y-0">
                        {openReports.map((report) => (
                          <ReportItem key={report.id} report={report} />
                        ))}
                      </div>
                    </CollapsibleSection>
                  )}

                  {closedReports.length > 0 && (
                    <CollapsibleSection
                      title="Closed Reports"
                      count={closedReports.length}
                      isExpanded={closedReportsExpanded}
                      onToggle={() => setClosedReportsExpanded(!closedReportsExpanded)}
                    >
                      <div className="space-y-0">
                        {closedReports.map((report) => (
                          <ReportItem key={report.id} report={report} />
                        ))}
                      </div>
                    </CollapsibleSection>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal.Content>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>

    <TicketDetailModal
      isOpen={isTicketModalOpen}
      onClose={() => {
        setIsTicketModalOpen(false);
        setSelectedTicket(null);
      }}
      ticket={selectedTicket}
      canEditStatus={role === 'manager'}
    />
  </>
  );
}

export default TenantDetailsModal;
