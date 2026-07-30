import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import VehicleTable from '../components/VehicleTable';
import VehicleModal from '../components/VehicleModal';
import ConfirmModal from '../components/ConfirmModal';
import {
  getCarsApi,
  addCarApi,
  updateCarApi,
  deleteCarApi,
  purchaseCarApi,
  restockCarApi,
} from '../services/api';
import {
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Filter,
  Car,
} from 'lucide-react';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'instock' | 'out'

  // Modal States
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Confirmation Modal State
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    type: 'delete', // 'delete' | 'purchase' | 'restock'
    vehicle: null,
    loading: false,
  });

  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Helper for Toast Notifications
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch Vehicles from GET /api/cars
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCarsApi();
      // Support array response or nested data array
      const carsList = Array.isArray(data) ? data : data.cars || data.vehicles || [];
      setVehicles(carsList);
    } catch (err) {
      console.error('Error fetching cars:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        'Failed to connect to backend server at http://localhost:5000/api/cars';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Handle Add / Edit submit
  const handleSaveVehicle = async (payload) => {
    setModalLoading(true);
    setModalError('');
    try {
      if (editingVehicle) {
        // PUT /api/cars/:id
        const carId = editingVehicle._id || editingVehicle.id;
        const updated = await updateCarApi(carId, payload);
        showToast(
          `Vehicle "${payload.brand} ${payload.model}" updated successfully.`
        );
      } else {
        // POST /api/cars
        const created = await addCarApi(payload);
        showToast(
          `Vehicle "${payload.brand} ${payload.model}" added to inventory.`
        );
      }
      setIsVehicleModalOpen(false);
      setEditingVehicle(null);
      fetchVehicles();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        'Failed to save vehicle details.';
      setModalError(msg);
    } finally {
      setModalLoading(false);
    }
  };

  // Triggers for Confirmation Modal
  const promptPurchase = (vehicle) => {
    setConfirmModalState({
      isOpen: true,
      type: 'purchase',
      vehicle,
      loading: false,
    });
  };

  const promptRestock = (vehicle) => {
    setConfirmModalState({
      isOpen: true,
      type: 'restock',
      vehicle,
      loading: false,
    });
  };

  const promptDelete = (vehicle) => {
    setConfirmModalState({
      isOpen: true,
      type: 'delete',
      vehicle,
      loading: false,
    });
  };

  // Execute Confirmed Operation
  const handleExecuteConfirmedAction = async () => {
    const { type, vehicle } = confirmModalState;
    if (!vehicle) return;
    const carId = vehicle._id || vehicle.id;

    setConfirmModalState((prev) => ({ ...prev, loading: true }));
    setActionLoadingId(carId);

    try {
      if (type === 'purchase') {
        // PATCH /api/cars/:id/purchase
        await purchaseCarApi(carId);
        showToast(`Purchased 1 unit of "${vehicle.brand} ${vehicle.model}".`);
      } else if (type === 'restock') {
        // PATCH /api/cars/:id/restock
        await restockCarApi(carId);
        showToast(`Restocked 1 unit of "${vehicle.brand} ${vehicle.model}".`);
      } else if (type === 'delete') {
        // DELETE /api/cars/:id
        await deleteCarApi(carId);
        showToast(`Deleted "${vehicle.brand} ${vehicle.model}" from inventory.`);
      }

      setConfirmModalState({ isOpen: false, type: 'delete', vehicle: null, loading: false });
      fetchVehicles();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        `Failed to execute ${type} operation.`;
      showToast(msg, 'error');
      setConfirmModalState((prev) => ({ ...prev, loading: false }));
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter & Search Vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const search = searchTerm.toLowerCase().trim();
    const brandMatch = (v.brand || '').toLowerCase().includes(search);
    const modelMatch = (v.model || '').toLowerCase().includes(search);
    const yearMatch = (v.year || '').toString().includes(search);

    const matchesSearch = !search || brandMatch || modelMatch || yearMatch;

    const qty = Number(v.quantity) || 0;
    let matchesStock = true;
    if (stockFilter === 'instock') {
      matchesStock = qty > 0;
    } else if (stockFilter === 'out') {
      matchesStock = qty === 0;
    }

    return matchesSearch && matchesStock;
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-12">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        {/* Page Title & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Vehicle Inventory</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                {vehicles.length} Total Models
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time monitoring, stock control, and vehicle operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchVehicles}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-semibold cursor-pointer active:scale-95"
              title="Refresh inventory list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => {
                setEditingVehicle(null);
                setModalError('');
                setIsVehicleModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 ${
              toastMessage.type === 'error'
                ? 'bg-rose-950/80 border-rose-800 text-rose-200'
                : 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {toastMessage.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <span>{toastMessage.message}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Error Banner */}
        {error && (
          <div className="mb-6 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-200">API Connection Error</h4>
              <p className="text-xs text-rose-300/80 mt-1">{error}</p>
              <button
                onClick={fetchVehicles}
                className="mt-3 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold text-xs border border-rose-500/30 transition-colors cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <StatsCard vehicles={vehicles} />

        {/* Filters & Search Toolbar */}
        <div className="glass-panel rounded-2xl p-4 mb-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand, model, or year..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                stockFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Stock ({vehicles.length})
            </button>

            <button
              onClick={() => setStockFilter('instock')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                stockFilter === 'instock'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Available ({vehicles.filter((v) => Number(v.quantity) > 0).length})
            </button>

            <button
              onClick={() => setStockFilter('out')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                stockFilter === 'out'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Out of Stock ({vehicles.filter((v) => Number(v.quantity) === 0).length})
            </button>
          </div>
        </div>

        {/* Vehicles Table */}
        <VehicleTable
          vehicles={filteredVehicles}
          loading={loading}
          onEdit={(vehicle) => {
            setEditingVehicle(vehicle);
            setModalError('');
            setIsVehicleModalOpen(true);
          }}
          onDelete={promptDelete}
          onPurchase={promptPurchase}
          onRestock={promptRestock}
          actionLoadingId={actionLoadingId}
        />
      </main>

      {/* Add / Edit Modal */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setEditingVehicle(null);
        }}
        onSubmit={handleSaveVehicle}
        initialData={editingVehicle}
        loading={modalLoading}
        error={modalError}
      />

      {/* Action Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        onClose={() =>
          setConfirmModalState({ isOpen: false, type: 'delete', vehicle: null, loading: false })
        }
        onConfirm={handleExecuteConfirmedAction}
        title={
          confirmModalState.type === 'delete'
            ? 'Delete Vehicle?'
            : confirmModalState.type === 'purchase'
            ? 'Confirm Vehicle Purchase'
            : 'Confirm Vehicle Restock'
        }
        message={
          confirmModalState.type === 'delete'
            ? `Are you sure you want to permanently remove "${confirmModalState.vehicle?.brand} ${confirmModalState.vehicle?.model}" from the inventory database?`
            : confirmModalState.type === 'purchase'
            ? `This action will purchase 1 unit of "${confirmModalState.vehicle?.brand} ${confirmModalState.vehicle?.model}" and decrease stock quantity from ${confirmModalState.vehicle?.quantity} to ${Math.max(0, (Number(confirmModalState.vehicle?.quantity) || 0) - 1)}.`
            : `This action will restock 1 unit of "${confirmModalState.vehicle?.brand} ${confirmModalState.vehicle?.model}" and increase stock quantity from ${confirmModalState.vehicle?.quantity} to ${(Number(confirmModalState.vehicle?.quantity) || 0) + 1}.`
        }
        type={confirmModalState.type}
        loading={confirmModalState.loading}
      />
    </div>
  );
};

export default Dashboard;
