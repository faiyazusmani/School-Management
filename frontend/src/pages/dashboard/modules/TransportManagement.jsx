import React, { useEffect, useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { apiCall } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';
import { Bus, MapPin, Phone, Users, DollarSign, Eye, Edit3, Trash2, ShieldCheck, AlertCircle, Navigation } from 'lucide-react';

export const TransportManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [viewingRoute, setViewingRoute] = useState(null);
  const [deletingRoute, setDeletingRoute] = useState(null);

  const { token } = useAuth();

  const [formData, setFormData] = useState({
    routeNumber: '',
    routeName: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    monthlyFee: 120,
    capacity: 45,
    assignedStudentsCount: 38,
    stopsCount: 8,
    status: 'Active',
    startLocation: 'Central Station',
    endLocation: 'School Main Gate',
  });

  const mockRoutes = [
    {
      _id: 'tr_1',
      id: 'tr_1',
      routeNumber: 'R-101',
      routeName: 'North Corridor & Oakridge Route',
      vehicleNumber: 'BUS-7012',
      driverName: 'Robert Vance',
      driverPhone: '+1 (555) 789-0123',
      monthlyFee: 140,
      capacity: 50,
      assignedStudentsCount: 46,
      stopsCount: 10,
      status: 'Active',
      startLocation: 'North Oakridge Circle',
      endLocation: 'ScholarHub Main Campus',
    },
    {
      _id: 'tr_2',
      id: 'tr_2',
      routeNumber: 'R-102',
      routeName: 'Downtown & Metro Line',
      vehicleNumber: 'BUS-4024',
      driverName: 'Michael Sterling',
      driverPhone: '+1 (555) 345-6789',
      monthlyFee: 125,
      capacity: 45,
      assignedStudentsCount: 42,
      stopsCount: 8,
      status: 'Active',
      startLocation: 'Downtown Central Plaza',
      endLocation: 'ScholarHub Main Campus',
    },
    {
      _id: 'tr_3',
      id: 'tr_3',
      routeNumber: 'R-103',
      routeName: 'South Heights & Valley Express',
      vehicleNumber: 'BUS-9088',
      driverName: 'Arthur Pendelton',
      driverPhone: '+1 (555) 901-2345',
      monthlyFee: 160,
      capacity: 40,
      assignedStudentsCount: 39,
      stopsCount: 12,
      status: 'Active',
      startLocation: 'South Heights Gate 2',
      endLocation: 'ScholarHub Main Campus',
    },
    {
      _id: 'tr_4',
      id: 'tr_4',
      routeNumber: 'R-104',
      routeName: 'Westside Suburbs & Bay Area',
      vehicleNumber: 'BUS-3310',
      driverName: 'David Miller',
      driverPhone: '+1 (555) 567-8901',
      monthlyFee: 150,
      capacity: 50,
      assignedStudentsCount: 25,
      stopsCount: 7,
      status: 'Under Maintenance',
      startLocation: 'Westside Marina Blvd',
      endLocation: 'ScholarHub Main Campus',
    },
  ];

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await apiCall('/library/transport', 'GET', null, token);
      if (res.success && res.data && res.data.length > 0) {
        setRoutes(res.data);
      } else {
        setRoutes(mockRoutes);
      }
    } catch (err) {
      setRoutes(mockRoutes);
    } finally {
      setLoading(false);
    }
  };

  // Fleet Analytics
  const totalRoutes = routes.length;
  const totalFleet = routes.length;
  const activeBuses = routes.filter((r) => r.status === 'Active').length;
  const totalCommuters = routes.reduce((acc, r) => acc + (Number(r.assignedStudentsCount) || 0), 0);
  const totalCapacity = routes.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
  const totalFleetCapacity = totalCapacity;

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    if (!formData.routeNumber || !formData.routeName) return;

    try {
      if (editingRoute) {
        setRoutes((prev) =>
          prev.map((r) =>
            (r._id || r.id) === (editingRoute._id || editingRoute.id) ? { ...r, ...formData } : r
          )
        );
        toast.success(`Transport route ${formData.routeNumber} updated successfully!`);
        setEditingRoute(null);
      } else {
        const newRecord = {
          _id: `tr_${Date.now()}`,
          id: `tr_${Date.now()}`,
          ...formData,
        };
        setRoutes((prev) => [newRecord, ...prev]);
        toast.success(`Transport route ${formData.routeNumber} registered!`);
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save transport route');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingRoute) return;
    setRoutes((prev) => prev.filter((r) => (r._id || r.id) !== (deletingRoute._id || deletingRoute.id)));
    toast.success('Transport route removed');
    setDeletingRoute(null);
  };

  const resetForm = () => {
    setFormData({
      routeNumber: '',
      routeName: '',
      vehicleNumber: '',
      driverName: '',
      driverPhone: '',
      monthlyFee: 120,
      capacity: 45,
      assignedStudentsCount: 38,
      stopsCount: 8,
      status: 'Active',
      startLocation: 'Central Station',
      endLocation: 'School Main Gate',
    });
  };

  const columns = [
    {
      header: 'Route #',
      cell: (row) => (
        <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 text-xs">
          {row.routeNumber}
        </span>
      ),
    },
    {
      header: 'Route Name & Coverage',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-100 block text-xs">{row.routeName}</span>
          <span className="text-[11px] text-slate-400">
            {row.startLocation || 'Origin'} ➔ {row.endLocation || 'Campus'} ({row.stopsCount || 6} Stops)
          </span>
        </div>
      ),
    },
    {
      header: 'Bus Reg & Capacity',
      cell: (row) => (
        <div className="text-xs">
          <Badge variant="outline" className="font-mono font-bold">{row.vehicleNumber}</Badge>
          <span className="block text-[11px] text-emerald-400 font-semibold mt-1">
            {row.assignedStudentsCount || 30}/{row.capacity || 45} Commuters
          </span>
        </div>
      ),
    },
    {
      header: 'Driver Contact',
      cell: (row) => (
        <div className="text-xs">
          <span className="font-bold text-slate-100 block">{row.driverName}</span>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Phone className="w-3 h-3 text-indigo-400" /> {row.driverPhone}
          </span>
        </div>
      ),
    },
    {
      header: 'Monthly Fee',
      cell: (row) => <span className="font-bold text-emerald-400 text-xs">₹{row.monthlyFee} / mo</span>,
    },
    {
      header: 'Fleet Status',
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>
          {row.status || 'Active'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => setViewingRoute(row)}
            title="View Details"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setEditingRoute(row);
              setFormData({
                routeNumber: row.routeNumber || '',
                routeName: row.routeName || '',
                vehicleNumber: row.vehicleNumber || '',
                driverName: row.driverName || '',
                driverPhone: row.driverPhone || '',
                monthlyFee: row.monthlyFee || 120,
                capacity: row.capacity || 45,
                assignedStudentsCount: row.assignedStudentsCount || 30,
                stopsCount: row.stopsCount || 8,
                status: row.status || 'Active',
                startLocation: row.startLocation || 'Central Station',
                endLocation: row.endLocation || 'School Main Gate',
              });
            }}
            title="Edit Route"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingRoute(row)}
            title="Delete Route"
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">School Bus Transport & Route Logistics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage fleet bus routes, vehicle registration numbers, driver contacts, commuter seat occupancy & transport fees
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingRoute(null);
            setIsAddModalOpen(true);
          }}
        >
          + Add Transport Route
        </Button>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Routes</span>
            <Bus className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalRoutes}</div>
          <span className="text-[10px] text-slate-500">Active bus corridors</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Registered Fleet</span>
            <Navigation className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{totalFleet}</div>
          <span className="text-[10px] text-slate-500">Buses in operation</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Student Commuters</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{totalCommuters}</div>
          <span className="text-[10px] text-slate-500">Daily transport users</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Capacity</span>
            <MapPin className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{totalCapacity} Seats</div>
          <span className="text-[10px] text-slate-500">Fleet seating limit</span>
        </Card>
      </div>

      {/* Route Table */}
      <DataTable
        title="Transport Fleet Directory"
        subtitle="Track bus routes, registered vehicles, driver phone helplines, and capacity"
        columns={columns}
        data={routes}
        loading={loading}
        filterKey="status"
        filterOptions={['Active', 'Under Maintenance', 'Inactive']}
        emptyStateTitle="No transport routes found."
        onAdd={() => {
          resetForm();
          setEditingRoute(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingRoute}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRoute(null);
        }}
        title={editingRoute ? 'Edit Transport Route' : 'Register New Transport Route'}
      >
        <form onSubmit={handleSaveRoute} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Route Code *"
              placeholder="R-105"
              value={formData.routeNumber}
              onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
              required
            />
            <Input
              label="Vehicle Reg #"
              placeholder="BUS-5020"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
            />
          </div>

          <Input
            label="Route Name / Description *"
            placeholder="Eastside Suburbs & Campus Express"
            value={formData.routeName}
            onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Driver Full Name"
              placeholder="Robert Vance"
              value={formData.driverName}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
            />
            <Input
              label="Driver Contact Phone"
              placeholder="+1 (555) 789-0123"
              value={formData.driverPhone}
              onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Monthly Fee (₹)"
              type="number"
              value={formData.monthlyFee}
              onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
            />
            <Input
              label="Max Seat Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            />
            <Input
              label="Assigned Commuters"
              type="number"
              value={formData.assignedStudentsCount}
              onChange={(e) => setFormData({ ...formData, assignedStudentsCount: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Location (Origin)"
              placeholder="Central Square"
              value={formData.startLocation}
              onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Fleet Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingRoute(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingRoute ? 'Save Changes' : 'Register Route'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal isOpen={!!viewingRoute} onClose={() => setViewingRoute(null)} title="Transport Route Logistics Profile">
        {viewingRoute && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20 text-xs">
                {viewingRoute.routeNumber}
              </span>
              <Badge variant={viewingRoute.status === 'Active' ? 'success' : 'warning'}>
                {viewingRoute.status || 'Active'}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-white">{viewingRoute.routeName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div><b>Vehicle Reg #:</b> {viewingRoute.vehicleNumber}</div>
              <div><b>Monthly Transport Fee:</b> ₹{viewingRoute.monthlyFee}</div>
              <div><b>Driver Name:</b> {viewingRoute.driverName}</div>
              <div><b>Driver Phone:</b> {viewingRoute.driverPhone}</div>
              <div><b>Seat Capacity:</b> {viewingRoute.capacity} Seats</div>
              <div><b>Assigned Commuters:</b> {viewingRoute.assignedStudentsCount} Students</div>
              <div><b>Origin Location:</b> {viewingRoute.startLocation || 'Main Hub'}</div>
              <div><b>Destination:</b> {viewingRoute.endLocation || 'ScholarHub Campus'}</div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingRoute(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deletingRoute} onClose={() => setDeletingRoute(null)} title="Confirm Remove Bus Route">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove transport route <b>"{deletingRoute?.routeNumber} - {deletingRoute?.routeName}"</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingRoute(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
              Confirm Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
