import React, { useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { ShieldCheck, Activity } from 'lucide-react';

export const AuditLogsManagement = () => {
  const [logs] = useState([
    { id: 'log_1', userName: 'Alexander Wright', userRole: 'super_admin', action: 'ENROLL_STUDENT', module: 'Student Management', details: 'Enrolled Alex Rivera (Roll #101)', ipAddress: '192.168.1.10', status: 'Success', timestamp: '2026-08-04 10:15 AM' },
    { id: 'log_2', userName: 'Dr. Sarah Connor', userRole: 'teacher', action: 'SUBMIT_ATTENDANCE', module: 'Classroom Attendance', details: 'Recorded attendance for Physics 11-A', ipAddress: '192.168.1.42', status: 'Success', timestamp: '2026-08-04 09:30 AM' },
    { id: 'log_3', userName: 'Alexander Wright', userRole: 'super_admin', action: 'PUBLISH_NOTICE', module: 'Notice Board', details: 'Published Sports Day Announcement', ipAddress: '192.168.1.10', status: 'Success', timestamp: '2026-08-04 08:45 AM' },
    { id: 'log_4', userName: 'Marcus Rivera', userRole: 'parent', action: 'FEE_PAYMENT', module: 'Financial Invoices', details: 'Paid Term 1 Tuition Fee $4,500', ipAddress: '172.56.21.90', status: 'Success', timestamp: '2026-08-03 04:20 PM' },
    { id: 'log_5', userName: 'Guest System User', userRole: 'guest', action: 'LOGIN_ATTEMPT', module: 'Authentication', details: 'Failed password attempt for user admin', ipAddress: '198.51.100.4', status: 'Failed', timestamp: '2026-08-03 02:10 PM' },
  ]);

  const columns = [
    {
      header: 'Timestamp',
      cell: (row) => <span className="font-mono text-slate-400 text-[11px]">{row.timestamp}</span>,
    },
    {
      header: 'User & Role',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-100 block">{row.userName}</span>
          <Badge variant="purple" className="text-[9px]">{row.userRole}</Badge>
        </div>
      ),
    },
    {
      header: 'Action Executed',
      cell: (row) => (
        <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
          {row.action}
        </span>
      ),
    },
    { header: 'Module', accessor: 'module' },
    { header: 'Event Details', accessor: 'details' },
    {
      header: 'IP Address',
      cell: (row) => <span className="font-mono text-slate-400">{row.ipAddress}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'Success' ? 'success' : 'danger'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Enterprise System Audit & Activity Logs"
        subtitle="Real-time security auditing tracking user actions, mutations, IP addresses, and compliance logs"
        columns={columns}
        data={logs}
        filterKey="status"
        filterOptions={['Success', 'Failed']}
      />
    </div>
  );
};
