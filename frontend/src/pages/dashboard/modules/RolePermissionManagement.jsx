import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ShieldCheck, Save, Check } from 'lucide-react';
import { toast } from '../../../components/ui/toast';

export const RolePermissionManagement = () => {
  const [permissions, setPermissions] = useState([
    { module: 'Student Management', admin: { read: true, write: true, delete: true }, teacher: { read: true, write: true, delete: false }, student: { read: true, write: false, delete: false }, parent: { read: true, write: false, delete: false } },
    { module: 'Teacher Directory', admin: { read: true, write: true, delete: true }, teacher: { read: true, write: false, delete: false }, student: { read: true, write: false, delete: false }, parent: { read: true, write: false, delete: false } },
    { module: 'Exam Gradebook', admin: { read: true, write: true, delete: true }, teacher: { read: true, write: true, delete: false }, student: { read: true, write: false, delete: false }, parent: { read: true, write: false, delete: false } },
    { module: 'Tuition Fee Invoices', admin: { read: true, write: true, delete: true }, teacher: { read: false, write: false, delete: false }, student: { read: true, write: false, delete: false }, parent: { read: true, write: true, delete: false } },
    { module: 'Notice Board', admin: { read: true, write: true, delete: true }, teacher: { read: true, write: true, delete: false }, student: { read: true, write: false, delete: false }, parent: { read: true, write: false, delete: false } },
  ]);

  const togglePermission = (mIdx, role, type) => {
    setPermissions((prev) =>
      prev.map((item, idx) => {
        if (idx === mIdx) {
          return {
            ...item,
            [role]: { ...item[role], [type]: !item[role][type] },
          };
        }
        return item;
      })
    );
  };

  const handleSaveMatrix = () => {
    toast.success('Role Based Access Control (RBAC) matrix permissions saved');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Fine-Grained Role Permission Matrix</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Grant or revoke Read, Write, and Delete access capabilities per user role
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleSaveMatrix}>
            <Save className="w-4 h-4 mr-1" /> Save RBAC Policy
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-3">Module Name</th>
                <th className="p-3 text-center">Super Admin</th>
                <th className="p-3 text-center">Teacher / Faculty</th>
                <th className="p-3 text-center">Student</th>
                <th className="p-3 text-center">Parent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-white">{p.module}</td>
                  {['admin', 'teacher', 'student', 'parent'].map((role) => (
                    <td key={role} className="p-3 text-center">
                      <div className="flex justify-center items-center gap-2 text-[10px]">
                        <button
                          onClick={() => togglePermission(idx, role, 'read')}
                          className={`px-2 py-1 rounded font-mono ${p[role].read ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}
                        >
                          READ
                        </button>
                        <button
                          onClick={() => togglePermission(idx, role, 'write')}
                          className={`px-2 py-1 rounded font-mono ${p[role].write ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}
                        >
                          WRITE
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
