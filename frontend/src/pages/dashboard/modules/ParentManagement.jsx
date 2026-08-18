import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { parentAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';
import { ExternalLink, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { compressImage, safeSetItem } from '../../../utils/imageCompressor';

export const ParentManagement = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [deletingParent, setDeletingParent] = useState(null);
  const { user, token } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occupation: '',
    address: '',
    relationship: 'Father',
    avatar: '',
  });

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
  ];

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    setLoading(true);
    let savedLocal = [];
    try {
      savedLocal = JSON.parse(localStorage.getItem('edumanage_parents') || '[]');
    } catch (e) {}

    let fetchedData = mockParents;
    try {
      const res = await parentAPI.getAll();
      if (res.success && res.data && res.data.length > 0) {
        fetchedData = res.data;
      }
    } catch (err) {}

    const combined = [...savedLocal, ...fetchedData];
    const normalized = combined.map((p) => {
      const customAv = p.email ? localStorage.getItem(`edumanage_avatar_${p.email}`) : null;
      return {
        ...p,
        avatar: customAv || p.avatar,
      };
    });

    const unique = normalized.filter(
      (p, idx, self) => p && (p._id || p.id || p.email) && self.findIndex((x) => (x.email && p.email && x.email.toLowerCase() === p.email.toLowerCase()) || (x._id || x.id) === (p._id || p.id)) === idx
    );

    setParents(unique);
    setLoading(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedBase64 = await compressImage(file, 250, 250, 0.6);
      setFormData((prev) => ({ ...prev, avatar: compressedBase64 }));
      toast.success('Parent photo compressed & ready! Click Save Changes to confirm.');
    }
  };

  const saveParentsToStorage = (list) => {
    safeSetItem('edumanage_parents', JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveParent = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in name and email');
      return;
    }

    try {
      const compressedAvatar = formData.avatar ? await compressImage(formData.avatar, 250, 250, 0.6) : formData.avatar;
      const finalData = { ...formData, avatar: compressedAvatar };

      if (finalData.avatar && finalData.email) {
        safeSetItem(`edumanage_avatar_${finalData.email}`, finalData.avatar);
      }

      let updatedList = [];
      if (editingParent) {
        try {
          await parentAPI.update(editingParent._id || editingParent.id, finalData);
        } catch (e) {}

        updatedList = parents.map((p) =>
          (p._id || p.id) === (editingParent._id || editingParent.id) ? { ...p, ...finalData } : p
        );
        setParents(updatedList);
        saveParentsToStorage(updatedList);
        toast.success('Parent profile & photo updated successfully.');
        setEditingParent(null);
      } else {
        let newParent = {
          _id: `p_${Date.now()}`,
          id: `p_${Date.now()}`,
          status: 'active',
          avatar: finalData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalData.name)}&background=f59e0b&color=fff&size=200`,
          children: [{ name: 'Enrolled Child', grade: 'Grade 11' }],
          ...finalData,
        };
        try {
          const res = await parentAPI.create(finalData);
          if (res && res.data) newParent = { ...newParent, ...res.data };
        } catch (e) {}

        updatedList = [newParent, ...parents];
        setParents(updatedList);
        saveParentsToStorage(updatedList);

        // Save to registered profiles for dashboard search & feed
        try {
          const profiles = JSON.parse(localStorage.getItem('edumanage_registered_profiles') || '[]');
          const updatedProfiles = [{ ...newParent, role: 'parent' }, ...profiles];
          safeSetItem('edumanage_registered_profiles', JSON.stringify(updatedProfiles));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}

        toast.success(`Parent ${finalData.name} registered & photo saved`);
        setIsAddModalOpen(false);
      }
      setFormData({ name: '', email: '', phone: '', occupation: '', address: '', relationship: 'Father', avatar: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to save parent record');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingParent) return;
    try {
      try {
        await parentAPI.delete(deletingParent._id || deletingParent.id);
      } catch (e) {}
      const updatedList = parents.filter((p) => (p._id || p.id) !== (deletingParent._id || deletingParent.id));
      setParents(updatedList);
      saveParentsToStorage(updatedList);
      toast.success(`Parent ${deletingParent.name} deleted`);
      setDeletingParent(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete parent');
    }
  };

  const columns = [
    {
      header: 'Photo',
      cell: (row) => {
        const customAv = row.email ? localStorage.getItem(`edumanage_avatar_${row.email}`) : null;
        const displayAvatar = customAv || row.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=f59e0b&color=fff&size=100`;
        return (
          <img
            src={displayAvatar}
            alt={row.name}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=f59e0b&color=fff&size=100`;
            }}
            className="w-10 h-10 rounded-xl object-cover border border-slate-800 bg-slate-950"
          />
        );
      },
    },
    {
      header: 'Parent Name',
      cell: (row) => (
        <div
          onClick={() => navigate(`/dashboard/parents/${row._id || row.id}`)}
          className="cursor-pointer group text-left"
        >
          <span className="font-bold text-slate-100 group-hover:text-amber-400 flex items-center gap-1.5 transition-colors">
            {row.name} <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
          </span>
          <span className="text-[11px] text-slate-400 block">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Occupation',
      accessor: 'occupation',
    },
    {
      header: 'Relationship',
      cell: (row) => <Badge variant="warning">{row.relationship || 'Guardian'}</Badge>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/parents/${row._id || row.id}`)}
            title="View Parent Profile"
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingParent(row);
              setFormData({
                name: row.name || '',
                email: row.email || '',
                phone: row.phone || '',
                occupation: row.occupation || '',
                address: row.address || '',
                relationship: row.relationship || 'Father',
                avatar: row.avatar || '',
              });
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeletingParent(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Parent Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <DataTable
        title="Parent & Guardian Management"
        subtitle="Manage student parent contacts, emergency phone numbers, and child relationship linkages"
        columns={columns}
        data={parents}
        loading={loading}
        filterKey="relationship"
        filterOptions={['Father', 'Mother', 'Guardian']}
        emptyStateTitle="No parents registered."
        onAdd={() => {
          setEditingParent(null);
          setFormData({ name: '', email: '', phone: '', occupation: '', address: '', relationship: 'Father', avatar: '' });
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Parent Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingParent}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingParent(null);
        }}
        title={editingParent ? 'Edit Parent Profile' : 'Register New Parent'}
      >
        <form onSubmit={handleSaveParent} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="Marcus Rivera"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email Address *"
            type="email"
            placeholder="parent@edumanage.com"
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
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Relationship</label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
          </div>
          <Input
            label="Occupation"
            placeholder="Senior Software Architect"
            value={formData.occupation}
            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
          />

          {/* Photo Upload & URL field */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Parent Profile Photo</label>
            <div className="flex gap-2">
              <Input
                icon={ImageIcon}
                placeholder="Paste Image URL or click Upload"
                value={formData.avatar}
                onChange={async (e) => {
                  const val = e.target.value;
                  const compressed = await compressImage(val, 250, 250, 0.6);
                  setFormData({ ...formData, avatar: compressed });
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Upload File
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingParent(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingParent ? 'Save Changes' : 'Register Parent'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Parent Modal */}
      <Modal
        isOpen={!!deletingParent}
        onClose={() => setDeletingParent(null)}
        title="Confirm Parent Deletion"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete parent <b>"{deletingParent?.name}"</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingParent(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
