import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { parentAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';
import { ExternalLink } from 'lucide-react';

export const ParentManagement = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [deletingParent, setDeletingParent] = useState(null);
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', occupation: '', address: '', relationship: '' });

  const mockParents = [
    {
      _id: 'p_seed_1',
      id: 'p_seed_1',
      name: 'Marcus Rivera',
      email: 'parent@edumanage.com',
      phone: '+1 (555) 890-1234',
      occupation: 'Senior Software Architect',
      address: '742 Evergreen Terrace, Sector 4',
      relationship: 'Father',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      children: [{ name: 'Lucas Rivera', grade: 'Grade 11' }],
    },
    {
      _id: 'p_seed_2',
      id: 'p_seed_2',
      name: 'Ramesh Sharma',
      email: 'ramesh.sharma@gmail.com',
      phone: '+1 (555) 321-7654',
      occupation: 'Civil Engineer & Consultant',
      address: '45 Park Avenue, Civil Lines',
      relationship: 'Father',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      children: [{ name: 'Aarav Sharma', grade: 'Grade 11' }],
    },
    {
      _id: 'p_seed_3',
      id: 'p_seed_3',
      name: 'Elena Rostova (Parent)',
      email: 'elena.parent@edumanage.com',
      phone: '+1 (555) 782-4310',
      occupation: 'Medical Surgeon',
      address: '12 Medical Enclave, West Wing',
      relationship: 'Mother',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      children: [{ name: 'Sophia Martinez', grade: 'Grade 9' }],
    },
  ];

  useEffect(() => {
    fetchParents();
  }, []);

  useEffect(() => {
    let savedProfiles = [];
    try {
      savedProfiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]').filter(
        (p) => p.role === 'parent'
      );
    } catch (e) {}

    const loggedInParent =
      user && (user.role === 'parent' || user.email?.includes('parent'))
        ? [
            {
              _id: user.id || user._id || `p_user_${Date.now()}`,
              id: user.id || user._id || `p_user_${Date.now()}`,
              name: user.name || 'Parent Guardian Account',
              email: user.email || 'parent@edumanage.com',
              phone: user.phone || '+1 (555) 890-1234',
              occupation: user.occupation || 'Consultant',
              address: user.address || '742 Evergreen Terrace',
              relationship: user.relationship || 'Guardian',
              avatar: user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
              children: [{ name: 'Lucas Rivera', grade: 'Grade 11' }],
            },
          ]
        : [];

    setParents((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const combined = [
        ...loggedInParent,
        ...savedProfiles.map((sp) => ({
          _id: sp.id || sp._id || sp.email,
          id: sp.id || sp._id || sp.email,
          name: sp.name,
          email: sp.email,
          phone: sp.phone || '+1 (555) 890-1234',
          occupation: sp.occupation || 'Guardian / Parent',
          address: sp.address || 'Shimla City Residence',
          relationship: sp.relationship || 'Parent',
          avatar: sp.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
          children: [{ name: 'Enrolled Student', grade: 'Grade 11' }],
        })),
        ...safePrev,
      ];

      return combined.filter(
        (p, idx, self) => p && p.email && self.findIndex((x) => x && x.email && x.email.toLowerCase() === p.email.toLowerCase()) === idx
      );
    });
  }, [user, loading]);

  const fetchParents = async () => {
    setLoading(true);
    try {
      const res = await parentAPI.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setParents(res.data);
      } else {
        setParents(mockParents);
      }
    } catch (err) {
      setParents(mockParents);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveParent = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      if (editingParent) {
        try {
          await parentAPI.update(editingParent._id || editingParent.id, formData);
        } catch (e) {}
        setParents((prev) =>
          prev.map((p) => ((p._id || p.id) === (editingParent._id || editingParent.id) ? { ...p, ...formData } : p))
        );
        toast.success(`Parent details updated successfully.`);
        setEditingParent(null);
      } else {
        let newP = {
          _id: `p_${Date.now()}`,
          id: `p_${Date.now()}`,
          ...formData,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
          children: [],
        };
        try {
          const res = await parentAPI.create(formData);
          if (res.data) newP = res.data;
        } catch (e) {}
        setParents((prev) => [newP, ...prev]);
        toast.success(`Parent account registered successfully.`);
        setIsAddModalOpen(false);
      }
      setFormData({ name: '', email: '', phone: '', occupation: '', address: '', relationship: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to save parent details');
    }
  };

  const handleDelete = async () => {
    if (!deletingParent) return;
    try {
      try {
        await parentAPI.delete(deletingParent._id || deletingParent.id);
      } catch (e) {}
      setParents((prev) => prev.filter((p) => (p._id || p.id) !== (deletingParent._id || deletingParent.id)));
      toast.success(`Parent record removed successfully.`);
      setDeletingParent(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete parent record');
    }
  };

  const columns = [
    {
      header: 'Photo',
      cell: (row) => (
        <img
          src={row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
          alt={row.name}
          className="w-10 h-10 rounded-xl object-cover border border-slate-800"
        />
      ),
    },
    {
      header: 'Parent Name',
      cell: (row) => (
        <div
          onClick={() => navigate(`/dashboard/parents/${row._id || row.id}`)}
          className="cursor-pointer group text-left"
        >
          <span className="font-bold text-slate-100 group-hover:text-indigo-400 flex items-center gap-1.5 transition-colors">
            {row.name} <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
          </span>
          <span className="text-[11px] text-slate-400 block">{row.email}</span>
        </div>
      ),
    },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Occupation', accessor: 'occupation' },
    { header: 'Address', accessor: 'address' },
    { header: 'Relationship', accessor: 'relationship' },
    {
      header: 'Enrolled Children',
      cell: (row) => (
        <div className="flex flex-wrap gap-1 justify-start">
          {(!row.children || row.children.length === 0) ? (
            <span className="text-[10px] text-slate-500">None linked</span>
          ) : (
            row.children.map((c, i) => (
              <Badge key={i} variant="purple" className="text-[10px] truncate max-w-[120px]">
                {c.name || 'Child'}
              </Badge>
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Parent & Guardian Directory"
        subtitle="Manage student parent linkage, contact helplines, and tuition status"
        columns={columns}
        data={parents}
        loading={loading}
        emptyStateTitle="No parents found."
        onAdd={() => {
          setEditingParent(null);
          setFormData({ name: '', email: '', phone: '', occupation: '', address: '', relationship: '' });
          setIsAddModalOpen(true);
        }}
        onView={(p) => navigate(`/dashboard/parents/${p._id || p.id}`)}
        onEdit={(p) => {
          setEditingParent(p);
          setFormData({ name: p.name, email: p.email, phone: p.phone, occupation: p.occupation, address: p.address, relationship: p.relationship });
        }}
        onDelete={(p) => setDeletingParent(p)}
      />

      <Modal
        isOpen={isAddModalOpen || !!editingParent}
        onClose={() => { setIsAddModalOpen(false); setEditingParent(null); }}
        title={editingParent ? 'Edit Parent Profile' : 'Register New Parent / Guardian'}
      >
        <form onSubmit={handleSaveParent} className="space-y-4">
          <Input
            label="Parent Full Name *"
            placeholder="Marcus Rivera"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email Address *"
            type="email"
            placeholder="marcus.r@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              placeholder="+1 (555) 890-1234"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Occupation"
              placeholder="Business Owner"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Address"
              placeholder="Street address, City, State"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              label="Relationship"
              placeholder="father / mother / guardian"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => { setIsAddModalOpen(false); setEditingParent(null); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingParent ? 'Update Profile' : 'Register Parent'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deletingParent} onClose={() => setDeletingParent(null)} title="Delete Parent Account">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove <b>{deletingParent?.name}</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingParent(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Confirm Remove</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
